from typing import List, Dict, Any
import osmnx as ox
import networkx as nx
import datetime
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from shapely.geometry import Point
import folium

class MultiVehicleDeliveryOptimizer:
    """
    Optimizes delivery routes for multiple delivery persons in Udupi considering time windows and travel distances.
    Uses OR-Tools VRPTW solver with OSMnx for the road network.
    Each vehicle starts from different locations and doesn't need to return to depot.
    """
    
    def __init__(self, graph_path=None):
        """
        Initialize the delivery optimizer with an OSMnx graph.
        
        Args:
            graph_path: Path to a saved .graphml file for Udupi
        """
        # Load the graph from file or create a new one
        if graph_path:
            self.G = ox.load_graphml(graph_path)
        else:
            # Create a new graph for Udupi
            place_name = "Udupi, Karnataka, India"
            self.G = ox.graph_from_place(place_name, network_type='drive')
            self.G = ox.add_edge_speeds(self.G)
            self.G = ox.add_edge_travel_times(self.G)
        
        # Cache for nearest nodes
        self.nearest_node_cache = {}
        
    def optimize_routes(self, 
                      delivery_persons: List[Dict[str, Any]],
                      current_time: datetime.datetime,
                      deliveries: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Find optimal delivery routes for multiple delivery persons.
        
        Args:
            delivery_persons: List of delivery persons with their locations and IDs
            current_time: Current datetime 
            deliveries: List of deliveries with location and time window info
            
        Returns:
            Optimized route plan for each delivery person
        """
        # Prepare data for OR-Tools
        data = self._create_data_model(delivery_persons, current_time, deliveries)
        
        # Create virtual depot for vehicles that don't need to return
        num_locations = len(data['time_matrix'])
        virtual_depot_index = num_locations  # Virtual depot at the end
        
        # Extend time matrix to include virtual depot
        extended_matrix = []
        for row in data['time_matrix']:
            extended_row = row + [0]  # Zero time to reach virtual depot from any location
            extended_matrix.append(extended_row)
        # Add virtual depot row (zero time from virtual depot to anywhere - this won't be used)
        extended_matrix.append([0] * (num_locations + 1))
        
        data['time_matrix'] = extended_matrix
        data['time_windows'].append((0, 24*60))  # Flexible time window for virtual depot
        
        # Create Routing Model with multiple start points and single virtual end point
        manager = pywrapcp.RoutingIndexManager(
            len(data['time_matrix']),  # Total locations including virtual depot
            data['num_vehicles'],
            data['starts'],  # Different start locations for each vehicle  
            [virtual_depot_index] * data['num_vehicles']  # All vehicles end at virtual depot
        )
        routing = pywrapcp.RoutingModel(manager)
        
        # Define transit callback (travel time between locations)
        def time_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return data['time_matrix'][from_node][to_node]
        
        transit_callback_index = routing.RegisterTransitCallback(time_callback)
        
        # Set arc costs to travel times
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        
        # Add time window constraints
        self._add_time_dimension(routing, manager, transit_callback_index, data)
        
        # Make virtual depot droppable (vehicles don't actually need to visit it)
        virtual_depot_node_index = manager.NodeToIndex(virtual_depot_index)
        routing.AddDisjunction([virtual_depot_node_index], 0)  # Penalty 0 for not visiting
        
        # Set solution parameters
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_parameters.time_limit.seconds = 60
        search_parameters.log_search = True
        
        # Solve the problem
        solution = routing.SolveWithParameters(search_parameters)
        
        if not solution:
            # Try with relaxed constraints
            print("Initial solve failed, trying with relaxed constraints...")
            search_parameters.time_limit.seconds = 120
            solution = routing.SolveWithParameters(search_parameters)
            
        if solution:
            return self._process_solution(data, manager, routing, solution, delivery_persons, deliveries, current_time, virtual_depot_index)
        else:
            return {
                "status": "failed", 
                "message": "No solution found",
                "debug_info": {
                    "num_locations": len(data['time_matrix']) - 1,  # Exclude virtual depot
                    "num_vehicles": data['num_vehicles'],
                    "time_windows": data['time_windows'][:-1],  # Exclude virtual depot
                    "max_travel_time": max(max(row[:-1]) for row in data['time_matrix'][:-1]),
                    "current_time": current_time.isoformat(),
                    "delivery_persons": [dp['name'] for dp in delivery_persons]
                }
            }

    def _create_data_model(self, 
                          delivery_persons: List[Dict[str, Any]], 
                          current_time: datetime.datetime,
                          deliveries: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Create the data model for the OR-Tools solver.
        
        Args:
            delivery_persons: List of delivery persons with their locations
            current_time: Current time
            deliveries: List of deliveries with their locations and time windows
            
        Returns:
            Data model dictionary for OR-Tools
        """
        data = {}
        
        # Collect all locations (delivery person locations + delivery locations)
        all_locations = [dp['location'] for dp in delivery_persons] + [d['location'] for d in deliveries]
        
        # Map locations to nearest OSM nodes
        osm_nodes = [self._get_nearest_node(loc['lat'], loc['lng']) for loc in all_locations]
        
        # Generate time matrix (travel time between all locations using OSM network)
        data['time_matrix'] = self._generate_time_matrix_osm(osm_nodes)
        
        # Set number of vehicles equal to number of delivery persons
        data['num_vehicles'] = len(delivery_persons)
        
        # Set different start locations for each vehicle (their respective delivery person locations)
        data['starts'] = list(range(len(delivery_persons)))
        
        # Convert time windows from human time to solver time (minutes since current_time)
        base_time = int(current_time.timestamp() // 60)  # Current time in minutes
        
        # Process time windows
        data['time_windows'] = []
        
        # Add delivery person locations as starting points (available now with some flexibility)
        for _ in delivery_persons:
            data['time_windows'].append((0, 30))  # Can start now, with 30 min flexibility
        
        # Add time windows for each delivery
        for delivery in deliveries:
            start_time = int(delivery['time_window']['start'].timestamp() // 60) - base_time
            end_time = int(delivery['time_window']['end'].timestamp() // 60) - base_time
            
            # Ensure time windows are valid (not in the past)
            start_time = max(0, start_time)
            end_time = max(start_time + 15, end_time)  # Minimum 15 minutes service window
            
            # Add some flexibility for tight time windows
            if end_time - start_time < 30:  # Less than 30 minutes window
                if start_time > 60:  # If not immediate delivery
                    start_time = max(0, start_time - 15)  # Allow 15 min early arrival
                end_time = start_time + max(30, end_time - start_time + 15)  # Extend window
            
            data['time_windows'].append((start_time, end_time))
        
        data['osm_nodes'] = osm_nodes  # Store OSM nodes for route retrieval
        data['delivery_person_indices'] = list(range(len(delivery_persons)))
        data['delivery_indices'] = list(range(len(delivery_persons), len(delivery_persons) + len(deliveries)))
        
        return data
    
    def _get_nearest_node(self, lat: float, lng: float) -> int:
        """
        Get the nearest node in the OSM graph to the given coordinates.
        Uses caching for better performance.
        
        Args:
            lat: Latitude
            lng: Longitude
            
        Returns:
            OSM node ID
        """
        # Check cache first
        cache_key = f"{lat:.6f},{lng:.6f}"
        if cache_key in self.nearest_node_cache:
            return self.nearest_node_cache[cache_key]
        
        # Find nearest node
        nearest_node = ox.distance.nearest_nodes(self.G, lng, lat)
        
        # Cache the result
        self.nearest_node_cache[cache_key] = nearest_node
        
        return nearest_node
    
    def _generate_time_matrix_osm(self, nodes: List[int]) -> List[List[int]]:
        """
        Generate a matrix of travel times between all locations using OSM network.
        
        Args:
            nodes: List of OSM node IDs
            
        Returns:
            Matrix of travel times in minutes
        """
        n_locations = len(nodes)
        time_matrix = [[0 for _ in range(n_locations)] for _ in range(n_locations)]
        
        # Populate the time matrix
        for i in range(n_locations):
            for j in range(n_locations):
                if i == j:
                    time_matrix[i][j] = 0
                else:
                    # Get travel time between nodes using NetworkX shortest path
                    travel_time = self._get_osm_travel_time(nodes[i], nodes[j])
                    # Convert from seconds to minutes and round to nearest minute
                    time_matrix[i][j] = max(1, round(travel_time / 60))
        
        return time_matrix
    
    def _get_osm_travel_time(self, origin_node: int, dest_node: int) -> float:
        """
        Calculate travel time between two OSM nodes using the network.
        
        Args:
            origin_node: Origin OSM node ID
            dest_node: Destination OSM node ID
            
        Returns:
            Travel time in seconds
        """
        try:
            # Find the shortest path based on travel time
            route = nx.shortest_path(
                self.G, 
                origin_node, 
                dest_node, 
                weight='travel_time'
            )
            
            # Calculate the total travel time
            travel_time = 0
            for i in range(len(route) - 1):
                # Get edge data between consecutive nodes
                edge_data = self.G.get_edge_data(route[i], route[i + 1], 0)
                travel_time += edge_data.get('travel_time', 0)
            
            return travel_time
            
        except nx.NetworkXNoPath:
            # If no path exists, estimate using straight-line distance
            origin_point = Point((self.G.nodes[origin_node]['x'], self.G.nodes[origin_node]['y']))
            dest_point = Point((self.G.nodes[dest_node]['x'], self.G.nodes[dest_node]['y']))
            
            # Calculate distance in meters (rough approximation)
            distance = origin_point.distance(dest_point) * 111000  # Convert degrees to meters
            
            # Assume an average speed of 25 km/h in city
            return distance / (25 * 1000 / 3600)  # Travel time in seconds
    
    def _add_time_dimension(self, routing, manager, transit_callback_index, data):
        """
        Add time dimension to the routing model.
        
        Args:
            routing: OR-Tools routing model
            manager: OR-Tools routing index manager
            transit_callback_index: Index of transit callback
            data: Data model
        """
        max_wait_time = 720  # Allow 12 hours max wait time
        max_route_time = 1440  # 24 hours max route time

        # Add time dimension
        dimension_name = "Time"
        routing.AddDimension(
            transit_callback_index,
            max_wait_time,  # Slack (waiting time allowed)
            max_route_time,  # Maximum cumulative time for any vehicle
            False,  # Don't force start cumul to zero
            dimension_name
        )
        
        time_dimension = routing.GetDimensionOrDie(dimension_name)
        
        # Add time window constraints for each location (excluding virtual depot)
        for location_idx, time_window in enumerate(data["time_windows"]):
            if location_idx < len(data["time_windows"]) - 1:  # Skip virtual depot
                index = manager.NodeToIndex(location_idx)
                time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])

        # Add time minimization objective for each vehicle
        for i in range(data["num_vehicles"]):
            routing.AddVariableMinimizedByFinalizer(
                time_dimension.CumulVar(routing.Start(i))
            )
            routing.AddVariableMinimizedByFinalizer(
                time_dimension.CumulVar(routing.End(i))
            )
    
    def _process_solution(self, data, manager, routing, solution, delivery_persons, deliveries, current_time, virtual_depot_index):
        """
        Process the solution into a usable route plan with detailed path information.
        
        Args:
            data: Data model
            manager: OR-Tools routing index manager
            routing: OR-Tools routing model
            solution: OR-Tools solution
            delivery_persons: Original delivery person data
            deliveries: Original delivery data
            current_time: Current time
            virtual_depot_index: Index of the virtual depot
            
        Returns:
            Processed route plan with detailed paths for each delivery person
        """
        time_dimension = routing.GetDimensionOrDie("Time")
        routes = []
        total_time = 0
        total_distance = 0
        
        # Process each vehicle route
        for vehicle_id in range(data["num_vehicles"]):
            if routing.IsVehicleUsed(solution, vehicle_id):
                vehicle_route = {
                    'delivery_person': delivery_persons[vehicle_id],
                    'stops': [],
                    'total_time_minutes': 0,
                    'total_distance_meters': 0,
                    'start_time': current_time.isoformat(),
                    'estimated_finish_time': None
                }
                
                index = routing.Start(vehicle_id)
                route_nodes = []
                
                while not routing.IsEnd(index):
                    node_index = manager.IndexToNode(index)
                    
                    # Skip virtual depot
                    if node_index != virtual_depot_index:
                        route_nodes.append(node_index)
                    
                    # Move to next node
                    index = solution.Value(routing.NextVar(index))
                
                # Process the actual route (skip the starting depot in stops)
                previous_node_index = route_nodes[0] if route_nodes else None
                
                for i, node_index in enumerate(route_nodes[1:], 1):  # Skip first node (starting point)
                    if node_index >= len(delivery_persons):  # This is a delivery location
                        delivery_index = node_index - len(delivery_persons)
                        delivery = deliveries[delivery_index].copy()
                        
                        # Calculate arrival time using cumulative time
                        time_var = time_dimension.CumulVar(manager.NodeToIndex(node_index))
                        arrival_time = current_time + datetime.timedelta(minutes=solution.Min(time_var))
                        
                        # Get detailed path from previous location
                        detailed_path = self._get_detailed_path(
                            data['osm_nodes'][previous_node_index], 
                            data['osm_nodes'][node_index]
                        )
                        
                        # Calculate segment stats
                        segment_distance = sum(segment.get('length_meters', 0) for segment in detailed_path)
                        vehicle_route['total_distance_meters'] += segment_distance
                        
                        # Add stop information
                        stop_info = {
                            'delivery': delivery,
                            'arrival_time': arrival_time.isoformat(),
                            'sequence_number': len(vehicle_route['stops']) + 1,
                            'detailed_path': detailed_path,
                            'segment_distance_meters': segment_distance
                        }
                        
                        # Add wait time if there's slack
                        time_var = time_dimension.CumulVar(manager.NodeToIndex(node_index))
                        wait_time = solution.Max(time_var) - solution.Min(time_var)
                        if wait_time > 0:
                            stop_info['wait_time_minutes'] = wait_time
                        
                        vehicle_route['stops'].append(stop_info)
                        previous_node_index = node_index
                
                # Calculate total route time
                if route_nodes:
                    end_index = manager.NodeToIndex(route_nodes[-1])
                    vehicle_route['total_time_minutes'] = solution.Min(time_dimension.CumulVar(end_index))
                    
                    # Calculate estimated finish time
                    finish_time = current_time + datetime.timedelta(minutes=vehicle_route['total_time_minutes'])
                    vehicle_route['estimated_finish_time'] = finish_time.isoformat()
                
                # Add route summary
                vehicle_route['summary'] = {
                    'total_stops': len(vehicle_route['stops']),
                    'total_distance_km': round(vehicle_route['total_distance_meters'] / 1000, 2),
                    'total_time_hours': round(vehicle_route['total_time_minutes'] / 60, 2)
                }
                
                total_time += vehicle_route['total_time_minutes']
                total_distance += vehicle_route['total_distance_meters']
                
                routes.append(vehicle_route)
        
        return {
            'status': 'success',
            'routes': routes,
            'summary': {
                'total_vehicles_used': len(routes),
                'total_deliveries_assigned': sum(len(route['stops']) for route in routes),
                'total_time_minutes': total_time,
                'total_distance_km': round(total_distance / 1000, 2),
                'optimization_timestamp': current_time.isoformat()
            },
            'unassigned_deliveries': self._get_unassigned_deliveries(data, routing, solution, manager, deliveries, virtual_depot_index)
        }
    
    def _get_unassigned_deliveries(self, data, routing, solution, manager, deliveries, virtual_depot_index):
        """
        Get list of deliveries that couldn't be assigned to any vehicle.
        """
        assigned_delivery_indices = set()
        
        # Find all assigned deliveries
        for vehicle_id in range(data["num_vehicles"]):
            index = routing.Start(vehicle_id)
            while not routing.IsEnd(index):
                node_index = manager.IndexToNode(index)
                if node_index >= len(data['delivery_person_indices']) and node_index != virtual_depot_index:
                    delivery_idx = node_index - len(data['delivery_person_indices'])
                    assigned_delivery_indices.add(delivery_idx)
                index = solution.Value(routing.NextVar(index))
        
        # Find unassigned deliveries
        unassigned = []
        for i, delivery in enumerate(deliveries):
            if i not in assigned_delivery_indices:
                unassigned.append(delivery)
        
        return unassigned
    
    def _get_detailed_path(self, origin_node: int, dest_node: int) -> List[Dict[str, Any]]:
        """
        Get detailed path information between two OSM nodes.
        
        Args:
            origin_node: Origin OSM node ID
            dest_node: Destination OSM node ID
            
        Returns:
            List of path segments with coordinates and instructions
        """
        try:
            # Find the shortest path based on travel time
            route = nx.shortest_path(
                self.G, 
                origin_node, 
                dest_node, 
                weight='travel_time'
            )
            
            # Create detailed path information
            path_segments = []
            
            for i in range(len(route) - 1):
                # Get nodes data
                start_node = self.G.nodes[route[i]]
                end_node = self.G.nodes[route[i + 1]]
                
                # Get edge data
                edge_data = self.G.get_edge_data(route[i], route[i + 1], 0)
                
                # Extract road name if available
                road_name = edge_data.get('name', 'Unnamed Road')
                if isinstance(road_name, list):
                    road_name = road_name[0]  # Use first name in list
                
                # Extract road type
                road_type = edge_data.get('highway', 'road')
                
                # Calculate segment length in meters
                length = edge_data.get('length', 0)
                
                # Calculate travel time in seconds
                travel_time = edge_data.get('travel_time', 0)
                
                # Create segment entry
                segment = {
                    'start': {'lat': start_node['y'], 'lng': start_node['x']},
                    'end': {'lat': end_node['y'], 'lng': end_node['x']},
                    'road_name': road_name,
                    'road_type': road_type,
                    'length_meters': length,
                    'travel_time_seconds': travel_time
                }
                
                path_segments.append(segment)
            
            return path_segments
            
        except nx.NetworkXNoPath:
            # If no path exists, return empty list
            return []
    
    def visualize_routes(self, route_plan, file_name='multi_route_map.html'):
        """
        Visualize multiple routes on a map.
        
        Args:
            route_plan: The route plan returned by optimize_routes
            file_name: Output HTML file name
        """
        if route_plan['status'] != 'success' or not route_plan['routes']:
            print("No valid routes to visualize")
            return
        
        # Initialize the map at the center of all locations
        all_lats = []
        all_lngs = []
        
        for route in route_plan['routes']:
            all_lats.append(route['delivery_person']['location']['lat'])
            all_lngs.append(route['delivery_person']['location']['lng'])
            for stop in route['stops']:
                all_lats.append(stop['delivery']['location']['lat'])
                all_lngs.append(stop['delivery']['location']['lng'])
        
        center_lat = sum(all_lats) / len(all_lats)
        center_lng = sum(all_lngs) / len(all_lngs)
        
        route_map = folium.Map(location=[center_lat, center_lng], zoom_start=11)
        
        # Colors for different routes
        colors = ['red', 'blue', 'green', 'purple', 'orange', 'darkred', 
                  'lightred', 'beige', 'darkblue', 'darkgreen', 'cadetblue', 'darkpurple']
        
        # Add each route to the map
        for i, route in enumerate(route_plan['routes']):
            color = colors[i % len(colors)]
            
            # Add marker for delivery person starting point
            folium.Marker(
                location=[route['delivery_person']['location']['lat'], 
                          route['delivery_person']['location']['lng']],
                popup=f"<b>{route['delivery_person']['name']}</b><br>"
                      f"ID: {route['delivery_person']['id']}<br>"
                      f"Stops: {len(route['stops'])}<br>"
                      f"Distance: {route['summary']['total_distance_km']} km<br>"
                      f"Time: {route['summary']['total_time_hours']} hrs",
                icon=folium.Icon(color='green', icon='user', prefix='fa')
            ).add_to(route_map)
            
            # Add delivery location markers and paths
            for j, stop in enumerate(route['stops']):
                # Add delivery location marker
                folium.Marker(
                    location=[stop['delivery']['location']['lat'], stop['delivery']['location']['lng']],
                    popup=f"<b>Stop {stop['sequence_number']}</b><br>"
                          f"Customer: {stop['delivery']['customer']}<br>"
                          f"Address: {stop['delivery']['location'].get('address', 'N/A')}<br>"
                          f"ETA: {stop['arrival_time']}<br>"
                          f"Driver: {route['delivery_person']['name']}",
                    icon=folium.Icon(color=color, icon='gift')
                ).add_to(route_map)
                
                # Add path segments for this stop
                for segment in stop['detailed_path']:
                    folium.PolyLine(
                        locations=[
                            [segment['start']['lat'], segment['start']['lng']],
                            [segment['end']['lat'], segment['end']['lng']]
                        ],
                        color=color,
                        weight=4,
                        opacity=0.8,
                        popup=f"{segment['road_name']} ({segment['road_type']})"
                    ).add_to(route_map)
        
        # Add legend
        legend_html = f"""
        <div style="position: fixed; 
                    bottom: 50px; left: 50px; width: 300px; height: auto; 
                    background-color: white; border:2px solid grey; z-index:9999; 
                    font-size:14px; padding: 10px">
        <p><b>Route Optimization Results</b></p>
        <p>Total Vehicles Used: {route_plan['summary']['total_vehicles_used']}</p>
        <p>Total Deliveries: {route_plan['summary']['total_deliveries_assigned']}</p>
        <p>Total Distance: {route_plan['summary']['total_distance_km']} km</p>
        <p><i class="fa fa-user" style="color:green"></i> Delivery Person Start</p>
        <p><i class="fa fa-gift" style="color:red"></i> Delivery Location</p>
        </div>
        """
        route_map.get_root().html.add_child(folium.Element(legend_html))
        
        # Save to file
        route_map.save(file_name)
        print(f"Multi-route map saved to {file_name}")
    
    def print_solution_summary(self, route_plan):
        """
        Print a formatted summary of the route optimization results.
        
        Args:
            route_plan: The route plan returned by optimize_routes
        """
        if route_plan['status'] != 'success':
            print(f"Optimization failed: {route_plan['message']}")
            if 'debug_info' in route_plan:
                print("Debug Info:", route_plan['debug_info'])
            return
        
        print("\n" + "="*80)
        print("MULTI-VEHICLE DELIVERY ROUTE OPTIMIZATION RESULTS")
        print("="*80)
        
        summary = route_plan['summary']
        print(f"Optimization completed at: {summary['optimization_timestamp']}")
        print(f"Total vehicles used: {summary['total_vehicles_used']}")
        print(f"Total deliveries assigned: {summary['total_deliveries_assigned']}")
        print(f"Total estimated distance: {summary['total_distance_km']} km")
        print(f"Total estimated time: {round(summary['total_time_minutes']/60, 2)} hours")
        
        print("\n" + "-"*80)
        print("INDIVIDUAL ROUTE DETAILS")
        print("-"*80)
        
        for i, route in enumerate(route_plan['routes']):
            person = route['delivery_person']
            print(f"\nRoute {i+1}: {person['name']} (ID: {person['id']})")
            print(f"Starting Location: ({person['location']['lat']:.6f}, {person['location']['lng']:.6f})")
            print(f"Start Time: {route['start_time']}")
            print(f"Estimated Finish: {route['estimated_finish_time']}")
            print(f"Route Summary: {route['summary']['total_stops']} stops, "
                  f"{route['summary']['total_distance_km']} km, "
                  f"{route['summary']['total_time_hours']} hours")
            
            print(f"\nDelivery Sequence:")
            for stop in route['stops']:
                delivery = stop['delivery']
                print(f"  {stop['sequence_number']}. {delivery['customer']}")
                print(f"     Address: {delivery['location'].get('address', 'N/A')}")
                print(f"     ETA: {stop['arrival_time']}")
                print(f"     Package: {delivery['package_details']['description']} "
                      f"({delivery['package_details']['weight']} kg)")
                if 'wait_time_minutes' in stop:
                    print(f"     Wait time: {stop['wait_time_minutes']} minutes")
                print()
        
        if route_plan['unassigned_deliveries']:
            print("\n" + "-"*80)
            print("UNASSIGNED DELIVERIES")
            print("-"*80)
            for delivery in route_plan['unassigned_deliveries']:
                print(f"• {delivery['customer']} - {delivery['location'].get('address', 'N/A')}")
                print(f"  Time Window: {delivery['time_window']['start']} - {delivery['time_window']['end']}")
                print(f"  Package: {delivery['package_details']['description']} ({delivery['package_details']['weight']} kg)")
                print()


# Example usage function
def example_usage():
    """
    Example of how to use the MultiVehicleDeliveryOptimizer
    """
    
    # Sample data based on your input
    # delivery_persons = [
    #     # {
    #     #     "id": "0a29e7d9-b611-45c2-955c-65814acc8d2c",
    #     #     "name": "Pooja",
    #     #     "location": {"lat": 13.631596, "lng": 74.689995}
    #     # },
    #     # {
    #     #     "id": "1bca5624-347c-4c0f-ad3e-e1dfb122e957",
    #     #     "name": "Santhosh",
    #     #     "location": {"lat": 13.437, "lng": 74.744499}
    #     # },
    #     {
    #         "id": "43515eb5-1400-4a65-b5da-9f446384fd5a",
    #         "name": "Bhanu",
    #         "location": {"lat": 13.360501, "lng": 74.786369}
    #     },
    #     {
    #         "id": "5cb8f4f6-7c94-4172-a93a-bf59b7e9783f",
    #         "name": "Shriya",
    #         "location": {"lat": 13.340881, "lng": 74.742142}
    #     },
    #     {
    #         "id": "69ca617c-9259-492f-a73a-e9e351204678",
    #         "name": "Keerthan",
    #         "location": {"lat": 13.2151, "lng": 74.996178}
    #     }
    # ]
    
    # deliveries = [
    #     {
    #         "id": "b590c213-dcea-4080-939c-015216e5315b",
    #         "customer": "Priya Menon",
    #         "location": {
    #             "lat": 13.3747,
    #             "lng": 74.7631,
    #             "address": "Brahmavar, Udupi"
    #         },
    #         "time_window": {
    #             "start": datetime.datetime.fromisoformat("2025-05-26T09:00:00"),
    #             "end": datetime.datetime.fromisoformat("2025-05-26T11:00:00")
    #         },
    #         "package_details": {
    #             "weight": 1.5,
    #             "description": "Priority 0 delivery"
    #         }
    #     },
    #     {
    #         "id": "48a2f262-567f-438f-94ab-02809a635935",
    #         "customer": "Rohit Bhandary",
    #         "location": {
    #             "lat": 13.2144,
    #             "lng": 74.9989,
    #             "address": "Karkala, Udupi"
    #         },
    #         "time_window": {
    #             "start": datetime.datetime.fromisoformat("2025-05-26T11:00:00"),
    #             "end": datetime.datetime.fromisoformat("2025-05-26T13:00:00")
    #         },
    #         "package_details": {
    #             "weight": 4.1,
    #             "description": "Priority 2 delivery"
    #         }
    #     },
    #     {
    #         "id": "ca715f62-9725-4473-9cde-0ee0ec0d42b6",
    #         "customer": "Anita Kamath",
    #         "location": {
    #             "lat": 13.3141,
    #             "lng": 74.9058,
    #             "address": "Hebri, Udupi"
    #         },
    #         "time_window": {
    #             "start": datetime.datetime.fromisoformat("2025-05-26T14:00:00"),
    #             "end": datetime.datetime.fromisoformat("2025-05-26T16:00:00")
    #         },
    #         "package_details": {
    #             "weight": 2.8,
    #             "description": "Priority 2 delivery"
    #         }
    #     },
    #     {
    #         "id": "771136b0-8c5a-4901-9aa1-b4fd49e0d22f",
    #         "customer": "Suresh Acharya",
    #         "location": {
    #             "lat": 13.1315,
    #             "lng": 74.7594,
    #             "address": "Padubidri, Udupi"
    #         },
    #         "time_window": {
    #             "start": datetime.datetime.fromisoformat("2025-05-26T16:00:00"),
    #             "end": datetime.datetime.fromisoformat("2025-05-26T18:00:00")
    #         },
    #         "package_details": {
    #             "weight": 1.0,
    #             "description": "Priority 1 delivery"
    #         }
    #     }
    # ]
    # current_time = datetime.datetime.fromisoformat("2025-05-26T08:00:00")
    
    delivery_persons = [
        {
            "id": "43515eb5-1400-4a65-b5da-9f446384fd5a",
            "name": "Bhanu",
            "location": {"lat": 13.360501, "lng": 74.786369}
        },
        {
            "id": "5cb8f4f6-7c94-4172-a93a-bf59b7e9783f",
            "name": "Shriya",
            "location": {"lat": 13.340881, "lng": 74.742142}
        },
        {
            "id": "69ca617c-9259-492f-a73a-e9e351204678",
            "name": "Keerthan",
            "location": {"lat": 13.2151, "lng": 74.996178}
        },
        {
            "id": "new-driver-1",
            "name": "Arjun",
            "location": {
                "lat": 13.3141,
                "lng": 74.9058
            }
        },
        {
            "id": "new-driver-2",
            "name": "Meera",
            "location": {
                "lat": 13.1315,
                "lng": 74.7594
            }
        }
    ]

    deliveries = [
        {
            "id": "b590c213-dcea-4080-939c-015216e5315b",
            "customer": "Priya Menon",
            "location": {
                "lat": 13.3747,
                "lng": 74.7631,
                "address": "Brahmavar, Udupi"
            },
            "time_window": {
                "start": datetime.datetime.fromisoformat("2025-05-26T09:00:00"),
                "end": datetime.datetime.fromisoformat("2025-05-26T12:00:00")
            },
            "package_details": {
                "weight": 1.5,
                "description": "Priority 0 delivery"
            }
        },
        {
            "id": "48a2f262-567f-438f-94ab-02809a635935",
            "customer": "Rohit Bhandary",
            "location": {
                "lat": 13.2144,
                "lng": 74.9989,
                "address": "Karkala, Udupi"
            },
            "time_window": {
                "start": datetime.datetime.fromisoformat("2025-05-26T10:00:00"),
                "end": datetime.datetime.fromisoformat("2025-05-26T14:00:00")
            },
            "package_details": {
                "weight": 4.1,
                "description": "Priority 2 delivery"
            }
        },
        {
            "id": "ca715f62-9725-4473-9cde-0ee0ec0d42b6",
            "customer": "Anita Kamath",
            "location": {
                "lat": 13.3141,
                "lng": 74.9058,
                "address": "Hebri, Udupi"
            },
            "time_window": {
                "start": datetime.datetime.fromisoformat("2025-05-26T11:00:00"),
                "end": datetime.datetime.fromisoformat("2025-05-26T15:00:00")
            },
            "package_details": {
                "weight": 2.8,
                "description": "Priority 2 delivery"
            }
        },
        {
            "id": "771136b0-8c5a-4901-9aa1-b4fd49e0d22f",
            "customer": "Suresh Acharya",
            "location": {
                "lat": 13.1315,
                "lng": 74.7594,
                "address": "Padubidri, Udupi"
            },
            "time_window": {
                "start": datetime.datetime.fromisoformat("2025-05-26T12:00:00"),
                "end": datetime.datetime.fromisoformat("2025-05-26T16:00:00")
            },
            "package_details": {
                "weight": 1.0,
                "description": "Priority 1 delivery"
            }
        }
    ]

    current_time = datetime.datetime.fromisoformat("2025-05-26T08:00:00")
    
    # Initialize optimizer
    print("Initializing Multi-Vehicle Delivery Optimizer...")
    optimizer = MultiVehicleDeliveryOptimizer()
    
    # Optimize routes
    print("Optimizing routes...")
    result = optimizer.optimize_routes(delivery_persons, current_time, deliveries)
    
    # Print results
    optimizer.print_solution_summary(result)
    
    # Create visualization
    if result['status'] == 'success':
        optimizer.visualize_routes(result, 'udupi_delivery_routes.html')
        print(f"\n🗺️  Interactive map saved as 'udupi_delivery_routes.html'")
    
    return result


if __name__ == "__main__":
    # Run example
    result = example_usage()