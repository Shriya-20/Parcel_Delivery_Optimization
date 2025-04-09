# # utils/map_utils.py
# import osmnx as ox
# import networkx as nx
# import os

# # osmnx (ox): A package,lets you download and analyze street networks from OpenStreetMap. needed for getting the road data.
# # networkx (nx): A library for creating, manipulating, and studying complex networks/graphs. used here to work with the road network.

# def get_road_network(place_name, save_path='data'):
#     """
#     retrieves a road network for a given place name and saves it.
#         place_name: The name of the location (e.g., "Udupi, Karnataka, India")
#         save_path: Where to save the map data (defaults to 'data' directory)
#     Fetch road network for a specified place and save it
#     """
#     print(f"Fetching road network for {place_name}...")
#     G = ox.graph_from_place(place_name, network_type='drive') #network_type='drive' => we want drivable roads (not pedestrian paths or bicycle lanes).
#     G = ox.add_edge_speeds(G) #Adds typical driving speeds to each road segment (edge in the graph). It uses road type data to estimate speeds.
#     G = ox.add_edge_travel_times(G) #Calculates the time it would take to drive each road segment based on its length and speed.
#     # These attributes-imp-they help calculate how long each delivery route will take.

#     # Create directory if it doesn't exist
#     os.makedirs(save_path, exist_ok=True)
    
#     # Save graph
#     filename = place_name.split(',')[0].lower().replace(' ', '_') #taking 1st part of name, replace space with _
#     filepath = os.path.join(save_path, f"{filename}.graphml")
#     ox.save_graphml(G, filepath) #saved in GraphML format, preserves all the attributes of the network.
#     print(f"Road network saved to {filepath}")
    
#     return G, filepath

# if __name__ == "__main__":
#     place_name = "Udupi, Karnataka, India"
#     G, filepath = get_road_network(place_name)



# utils/map_utils.py
import osmnx as ox
import networkx as nx
import os

def get_road_network(place_name, save_path='data'):
    """
    Fetch road network for a specified place and save it
    """
    print(f"Fetching road network for {place_name}...")
    G = ox.graph_from_place(place_name, network_type='drive')
    G = ox.add_edge_speeds(G)
    G = ox.add_edge_travel_times(G)
    
    # Convert node IDs to strings
    G = nx.relabel_nodes(G, {n: str(n) for n in G.nodes()})
    
    # Create directory if it doesn't exist
    os.makedirs(save_path, exist_ok=True)
    
    # Save graph
    filename = place_name.split(',')[0].lower().replace(' ', '_')
    filepath = os.path.join(save_path, f"{filename}.graphml")
    ox.save_graphml(G, filepath)
    print(f"Road network saved to {filepath}")
    
    return G, filepath

if __name__ == "__main__":
    place_name = "Udupi, Karnataka, India"
    G, filepath = get_road_network(place_name)