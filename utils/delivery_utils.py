# utils/delivery_utils.py
import random
import pandas as pd
import os
import networkx as nx
import osmnx as ox

def generate_deliveries(G, num_deliveries=10, save_path='data'):
    """
    Generate random delivery points and time slots
    """
    print(f"Generating {num_deliveries} random deliveries...")
    nodes = list(G.nodes)
    
    deliveries = []
    for i in range(num_deliveries):
        loc = random.choice(nodes)  # This will already be a string if G was properly converted
        start_hour = random.choice([9, 11, 13, 15])  # hour-based slots
        end_hour = start_hour + 1
        deliveries.append({
            "id": i,
            "node": loc,  # Node is already a string
            "slot_start": f"{start_hour}:00",
            "slot_end": f"{end_hour}:00"
        })
    
    df_deliveries = pd.DataFrame(deliveries)
    
    # Create directory if it doesn't exist
    os.makedirs(save_path, exist_ok=True)
    
    # Save deliveries
    filepath = os.path.join(save_path, "deliveries.csv")
    df_deliveries.to_csv(filepath, index=False)
    print(f"Deliveries saved to {filepath}")
    
    return df_deliveries, filepath

if __name__ == "__main__":
    # Load the graph first
    graph_path = "data/udupi.graphml"
    if not os.path.exists(graph_path):
        print("Graph file not found. Fetching from OSM...")
        from map_utils import get_road_network
        place_name = "Udupi, Karnataka, India"
        G, _ = get_road_network(place_name)
    else:
        G = ox.load_graphml(graph_path)
    
    # Generate deliveries
    df_deliveries, _ = generate_deliveries(G, num_deliveries=10)
    print(df_deliveries.head())