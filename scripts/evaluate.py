# DQN evaluation script

import os
import time
import numpy as np
import matplotlib.pyplot as plt
import osmnx as ox
from stable_baselines3 import DQN
from env.udupi_delivery_env import UdupiDeliveryEnv

def evaluate_agent(model_path="models/udupi_dqn_model", 
                  graph_path="data/udupi.graphml", 
                  deliveries_path="data/deliveries.csv",
                  num_episodes=5,
                  visualize=True):
    """
    Evaluate a trained DQN agent on the delivery environment
    """
    # Load the environment and model
    env = UdupiDeliveryEnv(graph_path=graph_path, delivery_file=deliveries_path)
    model = DQN.load(model_path)
    
    # Statistics to track
    all_rewards = []
    all_on_time = []
    all_off_time = []
    all_distances = []
    all_routes = []
    
    for episode in range(num_episodes):
        print(f"\nEvaluating episode {episode+1}/{num_episodes}")
        obs,_= env.reset()
        done = False
        total_reward = 0
        route = [env.current_node]  # Track the route
        
        while not done:
            # Use the model to predict the next action
            action, _states = model.predict(obs, deterministic=True)
            
            # Take the action
            obs, reward, terminated, truncated, info = env.step(action)
            done = terminated or truncated
            total_reward += reward
            
            # Record the new node
            route.append(env.current_node)
            
            # Display progress
            env.render()
            time.sleep(0.5)  # Slow down for readability
        
        # Record statistics
        all_rewards.append(total_reward)
        all_on_time.append(env.delivered_on_time)
        all_off_time.append(env.delivered_off_time)
        all_distances.append(env.total_distance)
        all_routes.append(route)
        
        print(f"Episode {episode+1} completed")
        print(f"Total reward: {total_reward:.2f}")
        print(f"On-time deliveries: {env.delivered_on_time}/{env.delivered_on_time + env.delivered_off_time}")
        print(f"Total distance: {env.total_distance:.2f} meters")
    
    # Print summary statistics
    print("\n" + "="*50)
    print("EVALUATION SUMMARY")
    print("="*50)
    print(f"Average reward: {np.mean(all_rewards):.2f}")
    print(f"Average on-time deliveries: {np.mean(all_on_time):.2f}/{env.num_deliveries}")
    print(f"Average distance traveled: {np.mean(all_distances):.2f} meters")
    
    # Visualize the routes on the map if requested
    if visualize:
        _visualize_routes(env.G, all_routes, deliveries_path)
    
    return {
        "avg_reward": np.mean(all_rewards),
        "avg_on_time": np.mean(all_on_time),
        "avg_off_time": np.mean(all_off_time),
        "avg_distance": np.mean(all_distances),
        "routes": all_routes
    }

def _visualize_routes(G, routes, deliveries_path):
    """
    Visualize delivery routes on the map
    """
    import pandas as pd
    
    # Load deliveries
    deliveries = pd.read_csv(deliveries_path)
    delivery_nodes = deliveries['node'].values
    
    # Create figure
    fig, ax = plt.subplots(figsize=(12, 10))
    
    # Plot the base map
    ox.plot_graph(G, ax=ax, node_size=0, edge_linewidth=0.5, edge_color='#999999', show=False)
    
    # Plot delivery points
    delivery_points = []
    for node_id in delivery_nodes:
        if node_id in G.nodes:
            delivery_points.append((G.nodes[node_id]['y'], G.nodes[node_id]['x']))
    
    delivery_points = np.array(delivery_points)
    ax.scatter(delivery_points[:, 1], delivery_points[:, 0], c='blue', s=50, label='Delivery Points')
    
    # Plot the best route (last episode)
    best_route = routes[-1]
    route_points = []
    for node_id in best_route:
        if node_id in G.nodes:
            route_points.append((G.nodes[node_id]['y'], G.nodes[node_id]['x']))
    
    route_points = np.array(route_points)
    ax.plot(route_points[:, 1], route_points[:, 0], 'r-', linewidth=2, label='Delivery Route')
    
    # Mark depot (start point)
    ax.scatter(route_points[0, 1], route_points[0, 0], c='green', s=100, label='Depot')
    
    ax.legend()
    ax.set_title('Optimized Delivery Route in Udupi')
    
    # Save figure
    os.makedirs("plots", exist_ok=True)
    plt.savefig("plots/delivery_route.png", dpi=300, bbox_inches='tight')
    plt.show()

if __name__ == "__main__":
    # Check if model exists
    model_path = "models/udupi_dqn_model"
    if not os.path.exists(f"{model_path}.zip"):
        print("Trained model not found. Please train the model first.")
    else:
        evaluate_agent(model_path=model_path)

# DQN evaluation script

# import os
# import time
# import numpy as np
# import matplotlib.pyplot as plt
# import osmnx as ox
# import pandas as pd
# from stable_baselines3 import DQN
# from env.udupi_delivery_env import UdupiDeliveryEnv

# def evaluate_agent(model_path="models/udupi_dqn_model", 
#                    graph_path="data/udupi.graphml", 
#                    deliveries_path="data/deliveries.csv",
#                    num_episodes=5,
#                    visualize=True,
#                    sleep_time=0.5):
#     """
#     Evaluate a trained DQN agent on the delivery environment
#     """
#     if not os.path.exists(f"{model_path}.zip"):
#         print(f"Trained model not found at {model_path}.zip. Please train the model first.")
#         return

#     # Initialize environment and load model
#     env = UdupiDeliveryEnv(graph_path=graph_path, delivery_file=deliveries_path)
#     model = DQN.load(model_path)

#     # Stats trackers
#     all_rewards = []
#     all_on_time = []
#     all_off_time = []
#     all_distances = []
#     all_routes = []

#     for episode in range(num_episodes):
#         print(f"\n🚚 Evaluating episode {episode+1}/{num_episodes}")
#         obs = env.reset()
#         done = False
#         total_reward = 0
#         route = [env.current_node]

#         while not done:
#             action, _ = model.predict(obs, deterministic=True)
#             obs, reward, done, info = env.step(action)
#             total_reward += reward
#             route.append(env.current_node)

#             env.render()
#             time.sleep(sleep_time)

#         # Log episode stats
#         all_rewards.append(total_reward)
#         all_on_time.append(env.delivered_on_time)
#         all_off_time.append(env.delivered_off_time)
#         all_distances.append(env.total_distance)
#         all_routes.append(route)

#         print(f"Episode {episode+1} completed")
#         print(f"  - Total reward: {total_reward:.2f}")
#         print(f"  - On-time deliveries: {env.delivered_on_time}/{env.delivered_on_time + env.delivered_off_time}")
#         print(f"  - Total distance: {env.total_distance:.2f} meters")

#     # Evaluation summary
#     print("\n" + "="*50)
#     print(" EVALUATION SUMMARY")
#     print("="*50)
#     print(f" Average reward: {np.mean(all_rewards):.2f}")
#     print(f" Average on-time deliveries: {np.mean(all_on_time):.2f}/{env.num_deliveries}")
#     print(f" Average distance traveled: {np.mean(all_distances):.2f} meters")

#     if visualize:
#         _visualize_routes(env.G, all_routes, deliveries_path)

#     return {
#         "avg_reward": np.mean(all_rewards),
#         "avg_on_time": np.mean(all_on_time),
#         "avg_off_time": np.mean(all_off_time),
#         "avg_distance": np.mean(all_distances),
#         "routes": all_routes
#     }

# def _visualize_routes(G, routes, deliveries_path):
#     """
#     Visualize delivery routes on the map
#     """
#     deliveries = pd.read_csv(deliveries_path)
#     delivery_nodes = deliveries['node'].values

#     fig, ax = plt.subplots(figsize=(12, 10))

#     # Plot base map
#     ox.plot_graph(G, ax=ax, node_size=0, edge_linewidth=0.5, edge_color='#999999', show=False)

#     # Plot delivery points
#     delivery_points = [
#         (G.nodes[n]['y'], G.nodes[n]['x']) for n in delivery_nodes if n in G.nodes
#     ]
#     delivery_points = np.array(delivery_points)
#     ax.scatter(delivery_points[:, 1], delivery_points[:, 0], c='blue', s=50, label='Delivery Points')

#     # Plot route from last episode
#     best_route = routes[-1]
#     route_points = [
#         (G.nodes[n]['y'], G.nodes[n]['x']) for n in best_route if n in G.nodes
#     ]
#     route_points = np.array(route_points)
#     ax.plot(route_points[:, 1], route_points[:, 0], 'r-', linewidth=2, label='Delivery Route')

#     # Mark depot
#     if len(route_points) > 0:
#         ax.scatter(route_points[0, 1], route_points[0, 0], c='green', s=100, label='Depot')

#     ax.legend()
#     ax.set_title('Optimized Delivery Route in Udupi')

#     os.makedirs("plots", exist_ok=True)
#     plt.savefig("plots/delivery_route.png", dpi=300, bbox_inches='tight')
#     plt.show()

# if __name__ == "__main__":
#     evaluate_agent()
