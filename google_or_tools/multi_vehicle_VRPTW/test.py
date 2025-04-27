import osmnx as ox
import networkx as nx
import random
import folium
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

# Step 1: Load Udupi graph from saved GraphML file
graph_path = "../../data/udupi.graphml"
G = ox.load_graphml(graph_path)
# G = ox.speed.add_edge_speeds(G)
# G = ox.speed.add_edge_travel_times(G)

# Step 2: Randomly select drivers and delivery points
print("Selecting random points...")
all_nodes = list(G.nodes)

num_drivers = 5
num_deliveries = 20

driver_start_nodes = random.sample(all_nodes, num_drivers)
delivery_nodes = random.sample(all_nodes, num_deliveries)

all_points = driver_start_nodes + delivery_nodes

# Create index to OSM node mapping
index_to_osm = {}
for idx, osm_node in enumerate(all_points):
    index_to_osm[idx] = osm_node

# Step 3: Build a time matrix (shortest travel times between points)
print("Building time matrix...")
time_matrix = []

for from_node in all_points:
    row = []
    lengths = nx.shortest_path_length(G, source=from_node, weight='travel_time')
    for to_node in all_points:
        row.append(int(lengths.get(to_node, 999999)))  # if no path, set huge time
    time_matrix.append(row)

# Step 4: Define data for VRPTW
print("Setting up VRPTW...")
data = {}
data['time_matrix'] = time_matrix
data['num_vehicles'] = num_drivers
data['starts'] = list(range(num_drivers))
data['ends'] = list(range(num_drivers))

data['time_windows'] = []
# Give wide time windows for drivers
for _ in driver_start_nodes:
    data['time_windows'].append((0, 36000))  # 10 hours
# Give tighter time windows for deliveries
for _ in delivery_nodes:
    start = random.randint(0, 18000)  # Start anytime before 5 hours
    end = start + random.randint(3600, 7200)  # 1-2 hours window
    data['time_windows'].append((start, end))

# Step 5: Setup OR-Tools Routing
print("Building model...")
manager = pywrapcp.RoutingIndexManager(len(data['time_matrix']), data['num_vehicles'], data['starts'], data['ends'])
routing = pywrapcp.RoutingModel(manager)

def time_callback(from_index, to_index):
    from_node = manager.IndexToNode(from_index)
    to_node = manager.IndexToNode(to_index)
    return data['time_matrix'][from_node][to_node]

transit_callback_index = routing.RegisterTransitCallback(time_callback)
routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

# Add Time Window constraint
time = 'Time'
routing.AddDimension(
    transit_callback_index,
    3600,  # Allow waiting time
    36000,  # Max total time per vehicle
    False,
    time)
time_dimension = routing.GetDimensionOrDie(time)

for location_idx, time_window in enumerate(data['time_windows']):
    index = manager.NodeToIndex(location_idx)
    time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])

# Search parameters
search_parameters = pywrapcp.DefaultRoutingSearchParameters()
search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
search_parameters.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
search_parameters.time_limit.seconds = 30

# Solve
print("Solving...")
solution = routing.SolveWithParameters(search_parameters)

# Step 6: Output and Plot
if solution:
    print("Solution found! Plotting routes...")

    # Create Udupi base map
    # center_lat, center_lon = ox.utils_geo.graph_to_gdfs(G, nodes=False, edges=False).unary_union.centroid.coords[0]
    # m = folium.Map(location=[center_lon, center_lat], zoom_start=13)
    # Replace your center lat/lon calculation with:
    nodes, edges = ox.graph_to_gdfs(G)
    center_lat, center_lon = nodes.unary_union.centroid.coords[0]

    # Then use
    m = folium.Map(location=[center_lat, center_lon], zoom_start=13)


    # Colors for different drivers
    colors = ['red', 'blue', 'green', 'purple', 'orange', 'black']

    for vehicle_id in range(data['num_vehicles']):
        index = routing.Start(vehicle_id)
        route_osm_nodes = []
        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            osm_node_id = index_to_osm[node_index]
            route_osm_nodes.append(osm_node_id)
            index = solution.Value(routing.NextVar(index))

        if len(route_osm_nodes) > 1:
            # Get latitudes and longitudes
            latlons = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in route_osm_nodes]

            # Plot polyline
            folium.PolyLine(latlons, color=colors[vehicle_id % len(colors)], weight=5, opacity=0.7).add_to(m)

            # Add start marker
            start_lat, start_lon = latlons[0]
            folium.Marker([start_lat, start_lon], popup=f'Driver {vehicle_id} Start', icon=folium.Icon(color='green')).add_to(m)

            # Add end marker
            end_lat, end_lon = latlons[-1]
            folium.Marker([end_lat, end_lon], popup=f'Driver {vehicle_id} End', icon=folium.Icon(color='red')).add_to(m)

    # Save the map
    m.save('udupi_routes.html')
    print("Route map saved as 'udupi_routes.html'")
else:
    print("No solution found!")