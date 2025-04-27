from flask import Flask, request, jsonify
import datetime
import os
from typing import List, Dict, Any
from flask_cors import CORS, cross_origin

# Import the MultiVehicleDeliveryOptimizer class
from multi_vehcile_optimizer import MultiVehicleDeliveryOptimizer

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize the optimizer with the graph (only once when the server starts)
GRAPH_PATH = os.environ.get('GRAPH_PATH', '../../data/udupi.graphml')
optimizer = MultiVehicleDeliveryOptimizer(graph_path=GRAPH_PATH)

@app.route('/api/optimize-multi-route', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*')
def optimize_multi_route():
    """
    API endpoint to get optimized delivery routes for multiple delivery persons.
    
    Request JSON format:
    {
        "delivery_persons": [
            {
                "id": string,
                "name": string,
                "location": {
                    "lat": float,
                    "lng": float
                }
            },
            ...
        ],
        "current_time": "ISO-format datetime string" (optional, defaults to now),
        "deliveries": [
            {
                "id": string,
                "customer": string,
                "location": {
                    "lat": float,
                    "lng": float,
                    "address": string (optional)
                },
                "time_window": {
                    "start": "ISO-format datetime string",
                    "end": "ISO-format datetime string"
                },
                "package_details": {
                    "weight": float (optional),
                    "description": string (optional)
                }
            },
            ...
        ]
    }
    
    Response:
    {
        "status": "success" or "error",
        "data": {route plan object} or null,
        "error": error message if status is "error"
    }
    """
    try:
        if request.method == 'OPTIONS':
            # CORS preflight
            return '', 200
            
        # Parse request JSON
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "error": "No data provided",
                "data": None
            }), 400
        
        # Validate required fields
        if 'delivery_persons' not in data or not data['delivery_persons']:
            return jsonify({
                "status": "error",
                "error": "Missing or empty delivery_persons list",
                "data": None
            }), 400
            
        if 'deliveries' not in data or not data['deliveries']:
            return jsonify({
                "status": "error",
                "error": "Missing or empty deliveries list",
                "data": None
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
                    "data": None
                }), 400
        
        # Validate delivery persons
        for dp in data['delivery_persons']:
            if 'id' not in dp or 'location' not in dp:
                return jsonify({
                    "status": "error",
                    "error": f"Delivery person missing required fields (id, location)",
                    "data": None
                }), 400
                
            if not all(key in dp['location'] for key in ['lat', 'lng']):
                return jsonify({
                    "status": "error",
                    "error": f"Delivery person {dp.get('id', 'unknown')} location missing lat/lng",
                    "data": None
                }), 400
        
        # Process deliveries and convert time windows to datetime objects
        processed_deliveries = []
        for delivery in data['deliveries']:
            # Check for required fields
            if not all(key in delivery for key in ['id', 'location', 'time_window']):
                return jsonify({
                    "status": "error",
                    "error": f"Delivery {delivery.get('id', 'unknown')} missing required fields",
                    "data": None
                }), 400
                
            # Check location fields
            if not all(key in delivery['location'] for key in ['lat', 'lng']):
                return jsonify({
                    "status": "error",
                    "error": f"Delivery {delivery.get('id', 'unknown')} location missing lat/lng",
                    "data": None
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
                    "data": None
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
        
        # Process the route plan to include waypoints in an easy-to-use format
        if route_plan['status'] == 'success':
            enriched_route_plan = enrich_route_plan(route_plan)
            return jsonify({
                "status": "success",
                "data": enriched_route_plan,
                "error": None
            }), 200
        else:
            return jsonify({
                "status": "error",
                "error": route_plan.get('message', 'Failed to optimize routes'),
                "data": None
            }), 500
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "error": str(e),
            "data": None
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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)