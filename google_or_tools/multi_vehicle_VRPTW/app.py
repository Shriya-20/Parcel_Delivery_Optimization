#app.py
from flask import Flask, request, jsonify
import datetime
import os
import csv
import json
from typing import List, Dict, Any
from flask_cors import CORS, cross_origin

from multi_vehicle_optimizer import MultiVehicleDeliveryOptimizer

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize the optimizer with the graph (only once when the server starts)
GRAPH_PATH = os.environ.get('GRAPH_PATH', '../../data/udupi.graphml')
optimizer = MultiVehicleDeliveryOptimizer(graph_path=GRAPH_PATH)

# CSV storage configuration
CSV_STORAGE_DIR = os.environ.get('CSV_STORAGE_DIR', './csv_data')
CSV_REQUESTS_FILE = os.path.join(CSV_STORAGE_DIR, 'delivery_requests.csv')
CSV_ROUTES_FILE = os.path.join(CSV_STORAGE_DIR, 'delivery_routes.csv')
CSV_DELIVERIES_FILE = os.path.join(CSV_STORAGE_DIR, 'delivery_details.csv')

def ensure_csv_directory():
    """Create CSV storage directory if it doesn't exist"""
    if not os.path.exists(CSV_STORAGE_DIR):
        os.makedirs(CSV_STORAGE_DIR)

def initialize_csv_files():
    """Initialize CSV files with headers if they don't exist"""
    ensure_csv_directory()
    
    # Initialize delivery requests CSV
    if not os.path.exists(CSV_REQUESTS_FILE):
        with open(CSV_REQUESTS_FILE, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([
                'request_id', 'timestamp', 'current_time', 'num_delivery_persons', 
                'num_deliveries', 'total_vehicles_used', 'fallback_used', 'status'
            ])
    
    # Initialize delivery routes CSV
    if not os.path.exists(CSV_ROUTES_FILE):
        with open(CSV_ROUTES_FILE, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([
                'request_id', 'delivery_person_id', 'delivery_person_name', 
                'start_lat', 'start_lng', 'total_stops', 'total_time_minutes', 
                'total_distance_meters', 'route_note'
            ])
    
    # Initialize delivery details CSV
    if not os.path.exists(CSV_DELIVERIES_FILE):
        with open(CSV_DELIVERIES_FILE, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([
                'request_id', 'delivery_person_id', 'delivery_id', 'customer_name',
                'delivery_lat', 'delivery_lng', 'delivery_address', 'arrival_time',
                'time_window_start', 'time_window_end', 'wait_time_minutes',
                'stop_sequence', 'package_weight', 'package_description'
            ])

def generate_request_id():
    """Generate a unique request ID"""
    return f"REQ_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"

def store_request_data(request_id: str, request_data: Dict, route_plan: Dict):
    """Store the request and route data to CSV files"""
    try:
        timestamp = datetime.datetime.now().isoformat()
        
        # Store main request info
        with open(CSV_REQUESTS_FILE, 'a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([
                request_id,
                timestamp,
                request_data.get('current_time', ''),
                len(request_data.get('delivery_persons', [])),
                len(request_data.get('deliveries', [])),
                route_plan.get('total_vehicles_used', 0),
                route_plan.get('fallback_used', False),
                route_plan.get('status', 'unknown')
            ])
        
        # Store route information
        with open(CSV_ROUTES_FILE, 'a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            for route in route_plan.get('routes', []):
                dp = route['delivery_person']
                writer.writerow([
                    request_id,
                    dp.get('id', ''),
                    dp.get('name', ''),
                    dp['location']['lat'],
                    dp['location']['lng'],
                    len(route.get('stops', [])),
                    route.get('total_time_minutes', 0),
                    route.get('total_distance_meters', 0),
                    route.get('note', '')
                ])
        
        # Store individual delivery details
        with open(CSV_DELIVERIES_FILE, 'a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            for route in route_plan.get('routes', []):
                dp_id = route['delivery_person'].get('id', '')
                for idx, stop in enumerate(route.get('stops', [])):
                    delivery = stop['delivery']
                    package_details = delivery.get('package_details', {})
                    
                    writer.writerow([
                        request_id,
                        dp_id,
                        delivery.get('id', ''),
                        delivery.get('customer', ''),
                        delivery['location']['lat'],
                        delivery['location']['lng'],
                        delivery['location'].get('address', ''),
                        stop.get('arrival_time', ''),
                        delivery.get('time_window', {}).get('start', ''),
                        delivery.get('time_window', {}).get('end', ''),
                        stop.get('wait_time_minutes', 0),
                        idx + 1,  # Stop sequence
                        package_details.get('weight', ''),
                        package_details.get('description', '')
                    ])
        
        print(f"Successfully stored data for request {request_id}")
        return True
        
    except Exception as e:
        print(f"Error storing CSV data: {e}")
        return False

@app.route('/api/optimize-multi-route', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*')
def optimize_multi_route():
    """
    API endpoint to get optimized delivery routes for multiple delivery persons.
    Now includes CSV storage functionality.
    """
    try:
        if request.method == 'OPTIONS':
            # CORS preflight
            return '', 200
        
        # Generate unique request ID
        request_id = generate_request_id()
        
        # Parse request JSON
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "error": "No data provided",
                "data": None,
                "request_id": request_id
            }), 400
        
        # Validate required fields
        if 'delivery_persons' not in data or not data['delivery_persons']:
            return jsonify({
                "status": "error",
                "error": "Missing or empty delivery_persons list",
                "data": None,
                "request_id": request_id
            }), 400
            
        if 'deliveries' not in data or not data['deliveries']:
            return jsonify({
                "status": "error",
                "error": "Missing or empty deliveries list",
                "data": None,
                "request_id": request_id
            }), 400
        
        # Process current time (use provided time or current time)
        current_time = datetime.datetime.now()
        if 'current_time' in data and data['current_time']:
            try:
                current_time = datetime.datetime.fromisoformat(data['current_time'])
            except ValueError:
                return jsonify({
                    "status": "error",
                    "error": "Invalid current_time format. Use ISO format (YYYY-MM-DDTHH:MM:SS)",
                    "data": None,
                    "request_id": request_id
                }), 400
        
        # Validate delivery persons
        for dp in data['delivery_persons']:
            if 'id' not in dp or 'location' not in dp:
                return jsonify({
                    "status": "error",
                    "error": f"Delivery person missing required fields (id, location)",
                    "data": None,
                    "request_id": request_id
                }), 400
                
            if not all(key in dp['location'] for key in ['lat', 'lng']):
                return jsonify({
                    "status": "error",
                    "error": f"Delivery person {dp.get('id', 'unknown')} location missing lat/lng",
                    "data": None,
                    "request_id": request_id
                }), 400
        
        # Process deliveries and convert time windows to datetime objects
        processed_deliveries = []
        for delivery in data['deliveries']:
            # Check for required fields
            if not all(key in delivery for key in ['id', 'location', 'time_window']):
                return jsonify({
                    "status": "error",
                    "error": f"Delivery {delivery.get('id', 'unknown')} missing required fields",
                    "data": None,
                    "request_id": request_id
                }), 400
                
            # Check location fields
            if not all(key in delivery['location'] for key in ['lat', 'lng']):
                return jsonify({
                    "status": "error",
                    "error": f"Delivery {delivery.get('id', 'unknown')} location missing lat/lng",
                    "data": None,
                    "request_id": request_id
                }), 400
            
            # Process time windows
            try:
                time_window = {
                    'start': datetime.datetime.fromisoformat(delivery['time_window']['start']),
                    'end': datetime.datetime.fromisoformat(delivery['time_window']['end'])
                }
            except (ValueError, KeyError):
                return jsonify({
                    "status": "error",
                    "error": f"Delivery {delivery.get('id', 'unknown')} has invalid time_window format",
                    "data": None,
                    "request_id": request_id
                }), 400
            
            # Create processed delivery object
            processed_delivery = {
                'id': delivery['id'],
                'customer': delivery.get('customer', 'Unknown Customer'),
                'location': delivery['location'],
                'time_window': time_window,
                'package_details': delivery.get('package_details', {})
            }
            processed_deliveries.append(processed_delivery)
        
        # Calculate optimized routes
        route_plan = optimizer.optimize_routes(
            delivery_persons=data['delivery_persons'],
            current_time=current_time,
            deliveries=processed_deliveries
        )

        # Always return a result (either VRPTW success or VRP fallback)
        if route_plan['status'] == 'success':
            enriched_route_plan = enrich_route_plan(route_plan)
            
            # Store data to CSV files
            store_request_data(request_id, data, enriched_route_plan)
            
            return jsonify({
                "status": "success",
                "data": enriched_route_plan,
                "error": None,
                "request_id": request_id,
                "fallback_used": route_plan.get('fallback_used', False)
            }), 200
        else:
            # This should rarely happen now with fallback
            return jsonify({
                "status": "error",
                "error": route_plan.get('message', 'Both VRPTW and VRP failed'),
                "data": None,
                "request_id": request_id
            }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "data": None,
            "request_id": request_id if 'request_id' in locals() else "unknown"
        }), 500

@app.route('/api/csv-data', methods=['GET'])
@cross_origin(origin='*')
def get_csv_data():
    """
    API endpoint to retrieve stored CSV data.
    Query parameters:
    - type: 'requests', 'routes', or 'deliveries'
    - limit: number of records to return (optional)
    - request_id: filter by specific request ID (optional)
    """
    try:
        data_type = request.args.get('type', 'requests')
        limit = request.args.get('limit', type=int)
        request_id_filter = request.args.get('request_id')
        
        # Determine which CSV file to read
        if data_type == 'requests':
            csv_file = CSV_REQUESTS_FILE
        elif data_type == 'routes':
            csv_file = CSV_ROUTES_FILE
        elif data_type == 'deliveries':
            csv_file = CSV_DELIVERIES_FILE
        else:
            return jsonify({
                "status": "error",
                "error": "Invalid type. Use 'requests', 'routes', or 'deliveries'",
                "data": None
            }), 400
        
        if not os.path.exists(csv_file):
            return jsonify({
                "status": "success",
                "data": [],
                "message": f"No {data_type} data found"
            }), 200
        
        # Read CSV data
        data = []
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Filter by request_id if specified
                if request_id_filter and row.get('request_id') != request_id_filter:
                    continue
                data.append(row)
        
        # Apply limit if specified
        if limit and limit > 0:
            data = data[-limit:]  # Get last N records
        
        return jsonify({
            "status": "success",
            "data": data,
            "count": len(data),
            "type": data_type
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "data": None
        }), 500

@app.route('/api/export-csv', methods=['GET'])
@cross_origin(origin='*')
def export_csv():
    """
    API endpoint to export CSV files.
    Query parameters:
    - type: 'requests', 'routes', or 'deliveries'
    """
    try:
        data_type = request.args.get('type', 'requests')
        
        # Determine which CSV file to send
        if data_type == 'requests':
            csv_file = CSV_REQUESTS_FILE
            filename = 'delivery_requests.csv'
        elif data_type == 'routes':
            csv_file = CSV_ROUTES_FILE
            filename = 'delivery_routes.csv'
        elif data_type == 'deliveries':
            csv_file = CSV_DELIVERIES_FILE
            filename = 'delivery_details.csv'
        else:
            return jsonify({
                "status": "error",
                "error": "Invalid type. Use 'requests', 'routes', or 'deliveries'"
            }), 400
        
        if not os.path.exists(csv_file):
            return jsonify({
                "status": "error",
                "error": f"No {data_type} data file found"
            }), 404
        
        # Send file
        from flask import send_file
        return send_file(
            csv_file,
            as_attachment=True,
            download_name=filename,
            mimetype='text/csv'
        )
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

def enrich_route_plan(route_plan: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enhance the route plan with additional useful information.
    - Extract all waypoints for navigation
    - Format output for easier consumption by mapping libraries
    """
    enriched_plan = route_plan.copy()
    
    for route_idx, route in enumerate(enriched_plan['routes']):
        # Add a list of waypoints for the entire route
        all_waypoints = []
        
        # Start with the delivery person location as first waypoint
        all_waypoints.append({
            'lat': route['delivery_person']['location']['lat'],
            'lng': route['delivery_person']['location']['lng'],
            'type': 'start',
            'name': f"Delivery Person: {route['delivery_person']['id']}"
        })
        
        # Add all stops and their paths
        for stop_idx, stop in enumerate(route['stops']):
            # Extract the path details
            for segment_idx, segment in enumerate(stop['detailed_path']):
                # Add all intermediate waypoints from the path
                if segment_idx > 0:  # Skip first point as it's already included
                    all_waypoints.append({
                        'lat': segment['start']['lat'],
                        'lng': segment['start']['lng'],
                        'type': 'waypoint',
                        'road_name': segment['road_name'],
                        'road_type': segment['road_type']
                    })
                
                # Add the end point of the last segment for this stop
                if segment_idx == len(stop['detailed_path']) - 1:
                    all_waypoints.append({
                        'lat': segment['end']['lat'],
                        'lng': segment['end']['lng'],
                        'type': 'delivery_point',
                        'delivery_id': stop['delivery']['id'],
                        'customer': stop['delivery']['customer'],
                        'address': stop['delivery']['location'].get('address', 'No address provided'),
                        'arrival_time': stop['arrival_time']
                    })
        
        # Add the complete waypoints to the route
        enriched_plan['routes'][route_idx]['waypoints'] = all_waypoints
        
    return enriched_plan

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint to verify the API is running"""
    return jsonify({
        "status": "success",
        "message": "Multi-Vehicle Delivery Optimizer API is running"
    })

@app.route('/api/visualize-routes', methods=['POST'])
def visualize_routes():
    """
    Generate a visualization of the route plan and return the file path.
    
    Response:
    {
        "status": "success" or "error",
        "file_path": path to the generated HTML file,
        "error": error message if status is "error"
    }
    """
    try:
        # Parse request JSON
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "error": "No data provided",
                "file_path": None
            }), 400
        
        # Get the optimized routes
        route_plan = None
        if 'route_plan' in data:
            route_plan = data['route_plan']
        else:
            # First get the optimized routes if not provided
            routes_response = optimize_multi_route()
            
            if isinstance(routes_response, tuple) and routes_response[1] == 200:
                route_plan = routes_response[0].get_json()['data']
            else:
                return jsonify({
                    "status": "error",
                    "error": "Failed to generate route plan",
                    "file_path": None
                }), 500
        
        if not route_plan:
            return jsonify({
                "status": "error",
                "error": "Route plan is empty or invalid",
                "file_path": None
            }), 400
            
        # Generate a unique filename
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        file_name = f"multi_vehicle_routes_{timestamp}.html"
        
        # Create output directory if it doesn't exist
        output_dir = os.environ.get('OUTPUT_DIR', './output')
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        file_path = os.path.join(output_dir, file_name)
        
        # Generate the visualization
        generate_html_visualization(route_plan, file_path)
        
        # Return the file path or URL
        return jsonify({
            "status": "success",
            "file_path": file_path,
            "error": None
        }), 200
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "error": str(e),
            "file_path": None
        }), 500

def generate_html_visualization(route_plan, file_path):
    """
    Generate an HTML visualization of the route plan using Folium.
    
    Args:
        route_plan: The route plan data
        file_path: Where to save the HTML file
    """
    try:
        import folium
        from folium.features import DivIcon
        from branca.element import Figure
        import random
        
        # Create a figure with a specific size
        fig = Figure(width="100%", height="100%")
        
        # Find the center of all coordinates
        all_lats = []
        all_lngs = []
        
        for route in route_plan['routes']:
            # Add delivery person start position
            all_lats.append(route['delivery_person']['location']['lat'])
            all_lngs.append(route['delivery_person']['location']['lng'])
            
            # Add all waypoints
            for waypoint in route['waypoints']:
                all_lats.append(waypoint['lat'])
                all_lngs.append(waypoint['lng'])
        
        # Calculate center if we have coordinates
        if all_lats and all_lngs:
            center_lat = sum(all_lats) / len(all_lats)
            center_lng = sum(all_lngs) / len(all_lngs)
        else:
            # Default center (can be adjusted as needed)
            center_lat = 13.3409
            center_lng = 74.7421  # Default to Udupi coordinates
        
        # Create the map
        m = folium.Map(location=[center_lat, center_lng], zoom_start=14)
        fig.add_child(m)
        
        # Generate a unique color for each delivery person
        def get_random_color():
            r = random.randint(0, 255)
            g = random.randint(0, 255)
            b = random.randint(0, 255)
            return f'#{r:02x}{g:02x}{b:02x}'
        
        # Create a color dictionary for delivery persons
        colors = {route['delivery_person']['id']: get_random_color() for route in route_plan['routes']}
        
        # Plot each route
        for route_idx, route in enumerate(route_plan['routes']):
            dp = route['delivery_person']
            route_color = colors[dp['id']]
            
            # Add marker for delivery person starting point
            folium.Marker(
                location=[dp['location']['lat'], dp['location']['lng']],
                popup=f"Start: {dp.get('name', 'Delivery Person ' + dp['id'])}",
                icon=folium.Icon(color='green', icon='play', prefix='fa')
            ).add_to(m)
            
            # Draw the route path
            waypoints = route['waypoints']
            if len(waypoints) > 1:
                line_points = [(wp['lat'], wp['lng']) for wp in waypoints]
                folium.PolyLine(
                    line_points,
                    color=route_color,
                    weight=4,
                    opacity=0.8,
                    tooltip=f"Route for {dp.get('name', 'Delivery Person ' + dp['id'])}"
                ).add_to(m)
            
            # Add markers for delivery stops
            for stop_idx, stop in enumerate(route['stops']):
                delivery = stop['delivery']
                
                # Format arrival time
                arrival_time = stop['arrival_time']
                if isinstance(arrival_time, str):
                    formatted_time = arrival_time
                else:
                    # Assuming it's a datetime object that needs to be converted to string
                    formatted_time = arrival_time.strftime("%H:%M:%S")
                
                # Create popup content
                popup_content = f"""
                <div style="width:250px">
                    <b>Delivery #{stop_idx+1}</b><br>
                    Customer: {delivery['customer']}<br>
                    ID: {delivery['id']}<br>
                    Arrival: {formatted_time}<br>
                    {delivery['location'].get('address', '')}
                </div>
                """
                
                # Add stop marker
                folium.Marker(
                    location=[delivery['location']['lat'], delivery['location']['lng']],
                    popup=folium.Popup(popup_content, max_width=300),
                    icon=folium.Icon(color='red', icon='box', prefix='fa'),
                    tooltip=f"Delivery #{stop_idx+1}: {delivery['customer']}"
                ).add_to(m)
                
                # Add stop number marker
                folium.map.Marker(
                    [delivery['location']['lat'], delivery['location']['lng']],
                    icon=DivIcon(
                        icon_size=(20, 20),
                        icon_anchor=(10, 10),
                        html=f'<div style="font-size: 10pt; color: white; background-color: {route_color}; border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">{stop_idx+1}</div>'
                    )
                ).add_to(m)
        
        # Add a legend
        legend_html = '''
        <div style="position: fixed; bottom: 50px; left: 50px; z-index: 1000; background-color: white; padding: 10px; border: 2px solid grey; border-radius: 5px;">
        <h4>Delivery Routes</h4>
        '''
        
        for route in route_plan['routes']:
            dp = route['delivery_person']
            route_color = colors[dp['id']]
            legend_html += f'''
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="background-color: {route_color}; width: 15px; height: 15px; margin-right: 5px;"></div>
                <span>{dp.get('name', 'Delivery Person ' + dp['id'])}</span>
            </div>
            '''
        
        legend_html += '''
        <div style="display: flex; align-items: center; margin-top: 10px;">
            <div style="margin-right: 15px;">
                <i class="fa fa-play" style="color: green;"></i> Start
            </div>
            <div>
                <i class="fa fa-box" style="color: red;"></i> Delivery
            </div>
        </div>
        </div>
        '''
        
        m.get_root().html.add_child(folium.Element(legend_html))
        
        # Save the map
        m.save(file_path)
        
    except ImportError:
        # If folium is not installed, create a simple HTML file with instructions
        with open(file_path, 'w') as f:
            f.write(f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Route Visualization</title>
            </head>
            <body>
                <h1>Folium package not installed</h1>
                <p>To visualize routes, please install folium:</p>
                <code>pip install folium</code>
                <hr>
                <h2>Route Plan Data:</h2>
                <pre>{str(route_plan)}</pre>
            </body>
            </html>
            """)

# Initialize CSV files when the app starts
initialize_csv_files()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)