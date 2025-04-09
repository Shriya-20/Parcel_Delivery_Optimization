from flask import Flask, request, jsonify
import datetime
import os
from typing import List, Dict, Any

# Import the UdupiDeliveryOptimizer class
from udupidelivery_optimizer import UdupiDeliveryOptimizer
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://127.0.0.1:5500", "http://localhost:5500","http://127.0.0.1:5500/google_or_tools/api/frontend.html"]}})


# Initialize the optimizer with the graph (only once when the server starts)
# Adjust the path as needed for your deployment
GRAPH_PATH = os.environ.get('GRAPH_PATH', '../../data/udupi.graphml')
optimizer = UdupiDeliveryOptimizer(graph_path=GRAPH_PATH)

@app.route('/api/optimize-route', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*')
def optimize_route():
    """
    API endpoint to get an optimized delivery route.
    
    Request JSON format:
    {
        "current_location": {
            "lat": float,
            "lng": float
        },
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
        ],
        "num_vehicles": int (optional, defaults to 1)
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
        print(request.is_json)  # should be True
        print(request.get_json())  # should show your dict
  # Debugging line

        if not data:
            print("reached not data condition")
            return jsonify({
                "status": "error",
                "error": "No data provided",
                "data": None
            }), 400
        
        # Validate required fields
        if 'current_location' not in data:
            print("reached current_location condition")
            return jsonify({
                "status": "error",
                "error": "Missing current_location",
                "data": None
            }), 400
            
        if 'deliveries' not in data or not data['deliveries']:
            print("reached deliveries condition")
            return jsonify({
                "status": "error",
                "error": "Missing or empty deliveries list",
                "data": None
            }), 400
        
        # Process current time (use provided time or current time)
        current_time = datetime.datetime.now()
        if 'current_time' in data and data['current_time']:
            print("reached current_time condition")
            try:
                current_time = datetime.datetime.fromisoformat(data['current_time'])
            except ValueError:
                return jsonify({
                    "status": "error",
                    "error": "Invalid current_time format. Use ISO format (YYYY-MM-DDTHH:MM:SS)",
                    "data": None
                }), 400
        
        # Process deliveries and convert time windows to datetime objects
        processed_deliveries = []
        for delivery in data['deliveries']:
            print("reached delivery condition")
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
        
        # Get number of vehicles
        num_vehicles = data.get('num_vehicles', 1)
        
        # Calculate optimized route
        route_plan = optimizer.optimize_route(
            current_location=data['current_location'],
            current_time=current_time,
            deliveries=processed_deliveries,
            num_vehicles=num_vehicles
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
                "error": route_plan.get('message', 'Failed to optimize route'),
                "data": None
            }), 500
            
    except Exception as e:
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
        
        # Start with the current location as first waypoint
        # Assuming we could extract this from the first segment of the first stop
        if route['stops'] and route['stops'][0]['detailed_path']:
            first_segment = route['stops'][0]['detailed_path'][0]
            all_waypoints.append({
                'lat': first_segment['start']['lat'],
                'lng': first_segment['start']['lng'],
                'type': 'start',
                'name': 'Starting Point'
            })
        
        # Add all stops and their paths
        for stop_idx, stop in enumerate(route['stops']):
            # Extract the path details
            for segment_idx, segment in enumerate(stop['detailed_path']):
                # Add all intermediate waypoints from the path
                if segment_idx > 0:  # Skip first point as it's the end of previous segment
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
        
        # Calculate total distance in meters
        total_distance_meters = 0
        for stop in route['stops']:
            for segment in stop['detailed_path']:
                total_distance_meters += segment.get('length_meters', 0)
        
        enriched_plan['routes'][route_idx]['total_distance_meters'] = total_distance_meters
    
    return enriched_plan

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint to verify the API is running"""
    return jsonify({
        "status": "success",
        "message": "Udupi Delivery Optimizer API is running"
    })

@app.route('/api/visualization', methods=['POST'])
def create_visualization():
    """
    Generate a visualization of a route plan and return the file path.
    Requires the same input as optimize-route endpoint.
    
    Response:
    {
        "status": "success" or "error",
        "file_path": path to the generated HTML file,
        "error": error message if status is "error"
    }
    """
    try:
        # Get the route plan first
        data = request.get_json()
        
        # Reuse the optimize route logic
        response = optimize_route()
        
        # If the response is successful, generate visualization
        if response.status_code == 200:
            route_plan = response.get_json()['data']
            
            # Generate a unique filename
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            file_name = f"route_visualization_{timestamp}.html"
            file_path = os.path.join('static', 'visualizations', file_name)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            # Generate the visualization
            optimizer.visualize_route(route_plan, file_name=file_path)
            
            return jsonify({
                "status": "success",
                "file_path": file_path,
                "error": None
            }), 200
        else:
            # Just return the error from optimize_route
            return response
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "file_path": None
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)