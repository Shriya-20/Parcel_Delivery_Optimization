import datetime
from udupidelivery_optimizer import UdupiDeliveryOptimizer

def main():
    # Initialize the optimizer with the pre-downloaded graph
    optimizer = UdupiDeliveryOptimizer(graph_path="../udupi.graphml")
    
    # Current date and time
    current_time = datetime.datetime.now()
    
    # Current location (example coordinates in Udupi)
    current_location = {
        'lat': 13.3409,  # Example latitude for Udupi
        'lng': 74.7421   # Example longitude for Udupi
    }
    
    # Sample undelivered packages with their time windows
    # In a real system, this would come from your database
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
                'start': current_time + datetime.timedelta(minutes=30),
                'end': current_time + datetime.timedelta(hours=2)
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
                'start': current_time + datetime.timedelta(minutes=60),
                'end': current_time + datetime.timedelta(hours=3)
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
                'start': current_time + datetime.timedelta(minutes=15),
                'end': current_time + datetime.timedelta(hours=1)
            },
            'package_details': {
                'weight': 4.2,
                'description': 'Electronics delivery'
            }
        },
        {
            'id': 'PKG004',
            'customer': 'Meera Iyer',
            'location': {
                'lat': 13.3542,
                'lng': 74.7522,
                'address': 'Kunjibettu, Udupi'
            },
            'time_window': {
                'start': current_time + datetime.timedelta(hours=2),
                'end': current_time + datetime.timedelta(hours=4)
            },
            'package_details': {
                'weight': 3.0,
                'description': 'Clothing package'
            }
        },
        {
            'id': 'PKG005',
            'customer': 'Amith Shetty',
            'location': {
                'lat': 13.3325,
                'lng': 74.7550,
                'address': 'Sri Krishna Temple, Udupi'
            },
            'time_window': {
                'start': current_time + datetime.timedelta(hours=1),
                'end': current_time + datetime.timedelta(hours=2, minutes=30)
            },
            'package_details': {
                'weight': 1.5,
                'description': 'Pharmacy delivery'
            }
        }
    ]
    
    # Get the optimized route
    route_plan = optimizer.optimize_route(
        current_location=current_location,
        current_time=current_time,
        deliveries=undelivered_deliveries,
        num_vehicles=1  # Single delivery person
    )
    
    # Print the route plan
    if route_plan['status'] == 'success':
        print(f"Successfully optimized route with {len(route_plan['routes'])} vehicles")
        
        for route in route_plan['routes']:
            print(f"\nRoute for vehicle {route['vehicle_id']}:")
            print(f"Total time: {route['total_time']} minutes")
            print(f"Total distance equivalent: {route['total_distance']} minutes of travel")
            
            print("\nDelivery sequence:")
            for i, stop in enumerate(route['stops'], 1):
                delivery = stop['delivery']
                print(f"\n{i}. Deliver package {delivery['id']} to {delivery['customer']}")
                print(f"   Address: {delivery['location']['address']}")
                print(f"   Estimated arrival: {stop['arrival_time']}")
                print(f"   Time window: {delivery['time_window']['start']} to {delivery['time_window']['end']}")
                if stop['wait_time'] > 0:
                    print(f"   Wait time at location: {stop['wait_time']} minutes")
                print(f"   Package: {delivery['package_details']['description']}")
                
                # Print first 2 segments of detailed path (abbreviated for readability)
                if stop['detailed_path']:
                    print(f"   Detailed route (first 2 segments):")
                    for j, segment in enumerate(stop['detailed_path'][:2], 1):
                        print(f"      Segment {j}: {segment['road_name']} ({segment['road_type']}) - {segment['length_meters']:.1f}m")
                    if len(stop['detailed_path']) > 2:
                        print(f"      ... and {len(stop['detailed_path']) - 2} more segments")
    else:
        print(f"Failed to optimize route: {route_plan['message']}")

    # Example of recalculation after completing a delivery
    def update_route_after_delivery(completed_delivery_id):
        print(f"\n\nDelivery {completed_delivery_id} completed!")
        
        # Update current location to the location of the completed delivery
        completed_delivery = next(d for d in undelivered_deliveries if d['id'] == completed_delivery_id)
        new_current_location = completed_delivery['location']
        
        # Update current time (assume delivery took 5 minutes)
        new_current_time = datetime.datetime.now()
        
        # Remove the completed delivery from undelivered list
        remaining_deliveries = [d for d in undelivered_deliveries if d['id'] != completed_delivery_id]
        
        print(f"Recalculating route for remaining {len(remaining_deliveries)} deliveries...")
        
        # Get the optimized route for remaining deliveries
        new_route_plan = optimizer.optimize_route(
            current_location=new_current_location,
            current_time=new_current_time,
            deliveries=remaining_deliveries,
            num_vehicles=1
        )
        
        if new_route_plan['status'] == 'success':
            print("Updated route plan:")
            route = new_route_plan['routes'][0]
            for i, stop in enumerate(route['stops'], 1):
                delivery = stop['delivery']
                print(f"{i}. {delivery['id']} to {delivery['customer']} - ETA: {stop['arrival_time']}")
                
            # Visualize the updated route
            optimizer.visualize_route(new_route_plan, file_name='updated_route_map.html')
        else:
            print(f"Failed to recalculate route: {new_route_plan['message']}")
    
    # Simulate completing the first delivery in the route
    if route_plan['status'] == 'success' and route_plan['routes'][0]['stops']:
        # Visualize the initial route
        optimizer.visualize_route(route_plan, file_name='initial_route_map.html')
        
        # Complete first delivery and recalculate
        first_delivery_id = route_plan['routes'][0]['stops'][0]['delivery']['id']
        update_route_after_delivery(first_delivery_id)

if __name__ == "__main__":
    main()