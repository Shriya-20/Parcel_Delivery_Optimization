#main.py
import os
import argparse
from utils.map_utils import get_road_network
from utils.delivery_utils import generate_deliveries
from scripts.train import train_dqn
from scripts.evaluate import evaluate_agent
import osmnx as ox

def main():
    parser = argparse.ArgumentParser(description='AI-Driven Smart Parcel Delivery Optimization')
    parser.add_argument('--city', type=str, default="Udupi, Karnataka, India", 
                        help='City name for optimization')
    parser.add_argument('--deliveries', type=int, default=10,
                        help='Number of deliveries to generate')
    parser.add_argument('--train', action='store_true',
                        help='Train the DQN agent')
    parser.add_argument('--evaluate', action='store_true',
                        help='Evaluate the trained agent')
    parser.add_argument('--timesteps', type=int, default=50000,
                        help='Number of timesteps for training')
    parser.add_argument('--episodes', type=int, default=5,
                        help='Number of episodes for evaluation')
    args = parser.parse_args()
    
    # Create necessary directories
    os.makedirs("data", exist_ok=True)
    os.makedirs("models", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    
    # File paths
    city_name = args.city.split(',')[0].lower().replace(' ', '_')
    graph_path = f"data/{city_name}.graphml"
    deliveries_path = f"data/deliveries.csv"
    model_path = f"models/{city_name}_dqn_model"
    
    # Step 1: Get road network if it doesn't exist
    if not os.path.exists(graph_path):
        G, _ = get_road_network(args.city, save_path='data')
    else:
        print(f"Loading existing road network from {graph_path}")
        G = ox.load_graphml(graph_path)
    
    # Step 2: Generate deliveries if they don't exist
    if not os.path.exists(deliveries_path):
        _, _ = generate_deliveries(G, num_deliveries=args.deliveries, save_path='data')
    else:
        print(f"Using existing deliveries from {deliveries_path}")
    
    # Step 3: Train the agent if requested
    if args.train:
        print(f"Training DQN agent for {args.timesteps} timesteps...")
        model, _ = train_dqn(
            env_path=graph_path,
            deliveries_path=deliveries_path,
            total_timesteps=args.timesteps,
            log_dir=f"logs/{city_name}"
        )
    
    # Step 4: Evaluate the agent if requested
    if args.evaluate:
        if not os.path.exists(f"{model_path}.zip"):
            print("No trained model found. Please train the model first or specify a different model path.")
        else:
            print(f"Evaluating agent for {args.episodes} episodes...")
            stats = evaluate_agent(
                model_path=model_path,
                graph_path=graph_path,
                deliveries_path=deliveries_path,
                num_episodes=args.episodes,
                visualize=True
            )
            
            print("\nEvaluation complete!")

if __name__ == "__main__":
    main()