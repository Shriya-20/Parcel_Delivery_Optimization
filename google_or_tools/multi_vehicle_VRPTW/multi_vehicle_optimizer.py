#multi_vehicle_optimizer

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
    
    #Find optimal delivery routes for multiple delivery persons.
    #First tries VRPTW, then falls back to VRP if needed.
    
        # First attempt: VRPTW with time windows
        try:
            result = self._solve_with_time_windows(delivery_persons, current_time, deliveries)
            if result['status'] == 'success':
                return result
        except Exception as e:
            print(f"VRPTW failed: {e}")
        
        # Fallback: VRP without time windows
        print("Falling back to VRP without time windows...")
        return self._solve_without_time_windows(delivery_persons, current_time, deliveries)


    def _solve_with_time_windows(self, delivery_persons, current_time, deliveries):
        """Solve using VRPTW (with time windows)"""
        data = self._create_data_model(delivery_persons, current_time, deliveries)
        
        manager = pywrapcp.RoutingIndexManager(
            len(data['time_matrix']), data['num_vehicles'], 
            data['starts'], data['ends']
        )
        routing = pywrapcp.RoutingModel(manager)
        
        # Transit callback
        def time_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return data['time_matrix'][from_node][to_node]
        
        transit_callback_index = routing.RegisterTransitCallback(time_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        
        # Add time dimension
        self._add_time_dimension(routing, manager, transit_callback_index, data)
        
        # Solve
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.time_limit.seconds = 30  # Reduced timeout
        
        solution = routing.SolveWithParameters(search_parameters)
        
        if solution:
            return self._process_solution(data, manager, routing, solution, 
                                        delivery_persons, deliveries, current_time)
        else:
            return {"status": "failed", "message": "VRPTW failed"}



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
        
        # Set start and end locations for each vehicle
        data['starts'] = list(range(len(delivery_persons)))
        data['ends'] = list(range(len(delivery_persons)))
        
        # Convert time windows from human time to solver time (minutes since current_time)
        base_time = int(current_time.timestamp() // 60)  # Current time in minutes
        
        # Process time windows
        data['time_windows'] = []
        
        # Add delivery person locations as depots (time window starts now)
        for _ in delivery_persons:
            data['time_windows'].append((0, 60))  # Allow 1-hour flexibility at start
        
        # Add time windows for each delivery
        for delivery in deliveries:
            start_time = int(delivery['time_window']['start'].timestamp() // 60) - base_time
            end_time = int(delivery['time_window']['end'].timestamp() // 60) - base_time
            
            # Ensure time windows are valid (not in the past)
            start_time = max(0, start_time)
            end_time = max(start_time + 30, end_time)
            
            # If time window is too far in future, make it more flexible
            if start_time > 600:  # More than 10 hours away
                start_time = max(0, start_time - 60)  # Allow 1 hour earlier arrival
            
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
    

    #modify this with ML enhanced version
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
            
            # Calculate distance in meters
            # Note: This is a rough approximation
            distance = origin_point.distance(dest_point) * 111000  # Convert degrees to meters

            # Assume an average speed of 65 km/h in city
            return distance / (65 * 1000 / 3600)  # Travel time in seconds
    
    def _add_time_dimension(self, routing, manager, transit_callback_index, data):
        """
        Add time dimension to the routing model.
        
        Args:
            routing: OR-Tools routing model
            manager: OR-Tools routing index manager
            transit_callback_index: Index of transit callback
            data: Data model
        """
        max_wait_time = 60  # Allow 60 minutes max wait time
        max_route_time = 480  # 8 hours max route time
        
        # Add time dimension
        dimension_name = "Time"
        routing.AddDimension(
            transit_callback_index,
            max_wait_time,
            max_route_time,
            False,  # Don't force start cumul to zero
            dimension_name
        )
        # max_wait_time = 120      # Increase to 2 hours
        # max_route_time = 12 * 60 # Increase to 12 hours

        # dimension_name = "Time"
        # routing.AddDimension(
        #     transit_callback_index,
        #     max_wait_time,
        #     max_route_time,
        #     False,
        #     dimension_name
        # )
        # max_wait_time = 60 * 60        # 60 minutes = 3600 seconds
        # max_route_time = 8 * 60 * 60   # 8 hours = 28800 seconds

        # dimension_name = "Time"
        # routing.AddDimension(
        #     transit_callback_index,
        #     max_wait_time,     # Slack
        #     max_route_time,    # Vehicle max travel time
        #     False,             # Don't force start cumul to zero
        #     dimension_name
        # )

        
        time_dimension = routing.GetDimensionOrDie(dimension_name)
        
        # Add time window constraints for each location
        for location_idx, time_window in enumerate(data["time_windows"]):
            index = manager.NodeToIndex(location_idx)
            time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])

        # Add time minimization objective
        for i in range(data["num_vehicles"]):
            routing.AddVariableMinimizedByFinalizer(
                time_dimension.CumulVar(routing.Start(i))
            )
            routing.AddVariableMinimizedByFinalizer(
                time_dimension.CumulVar(routing.End(i))
            )
    
    def _process_solution(self, data, manager, routing, solution, delivery_persons, deliveries, current_time):
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
            
        Returns:
            Processed route plan with detailed paths for each delivery person
        """
        time_dimension = routing.GetDimensionOrDie("Time")
        routes = []
        
        # Process each vehicle route
        for vehicle_id in range(data["num_vehicles"]):
            if routing.IsVehicleUsed(solution, vehicle_id):
                vehicle_route = {
                    'delivery_person': delivery_persons[vehicle_id],
                    'stops': [],
                    'total_time_minutes': 0,
                    'total_distance_meters': 0
                }
                
                index = routing.Start(vehicle_id)
                visited_nodes = [manager.IndexToNode(index)]
                previous_node_index = visited_nodes[0]
                
                while not routing.IsEnd(index):
                    time_var = time_dimension.CumulVar(index)
                    node_index = manager.IndexToNode(index)
                    
                    # Skip depot nodes (delivery person starting locations)
                    if node_index >= len(delivery_persons):
                        delivery_index = node_index - len(delivery_persons)
                        delivery = deliveries[delivery_index].copy()
                        
                        # Calculate arrival time
                        arrival_time = current_time + datetime.timedelta(minutes=solution.Min(time_var))
                        
                        # Get detailed path from previous location
                        detailed_path = self._get_detailed_path(
                            data['osm_nodes'][previous_node_index], 
                            data['osm_nodes'][node_index]
                        )
                        
                        # Calculate segment stats
                        segment_distance = sum(segment.get('length_meters', 0) for segment in detailed_path)
                        segment_time = sum(segment.get('travel_time_seconds', 0) for segment in detailed_path) / 60
                        
                        # Add to total
                        vehicle_route['total_distance_meters'] += segment_distance
                        
                        # Add stop information
                        vehicle_route['stops'].append({
                            'delivery': delivery,
                            'arrival_time': arrival_time.isoformat(),
                            'wait_time_minutes': solution.Max(time_var) - solution.Min(time_var),
                            'detailed_path': detailed_path
                        })
                    
                    # Update previous node
                    previous_node_index = node_index
                    
                    # Move to next node
                    index = solution.Value(routing.NextVar(index))
                
                # Calculate final route time
                vehicle_route['total_time_minutes'] = solution.Min(time_dimension.CumulVar(routing.End(vehicle_id)))
                
                # Add to routes list
                routes.append(vehicle_route)
        
        return {
            'status': 'success',
            'routes': routes,
            'total_vehicles_used': len(routes),
            'unassigned_deliveries': self._get_unassigned_deliveries(data, routing, solution, manager, deliveries)
        }
    
    def _get_unassigned_deliveries(self, data, routing, solution, manager, deliveries):
        """
        Get list of deliveries that couldn't be assigned to any vehicle.
        
        Args:
            data: Data model
            routing: OR-Tools routing model
            solution: OR-Tools solution
            manager: OR-Tools routing index manager
            deliveries: Original delivery data
            
        Returns:
            List of unassigned deliveries
        """
        unassigned_indices = []
        for node_idx in range(routing.Size()):
            if routing.IsStart(node_idx) or routing.IsEnd(node_idx):
                continue
            if solution.Value(routing.NextVar(node_idx)) == node_idx:
                node = manager.IndexToNode(node_idx)
                if node >= len(data['delivery_person_indices']):
                    delivery_idx = node - len(data['delivery_person_indices'])
                    unassigned_indices.append(delivery_idx)
        
        return [deliveries[idx] for idx in unassigned_indices]
    
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
        
        # Initialize the map at the first delivery person's location
        first_person = route_plan['routes'][0]['delivery_person']
        start_lat = first_person['location']['lat']
        start_lng = first_person['location']['lng']
        route_map = folium.Map(location=[start_lat, start_lng], zoom_start=13)
        
        # Colors for different routes
        colors = ['#FF0000', '#0000FF', '#00FF00', '#800080', '#FFA500', '#000000', 
                  '#008080', '#FF00FF', '#A52A2A', '#808000', '#008000', '#000080']
        
        # Add each route to the map
        for i, route in enumerate(route_plan['routes']):
            color = colors[i % len(colors)]
            
            # Add marker for delivery person starting point
            folium.Marker(
                location=[route['delivery_person']['location']['lat'], 
                          route['delivery_person']['location']['lng']],
                popup=f"Delivery Person: {route['delivery_person']['id']}",
                icon=folium.Icon(color='green', icon='user')
            ).add_to(route_map)
            
            # Create polylines for each route segment
            previous_location = route['delivery_person']['location']
            
            for stop in route['stops']:
                # Add delivery location marker
                folium.Marker(
                    location=[stop['delivery']['location']['lat'], stop['delivery']['location']['lng']],
                    popup=f"Customer: {stop['delivery']['customer']}<br>ID: {stop['delivery']['id']}<br>ETA: {stop['arrival_time']}",
                    icon=folium.Icon(color='blue', icon='info-sign')
                ).add_to(route_map)
                
                # Add path segments
                for segment in stop['detailed_path']:
                    # Extract coordinates for this segment
                    folium.PolyLine(
                        locations=[
                            [segment['start']['lat'], segment['start']['lng']],
                            [segment['end']['lat'], segment['end']['lng']]
                        ],
                        color=color,
                        weight=5,
                        opacity=0.7,
                        popup=segment['road_name']
                    ).add_to(route_map)
                
                # Update previous location
                previous_location = stop['delivery']['location']
        
        # Save to file
        route_map.save(file_name)
        print(f"Multi-route map saved to {file_name}")



        def _solve_without_time_windows(self, delivery_persons, current_time, deliveries):
            '''Solve using basic VRP (ignoring time windows)'''
            data = self._create_data_model_no_time_windows(delivery_persons, current_time, deliveries)
            
            manager = pywrapcp.RoutingIndexManager(
                len(data['time_matrix']), data['num_vehicles'],
                data['starts'], data['ends']
            )
            routing = pywrapcp.RoutingModel(manager)
            
            # Transit callback
            def distance_callback(from_index, to_index):
                from_node = manager.IndexToNode(from_index)
                to_node = manager.IndexToNode(to_index)
                return data['time_matrix'][from_node][to_node]
            
            transit_callback_index = routing.RegisterTransitCallback(distance_callback)
            routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
            
            # Solve without time constraints
            search_parameters = pywrapcp.DefaultRoutingSearchParameters()
            search_parameters.first_solution_strategy = (
                routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
            )
            search_parameters.time_limit.seconds = 60
            
            solution = routing.SolveWithParameters(search_parameters)
            
            if solution:
                return self._process_solution_no_time_windows(data, manager, routing, solution,
                                                            delivery_persons, deliveries, current_time)
            else:
                return {"status": "failed", "message": "Both VRPTW and VRP failed"}

        def _create_data_model_no_time_windows(self, delivery_persons, current_time, deliveries):
            """Create data model without time windows"""
            data = self._create_data_model(delivery_persons, current_time, deliveries)
            # Remove time windows - not needed for basic VRP
            del data['time_windows']
            return data

        def _process_solution_no_time_windows(self, data, manager, routing, solution, 
                                            delivery_persons, deliveries, current_time):
            """Process VRP solution without time considerations"""
            routes = []
            
            for vehicle_id in range(data["num_vehicles"]):
                if routing.IsVehicleUsed(solution, vehicle_id):
                    vehicle_route = {
                        'delivery_person': delivery_persons[vehicle_id],
                        'stops': [],
                        'total_time_minutes': 0,
                        'total_distance_meters': 0,
                        'note': 'Generated using VRP (time windows ignored)'
                    }
                    
                    index = routing.Start(vehicle_id)
                    route_time = 0
                    previous_node_index = manager.IndexToNode(index)
                    
                    while not routing.IsEnd(index):
                        node_index = manager.IndexToNode(index)
                        
                        if node_index >= len(delivery_persons):
                            delivery_index = node_index - len(delivery_persons)
                            delivery = deliveries[delivery_index].copy()
                            
                            # Estimate arrival time based on route order
                            travel_time = data['time_matrix'][previous_node_index][node_index]
                            route_time += travel_time
                            arrival_time = current_time + datetime.timedelta(minutes=route_time)
                            
                            # Get path details
                            detailed_path = self._get_detailed_path(
                                data['osm_nodes'][previous_node_index],
                                data['osm_nodes'][node_index]
                            )
                            
                            vehicle_route['stops'].append({
                                'delivery': delivery,
                                'arrival_time': arrival_time.isoformat(),
                                'wait_time_minutes': 0,
                                'detailed_path': detailed_path
                            })
                            
                            previous_node_index = node_index
                        
                        index = solution.Value(routing.NextVar(index))
                    
                    vehicle_route['total_time_minutes'] = route_time
                    routes.append(vehicle_route)
            
            return {
                'status': 'success',
                'routes': routes,
                'total_vehicles_used': len(routes),
                'fallback_used': True,
                'message': 'Routes generated using VRP fallback (time windows ignored)'
            }