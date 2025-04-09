import requests
import json
import datetime

def test_optimize_route_api():
    """
    Test the optimize-route API endpoint with sample delivery data
    """
    # API endpoint
    url = "http://localhost:5000/api/optimize-route"
    
    # Current date and time
    current_time = datetime.datetime.now()
    
    # Current location (example coordinates in Udupi)
    current_location = {
        'lat': 13.3409,  # Example latitude for Udupi
        'lng': 74.7421   # Example longitude for Udupi
    }
    
    # Sample undelivered packages with their time windows
    undelivered_deliveries = [
        {
            'id': 'PKG001',
            'customer': 'Rahul Sharma',
            'location': {
                'lat': 13.3356,
                'lng': 74.7477,
                'address': 'Diana Circle, Udupi'
            },
            'time_window': {
                'start': (current_time + datetime.timedelta(minutes=30)).isoformat(),
                'end': (current_time + datetime.timedelta(hours=2)).isoformat()
            },
            'package_details': {
                'weight': 2.5,
                'description': 'Food delivery'
            }
        },
        {
            'id': 'PKG002',
            'customer': 'Priya Patel',
            'location': {
                'lat': 13.3448,
                'lng': 74.7428,
                'address': 'Manipal University, Udupi'
            },
            'time_window': {
                'start': (current_time + datetime.timedelta(minutes=60)).isoformat(),
                'end': (current_time + datetime.timedelta(hours=3)).isoformat()
            },
            'package_details': {
                'weight': 1.0,
                'description': 'Document delivery'
            }
        },
        {
            'id': 'PKG003',
            'customer': 'Suresh Kumar',
            'location': {
                'lat': 13.3255,
                'lng': 74.7476,
                'address': 'Malpe Beach Road, Udupi'
            },
            'time_window': {
                'start': (current_time + datetime.timedelta(minutes=15)).isoformat(),
                'end': (current_time + datetime.timedelta(hours=1)).isoformat()
            },
            'package_details': {
                'weight': 4.2,
                'description': 'Electronics delivery'
            }
        }
    ]
    
    # Prepare request payload
    payload = {
        'current_location': current_location,
        'current_time': current_time.isoformat(),
        'deliveries': undelivered_deliveries,
        'num_vehicles': 1
    }
    
    # Make the API call
    response = requests.post(url, json=payload)
    
    # Process the response
    if response.status_code == 200:
        route_plan = response.json()
        
        print("Route plan successfully retrieved:")
        print(f"Status: {route_plan['status']}")
        
        if route_plan['status'] == 'success':
            data = route_plan['data']
            print(f"Total vehicles used: {data['total_vehicles_used']}")
            
            # Print waypoints for the first route
            if data['routes']:
                route = data['routes'][0]
                print(f"\nRoute for vehicle {route['vehicle_id']}:")
                print(f"Total time: {route['total_time']} minutes")
                print(f"Total distance: {route['total_distance_meters']} meters")
                
                print("\nWaypoints:")
                for i, waypoint in enumerate(route['waypoints']):
                    if waypoint['type'] == 'delivery_point':
                        print(f"\nDelivery Point {i}:")
                        print(f"  Customer: {waypoint['customer']}")
                        print(f"  Location: {waypoint['lat']}, {waypoint['lng']}")
                        print(f"  Address: {waypoint['address']}")
                        print(f"  Arrival Time: {waypoint['arrival_time']}")
                    elif i % 5 == 0:  # Print some of the waypoints to avoid too much output
                        print(f"Waypoint {i}: {waypoint['lat']}, {waypoint['lng']}")
                
                # Also get visualization
                print("\nGenerating visualization...")
                viz_response = requests.post("http://localhost:5000/api/visualization", json=payload)
                if viz_response.status_code == 200:
                    viz_data = viz_response.json()
                    print(f"Visualization created at: {viz_data['file_path']}")
                else:
                    print(f"Error generating visualization: {viz_response.text}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_optimize_route_api()