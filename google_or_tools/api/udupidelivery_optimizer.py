import osmnx as ox
import networkx as nx
import pandas as pd
import numpy as np
import datetime
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from typing import List, Dict, Tuple, Any
import geopandas as gpd
from shapely.geometry import Point
import folium


class UdupiDeliveryOptimizer:
    """
    Optimizes delivery routes in Udupi considering time windows and travel distances.
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
        
    def optimize_route(self, 
                      current_location: Dict[str, float],
                      current_time: datetime.datetime,
                      deliveries: List[Dict[str, Any]],
                      num_vehicles: int = 1) -> Dict[str, Any]:
        """
        Find optimal delivery route given current state and remaining deliveries.
        
        Args:
            current_location: Dict with 'lat' and 'lng' of current position
            current_time: Current datetime 
            deliveries: List of deliveries with location and time window info
            num_vehicles: Number of delivery vehicles/persons
            
        Returns:
            Optimized route plan
        """
        # Prepare data for OR-Tools
        data = self._create_data_model(current_location, current_time, deliveries, num_vehicles)
        
        # Create Routing Model
        manager = pywrapcp.RoutingIndexManager(
            len(data['time_matrix']),
            data['num_vehicles'],
            data['depot']
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
        
        # Set solution parameters
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        # Add timeout for real-time applications
        search_parameters.time_limit.seconds = 5
        
        # Solve the problem
        solution = routing.SolveWithParameters(search_parameters)
        
        if solution:
            return self._process_solution(data, manager, routing, solution, deliveries, current_time)
        else:
            return {"status": "failed", "message": "No solution found"}
    
    def _create_data_model(self, 
                          current_location: Dict[str, float], 
                          current_time: datetime.datetime,
                          deliveries: List[Dict[str, Any]],
                          num_vehicles: int) -> Dict[str, Any]:
        """
        Create the data model for the OR-Tools solver.
        
        Args:
            current_location: Current location coordinates
            current_time: Current time
            deliveries: List of deliveries with their locations and time windows
            num_vehicles: Number of delivery vehicles
            
        Returns:
            Data model dictionary for OR-Tools
        """
        data = {}
        
        # Prepare locations list (current location + delivery locations)
        locations = [current_location] + [d['location'] for d in deliveries]
        
        # Map locations to nearest OSM nodes
        osm_nodes = [self._get_nearest_node(loc['lat'], loc['lng']) for loc in locations]
        
        # Generate time matrix (travel time between all locations using OSM network)
        data['time_matrix'] = self._generate_time_matrix_osm(osm_nodes)
        
        # Convert time windows from human time to solver time (minutes since current_time)
        base_time = int(current_time.timestamp() // 60)  # Current time in minutes
        
        # Process time windows
        data['time_windows'] = []
        
        # Add depot (current location) time window - can start immediately
        data['time_windows'].append((0, 0))  # No wait time at current location
        
        # Add time windows for each delivery
        for delivery in deliveries:
            start_time = int(delivery['time_window']['start'].timestamp() // 60) - base_time
            end_time = int(delivery['time_window']['end'].timestamp() // 60) - base_time
            
            # Ensure time windows are valid (not in the past)
            start_time = max(0, start_time)
            end_time = max(start_time, end_time)
            
            data['time_windows'].append((start_time, end_time))
        
        data['num_vehicles'] = num_vehicles
        data['depot'] = 0  # Current location is the depot/start
        data['osm_nodes'] = osm_nodes  # Store OSM nodes for route retrieval
        
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
            
            # Calculate distance in meters
            # Note: This is a rough approximation
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
        max_wait_time = 30  # Allow 30 minutes max wait time
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
        
        time_dimension = routing.GetDimensionOrDie(dimension_name)
        
        # Add time window constraints for each location except depot
        for location_idx, time_window in enumerate(data["time_windows"]):
            if location_idx == data["depot"]:
                continue
            index = manager.NodeToIndex(location_idx)
            time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])

        # Add time window constraints for each vehicle start
        depot_idx = data["depot"]
        for vehicle_id in range(data["num_vehicles"]):
            index = routing.Start(vehicle_id)
            time_dimension.CumulVar(index).SetRange(
                data["time_windows"][depot_idx][0], data["time_windows"][depot_idx][1]
            )
            
        # Add time minimization objective
        for i in range(data["num_vehicles"]):
            routing.AddVariableMinimizedByFinalizer(
                time_dimension.CumulVar(routing.Start(i))
            )
            routing.AddVariableMinimizedByFinalizer(
                time_dimension.CumulVar(routing.End(i))
            )
    #SOME ERROR IN THE CODE BELOW, NEEDS TO BE FIXED
    # def _process_solution(self, data, manager, routing, solution, deliveries, current_time):
    #     """
    #     Process the solution into a usable route plan with detailed path information.
        
    #     Args:
    #         data: Data model
    #         manager: OR-Tools routing index manager
    #         routing: OR-Tools routing model
    #         solution: OR-Tools solution
    #         deliveries: Original delivery data
    #         current_time: Current time
            
    #     Returns:
    #         Processed route plan with detailed paths
    #     """
    #     time_dimension = routing.GetDimensionOrDie("Time")
    #     routes = []
    #     total_distance = 0
        
    #     for vehicle_id in range(data["num_vehicles"]):
    #         if not routing.IsVehicleUsed(solution, vehicle_id):
    #             continue
                
    #         index = routing.Start(vehicle_id)
    #         route = []
    #         route_distance = 0
            
    #         while not routing.IsEnd(index):
    #             node_index = manager.IndexToNode(index)
                
    #             # Skip the depot
    #             if node_index != 0:
    #                 time_var = time_dimension.CumulVar(index)
    #                 delivery_index = node_index - 1  # Adjust index to match deliveries list
                    
    #                 arrival_time = current_time + datetime.timedelta(minutes=solution.Min(time_var))
    #                 delivery = deliveries[delivery_index].copy()
    #                 delivery['estimated_arrival'] = arrival_time
                    
    #                 # Get detailed path to this delivery from previous location
    #                 previous_node_index = manager.IndexToNode(solution.Value(routing.PrevVar(index)))
    #                 detailed_path = self._get_detailed_path(
    #                     data['osm_nodes'][previous_node_index], 
    #                     data['osm_nodes'][node_index]
    #                 )
                    
    #                 route.append({
    #                     'delivery': delivery,
    #                     'arrival_time': arrival_time.isoformat(),
    #                     'wait_time': solution.Max(time_var) - solution.Min(time_var),
    #                     'detailed_path': detailed_path
    #                 })
                
    #             next_index = solution.Value(routing.NextVar(index))
    #             if not routing.IsEnd(next_index):
    #                 next_node = manager.IndexToNode(next_index)
    #                 route_distance += data['time_matrix'][node_index][next_node]
                
    #             index = next_index
            
    #         routes.append({
    #             'vehicle_id': vehicle_id,
    #             'stops': route,
    #             'total_time': solution.Min(time_dimension.CumulVar(index)),
    #             'total_distance': route_distance
    #         })
            
    #         total_distance += route_distance
        
    #     return {
    #         'status': 'success',
    #         'routes': routes,
    #         'total_distance': total_distance,
    #         'total_vehicles_used': len(routes)
    #     }
    def _process_solution(self, data, manager, routing, solution, deliveries, current_time):
        """
        Process the solution into a usable route plan with detailed path information.
        
        Args:
            data: Data model
            manager: OR-Tools routing index manager
            routing: OR-Tools routing model
            solution: OR-Tools solution
            deliveries: Original delivery data
            current_time: Current time
            
        Returns:
            Processed route plan with detailed paths
        """
        time_dimension = routing.GetDimensionOrDie("Time")
        routes = []
        total_distance = 0
        
        for vehicle_id in range(data["num_vehicles"]):
            if not routing.IsVehicleUsed(solution, vehicle_id):
                continue
                
            index = routing.Start(vehicle_id)
            route = []
            route_distance = 0
            
            # Track visited nodes for this route
            visited_nodes = [manager.IndexToNode(index)]
            
            while not routing.IsEnd(index):
                node_index = manager.IndexToNode(index)
                
                # Skip the depot
                if node_index != 0:
                    time_var = time_dimension.CumulVar(index)
                    delivery_index = node_index - 1  # Adjust index to match deliveries list
                    
                    arrival_time = current_time + datetime.timedelta(minutes=solution.Min(time_var))
                    delivery = deliveries[delivery_index].copy()
                    delivery['estimated_arrival'] = arrival_time
                    
                    # Get detailed path to this delivery from previous location
                    previous_node_index = visited_nodes[-1]  # Get the last visited node
                    detailed_path = self._get_detailed_path(
                        data['osm_nodes'][previous_node_index], 
                        data['osm_nodes'][node_index]
                    )
                    
                    route.append({
                        'delivery': delivery,
                        'arrival_time': arrival_time.isoformat(),
                        'wait_time': solution.Max(time_var) - solution.Min(time_var),
                        'detailed_path': detailed_path
                    })
                
                # Save current node to visited nodes list
                visited_nodes.append(node_index)
                
                next_index = solution.Value(routing.NextVar(index))
                if not routing.IsEnd(next_index):
                    next_node = manager.IndexToNode(next_index)
                    route_distance += data['time_matrix'][node_index][next_node]
                
                index = next_index
            
            routes.append({
                'vehicle_id': vehicle_id,
                'stops': route,
                'total_time': solution.Min(time_dimension.CumulVar(index)),
                'total_distance': route_distance
            })
            
            total_distance += route_distance
        
        return {
            'status': 'success',
            'routes': routes,
            'total_distance': total_distance,
            'total_vehicles_used': len(routes)
        }
    
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
        
    #some issue in the code below, needs to be fixed
    # def visualize_route(self, route_plan, file_name='route_map.html'):
    #     """
    #     Visualize the route on a map.
        
    #     Args:
    #         route_plan: The route plan returned by optimize_route
    #         file_name: Output HTML file name
    #     """
    #     if route_plan['status'] != 'success' or not route_plan['routes']:
    #         print("No valid route to visualize")
    #         return
        
    #     # Create a list of nodes to visit in order
    #     route = route_plan['routes'][0]  # Get first route
        
    #     # Start with the depot
    #     all_nodes = []
        
    #     # Add each stop's detailed path
    #     for stop in route['stops']:
    #         for segment in stop['detailed_path']:
    #             # Add the start node of each segment
    #             all_nodes.append((segment['start']['lat'], segment['start']['lng']))
            
    #         # Add the final destination node
    #         if stop['detailed_path']:
    #             last_segment = stop['detailed_path'][-1]
    #             all_nodes.append((last_segment['end']['lat'], last_segment['end']['lng']))
        
    #     # Create a GeoDataFrame for stops
    #     stops_data = []
    #     for stop in route['stops']:
    #         delivery = stop['delivery']
    #         stops_data.append({
    #             'geometry': Point(delivery['location']['lng'], delivery['location']['lat']),
    #             'customer': delivery['customer'],
    #             'arrival_time': stop['arrival_time'],
    #             'id': delivery['id']
    #         })
        
    #     if stops_data:
    #         stops_gdf = gpd.GeoDataFrame(stops_data, crs="EPSG:4326")
            
    #         # Initialize the map at the first stop or depot
    #         if all_nodes:
    #             start_lat, start_lng = all_nodes[0]
    #             route_map = folium.Map(location=[start_lat, start_lng], zoom_start=13)
    #         else:
    #             print("No nodes to visualize")
    #             return

    #         # Create route line
    #         route_line = ox.plot.plot_route_folium(
    #             self.G, 
    #             [self._get_nearest_node(lat, lng) for lat, lng in all_nodes],
    #             route_map=route_map,
    #             popup_attribute='name',
    #             color='#FF0000',
    #             weight=5
    #         )
            
    #         # Add stop markers
    #         for idx, row in stops_gdf.iterrows():
    #             popup_text = f"Customer: {row['customer']}<br>ID: {row['id']}<br>ETA: {row['arrival_time']}"
    #             folium.Marker(
    #                 location=[row.geometry.y, row.geometry.x],
    #                 popup=popup_text,
    #                 icon=folium.Icon(color='blue', icon='info-sign')
    #             ).add_to(route_map)
            
    #         # Save to file
    #         route_map.save(file_name)
    #         print(f"Route map saved to {file_name}")
    def visualize_route(self, route_plan, file_name='route_map.html'):
        """
        Visualize the route on a map.
        
        Args:
            route_plan: The route plan returned by optimize_route
            file_name: Output HTML file name
        """
        
        if route_plan['status'] != 'success' or not route_plan['routes']:
            print("No valid route to visualize")
            return
        
        # Create a list of nodes to visit in order
        route = route_plan['routes'][0]  # Get first route
        
        # Start with the depot
        all_nodes = []
        
        # Add each stop's detailed path
        for stop in route['stops']:
            for segment in stop['detailed_path']:
                # Add the start node of each segment
                all_nodes.append((segment['start']['lat'], segment['start']['lng']))
            
            # Add the final destination node
            if stop['detailed_path']:
                last_segment = stop['detailed_path'][-1]
                all_nodes.append((last_segment['end']['lat'], last_segment['end']['lng']))
        
        # Create a GeoDataFrame for stops
        stops_data = []
        for stop in route['stops']:
            delivery = stop['delivery']
            stops_data.append({
                'geometry': Point(delivery['location']['lng'], delivery['location']['lat']),
                'customer': delivery['customer'],
                'arrival_time': stop['arrival_time'],
                'id': delivery['id']
            })
        
        if stops_data:
            stops_gdf = gpd.GeoDataFrame(stops_data, crs="EPSG:4326")
            
            # Initialize the map at the first stop or depot
            if all_nodes:
                start_lat, start_lng = all_nodes[0]
                route_map = folium.Map(location=[start_lat, start_lng], zoom_start=13)
            else:
                print("No nodes to visualize")
                return

            # Get the OSM nodes for the route
            osm_nodes = [self._get_nearest_node(lat, lng) for lat, lng in all_nodes]
            
            # Create route segments
            for i in range(len(osm_nodes)-1):
                try:
                    # Get the shortest path between consecutive nodes
                    path = nx.shortest_path(self.G, osm_nodes[i], osm_nodes[i+1], weight='travel_time')
                    
                    # Extract coordinates for each node in the path
                    path_coords = []
                    for node in path:
                        y = self.G.nodes[node]['y']  # latitude
                        x = self.G.nodes[node]['x']  # longitude
                        path_coords.append((y, x))
                    
                    # Add path to the map
                    folium.PolyLine(
                        locations=path_coords,
                        color='#FF0000',
                        weight=5,
                        opacity=0.7
                    ).add_to(route_map)
                    
                except nx.NetworkXNoPath:
                    # If no path exists, just draw a straight line
                    start = (self.G.nodes[osm_nodes[i]]['y'], self.G.nodes[osm_nodes[i]]['x'])
                    end = (self.G.nodes[osm_nodes[i+1]]['y'], self.G.nodes[osm_nodes[i+1]]['x'])
                    folium.PolyLine(
                        locations=[start, end],
                        color='#FF0000',
                        weight=5,
                        opacity=0.3,
                        dash_array='10'
                    ).add_to(route_map)
            
            # Add stop markers
            for idx, row in stops_gdf.iterrows():
                popup_text = f"Customer: {row['customer']}<br>ID: {row['id']}<br>ETA: {row['arrival_time']}"
                folium.Marker(
                    location=[row.geometry.y, row.geometry.x],
                    popup=popup_text,
                    icon=folium.Icon(color='blue', icon='info-sign')
                ).add_to(route_map)
            
            # Save to file
            route_map.save(file_name)
            print(f"Route map saved to {file_name}")