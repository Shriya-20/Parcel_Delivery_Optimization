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