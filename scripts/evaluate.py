# # DQN evaluation script

# import os
# import time
# import numpy as np
# import matplotlib.pyplot as plt
# import osmnx as ox
# from stable_baselines3 import DQN
# from env.udupi_delivery_env import UdupiDeliveryEnv

# def evaluate_agent(model_path="models/udupi_dqn_model", 
#                   graph_path="data/udupi.graphml", 
#                   deliveries_path="data/deliveries.csv",
#                   num_episodes=5,
#                   visualize=True):
#     """
#     Evaluate a trained DQN agent on the delivery environment
#     """
#     # Load the environment and model
#     env = UdupiDeliveryEnv(graph_path=graph_path, delivery_file=deliveries_path)
#     model = DQN.load(model_path)
    
#     # Statistics to track
#     all_rewards = []
#     all_on_time = []
#     all_off_time = []
#     all_distances = []
#     all_routes = []
    
#     for episode in range(num_episodes):
#         print(f"\nEvaluating episode {episode+1}/{num_episodes}")
#         obs,_= env.reset()
#         done = False
#         total_reward = 0
#         route = [env.current_node]  # Track the route
        
#         while not done:
#             # Use the model to predict the next action
#             action, _states = model.predict(obs, deterministic=True)
            
#             # Take the action
#             obs, reward, terminated, truncated, info = env.step(action)
#             done = terminated or truncated
#             total_reward += reward
            
#             # Record the new node
#             route.append(env.current_node)
            
#             # Display progress
#             env.render()
#             time.sleep(0.5)  # Slow down for readability
        
#         # Record statistics
#         all_rewards.append(total_reward)
#         all_on_time.append(env.delivered_on_time)
#         all_off_time.append(env.delivered_off_time)
#         all_distances.append(env.total_distance)
#         all_routes.append(route)
        
#         print(f"Episode {episode+1} completed")
#         print(f"Total reward: {total_reward:.2f}")
#         print(f"On-time deliveries: {env.delivered_on_time}/{env.delivered_on_time + env.delivered_off_time}")
#         print(f"Total distance: {env.total_distance:.2f} meters")
    
#     # Print summary statistics
#     print("\n" + "="*50)
#     print("EVALUATION SUMMARY")
#     print("="*50)
#     print(f"Average reward: {np.mean(all_rewards):.2f}")
#     print(f"Average on-time deliveries: {np.mean(all_on_time):.2f}/{env.num_deliveries}")
#     print(f"Average distance traveled: {np.mean(all_distances):.2f} meters")
    
#     # Visualize the routes on the map if requested
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
#     import pandas as pd
    
#     # Load deliveries
#     deliveries = pd.read_csv(deliveries_path)
#     delivery_nodes = deliveries['node'].values
    
#     # Create figure
#     fig, ax = plt.subplots(figsize=(12, 10))
    
#     # Plot the base map
#     ox.plot_graph(G, ax=ax, node_size=0, edge_linewidth=0.5, edge_color='#999999', show=False)
    
#     # Plot delivery points
#     delivery_points = []
#     for node_id in delivery_nodes:
#         if node_id in G.nodes:
#             delivery_points.append((G.nodes[node_id]['y'], G.nodes[node_id]['x']))
    
#     delivery_points = np.array(delivery_points)
#     ax.scatter(delivery_points[:, 1], delivery_points[:, 0], c='blue', s=50, label='Delivery Points')
    
#     # Plot the best route (last episode)
#     best_route = routes[-1]
#     route_points = []
#     for node_id in best_route:
#         if node_id in G.nodes:
#             route_points.append((G.nodes[node_id]['y'], G.nodes[node_id]['x']))
    
#     route_points = np.array(route_points)
#     ax.plot(route_points[:, 1], route_points[:, 0], 'r-', linewidth=2, label='Delivery Route')
    
#     # Mark depot (start point)
#     ax.scatter(route_points[0, 1], route_points[0, 0], c='green', s=100, label='Depot')
    
#     ax.legend()
#     ax.set_title('Optimized Delivery Route in Udupi')
    
#     # Save figure
#     os.makedirs("plots", exist_ok=True)
#     plt.savefig("plots/delivery_route.png", dpi=300, bbox_inches='tight')
#     plt.show()

# if __name__ == "__main__":
#     # Check if model exists
#     model_path = "models/udupi_dqn_model"
#     if not os.path.exists(f"{model_path}.zip"):
#         print("Trained model not found. Please train the model first.")
#     else:
#         evaluate_agent(model_path=model_path)

# # DQN evaluation script

# # import os
# # import time
# # import numpy as np
# # import matplotlib.pyplot as plt
# # import osmnx as ox
# # import pandas as pd
# # from stable_baselines3 import DQN
# # from env.udupi_delivery_env import UdupiDeliveryEnv

# # def evaluate_agent(model_path="models/udupi_dqn_model", 
# #                    graph_path="data/udupi.graphml", 
# #                    deliveries_path="data/deliveries.csv",
# #                    num_episodes=5,
# #                    visualize=True,
# #                    sleep_time=0.5):
# #     """
# #     Evaluate a trained DQN agent on the delivery environment
# #     """
# #     if not os.path.exists(f"{model_path}.zip"):
# #         print(f"Trained model not found at {model_path}.zip. Please train the model first.")
# #         return

# #     # Initialize environment and load model
# #     env = UdupiDeliveryEnv(graph_path=graph_path, delivery_file=deliveries_path)
# #     model = DQN.load(model_path)

# #     # Stats trackers
# #     all_rewards = []
# #     all_on_time = []
# #     all_off_time = []
# #     all_distances = []
# #     all_routes = []

# #     for episode in range(num_episodes):
# #         print(f"\n🚚 Evaluating episode {episode+1}/{num_episodes}")
# #         obs = env.reset()
# #         done = False
# #         total_reward = 0
# #         route = [env.current_node]

# #         while not done:
# #             action, _ = model.predict(obs, deterministic=True)
# #             obs, reward, done, info = env.step(action)
# #             total_reward += reward
# #             route.append(env.current_node)

# #             env.render()
# #             time.sleep(sleep_time)

# #         # Log episode stats
# #         all_rewards.append(total_reward)
# #         all_on_time.append(env.delivered_on_time)
# #         all_off_time.append(env.delivered_off_time)
# #         all_distances.append(env.total_distance)
# #         all_routes.append(route)

# #         print(f"Episode {episode+1} completed")
# #         print(f"  - Total reward: {total_reward:.2f}")
# #         print(f"  - On-time deliveries: {env.delivered_on_time}/{env.delivered_on_time + env.delivered_off_time}")
# #         print(f"  - Total distance: {env.total_distance:.2f} meters")

# #     # Evaluation summary
# #     print("\n" + "="*50)
# #     print(" EVALUATION SUMMARY")
# #     print("="*50)
# #     print(f" Average reward: {np.mean(all_rewards):.2f}")
# #     print(f" Average on-time deliveries: {np.mean(all_on_time):.2f}/{env.num_deliveries}")
# #     print(f" Average distance traveled: {np.mean(all_distances):.2f} meters")

# #     if visualize:
# #         _visualize_routes(env.G, all_routes, deliveries_path)

# #     return {
# #         "avg_reward": np.mean(all_rewards),
# #         "avg_on_time": np.mean(all_on_time),
# #         "avg_off_time": np.mean(all_off_time),
# #         "avg_distance": np.mean(all_distances),
# #         "routes": all_routes
# #     }

# # def _visualize_routes(G, routes, deliveries_path):
# #     """
# #     Visualize delivery routes on the map
# #     """
# #     deliveries = pd.read_csv(deliveries_path)
# #     delivery_nodes = deliveries['node'].values

# #     fig, ax = plt.subplots(figsize=(12, 10))

# #     # Plot base map
# #     ox.plot_graph(G, ax=ax, node_size=0, edge_linewidth=0.5, edge_color='#999999', show=False)

# #     # Plot delivery points
# #     delivery_points = [
# #         (G.nodes[n]['y'], G.nodes[n]['x']) for n in delivery_nodes if n in G.nodes
# #     ]
# #     delivery_points = np.array(delivery_points)
# #     ax.scatter(delivery_points[:, 1], delivery_points[:, 0], c='blue', s=50, label='Delivery Points')

# #     # Plot route from last episode
# #     best_route = routes[-1]
# #     route_points = [
# #         (G.nodes[n]['y'], G.nodes[n]['x']) for n in best_route if n in G.nodes
# #     ]
# #     route_points = np.array(route_points)
# #     ax.plot(route_points[:, 1], route_points[:, 0], 'r-', linewidth=2, label='Delivery Route')

# #     # Mark depot
# #     if len(route_points) > 0:
# #         ax.scatter(route_points[0, 1], route_points[0, 0], c='green', s=100, label='Depot')

# #     ax.legend()
# #     ax.set_title('Optimized Delivery Route in Udupi')

# #     os.makedirs("plots", exist_ok=True)
# #     plt.savefig("plots/delivery_route.png", dpi=300, bbox_inches='tight')
# #     plt.show()

# # if __name__ == "__main__":
# #     evaluate_agent()


# scripts/evaluate.py
import os
import time
import numpy as np
import matplotlib.pyplot as plt
import osmnx as ox
import pandas as pd
from stable_baselines3 import DQN
from env.udupi_delivery_env import UdupiDeliveryEnv

def evaluate_agent(model_path="models/udupi_dqn_model", 
                  graph_path="data/udupi.graphml", 
                  deliveries_path="data/deliveries.csv",
                  num_episodes=5,
                  visualize=True,
                  max_steps=100):  # Added max_steps parameter
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
        print(f"\n{'='*50}")
        print(f"EVALUATING EPISODE {episode+1}/{num_episodes}")
        print(f"{'='*50}")
        
        obs, _ = env.reset()
        done = False
        total_reward = 0
        route = [env.current_node]  # Track the route
        step_count = 0
        
        # Debug information before starting episode
        print(f"Starting at depot: {env.current_node}")
        print(f"Number of deliveries: {env.num_deliveries}")
        print(f"Current time: {env.current_time:.2f}h")
        print(f"Undelivered packages: {len(env.undelivered)}/{env.num_deliveries}")
        
        while not done:
            step_count += 1
            print(f"\nStep {step_count}:")
            
            # Get current state before action
            print(f"Current node: {env.current_node}")
            print(f"Current time: {env.current_time:.2f}h")
            print(f"Pending deliveries: {len(env.undelivered)}/{env.num_deliveries}")
            
            # Use the model to predict the next action
            action, _states = model.predict(obs, deterministic=True)
            print(f"Agent selected action (delivery): {action}")
            
            # Check if action is valid
            if action not in env.undelivered:
                print(f"WARNING: Agent selected invalid delivery {action}!")
                print(f"Available deliveries are: {env.undelivered}")
                
                # Choose a random valid action instead
                if env.undelivered:
                    action = np.random.choice(env.undelivered)
                    print(f"Selecting random valid delivery {action} instead")
                else:
                    print("No deliveries left. Episode should end.")
                    done = True
                    continue
            
            # Show the selected delivery details
            if action < len(env.deliveries):
                delivery = env.deliveries[action]
                print(f"Selected delivery: Node {delivery['node']}, Time window: {delivery['slot_start']}-{delivery['slot_end']}")
                
                # Calculate path before taking action
                try:
                    path = nx.shortest_path(env.G, env.current_node, delivery['node'])
                    print(f"Path to delivery: {path}")
                    path_length = sum(
                        env.G[path[i]][path[i + 1]][0]['length']
                        for i in range(len(path) - 1)
                    )
                    print(f"Path length: {path_length:.2f} meters")
                except Exception as e:
                    print(f"Error calculating path: {e}")
            
            # Take the action
            obs, reward, terminated, truncated, info = env.step(action)
            done = terminated or truncated
            total_reward += reward
            
            # Record the new node
            route.append(env.current_node)
            
            # Display results of action
            print(f"New node: {env.current_node}")
            print(f"Reward: {reward}")
            print(f"Step result - Terminated: {terminated}, Truncated: {truncated}")
            print(f"Current time: {env.current_time:.2f}h")
            print(f"On-time deliveries: {env.delivered_on_time}")
            print(f"Off-time deliveries: {env.delivered_off_time}")
            print(f"Total distance: {env.total_distance:.2f} meters")
            
            # Display progress
            env.render()
            
            # Safety check to prevent infinite loops
            if step_count >= max_steps:
                print(f"WARNING: Maximum steps ({max_steps}) reached. Terminating episode.")
                done = True
            
            time.sleep(0.2)  # Slow down for readability
        
        # Record statistics
        all_rewards.append(total_reward)
        all_on_time.append(env.delivered_on_time)
        all_off_time.append(env.delivered_off_time)
        all_distances.append(env.total_distance)
        all_routes.append(route)
        
        print(f"\nEpisode {episode+1} completed in {step_count} steps")
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
    if visualize and all_routes:
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
    # Import here to avoid unnecessary dependency if not visualizing
    import networkx as nx
    
    # Load deliveries
    deliveries = pd.read_csv(deliveries_path)
    deliveries['node'] = deliveries['node'].astype(str)
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
    
    if delivery_points:
        delivery_points = np.array(delivery_points)
        ax.scatter(delivery_points[:, 1], delivery_points[:, 0], c='blue', s=50, label='Delivery Points')
    
    # Plot routes with different colors
    colors = plt.cm.viridis(np.linspace(0, 1, len(routes)))
    for i, route in enumerate(routes):
        route_points = []
        for node_id in route:
            if node_id in G.nodes:
                route_points.append((G.nodes[node_id]['y'], G.nodes[node_id]['x']))
        
        if route_points:
            route_points = np.array(route_points)
            # Use lower alpha for earlier routes
            alpha = 0.3 if i < len(routes) - 1 else 1.0
            linewidth = 1 if i < len(routes) - 1 else 2
            label = None if i < len(routes) - 1 else 'Final Route'
            ax.plot(route_points[:, 1], route_points[:, 0], '-', 
                   color=colors[i], linewidth=linewidth, alpha=alpha, label=label)
    
    # Mark depot (start point)
    start_route = routes[0]
    if start_route and start_route[0] in G.nodes:
        start_point = (G.nodes[start_route[0]]['y'], G.nodes[start_route[0]]['x'])
        ax.scatter(start_point[1], start_point[0], c='green', s=100, label='Depot')
    
    # Create detailed visualization of the best route
    fig2, ax2 = plt.subplots(figsize=(12, 10))
    ox.plot_graph(G, ax=ax2, node_size=0, edge_linewidth=0.5, edge_color='#999999', show=False)
    
    # Plot the best route (last episode)
    best_route = routes[-1]
    best_route_points = []
    for node_id in best_route:
        if node_id in G.nodes:
            best_route_points.append((G.nodes[node_id]['y'], G.nodes[node_id]['x']))
    
    if best_route_points:
        best_route_points = np.array(best_route_points)
        ax2.plot(best_route_points[:, 1], best_route_points[:, 0], 'r-', linewidth=2, label='Best Route')
        
        # Add arrows to show direction
        for i in range(len(best_route_points) - 1):
            midpoint = (
                (best_route_points[i+1][1] + best_route_points[i][1]) / 2,
                (best_route_points[i+1][0] + best_route_points[i][0]) / 2
            )
            dx = best_route_points[i+1][1] - best_route_points[i][1]
            dy = best_route_points[i+1][0] - best_route_points[i][0]
            dist = np.sqrt(dx*dx + dy*dy)
            if dist > 0:
                ax2.arrow(midpoint[0]-dx/10, midpoint[1]-dy/10, dx/20, dy/20, 
                        head_width=dist/50, head_length=dist/30, fc='r', ec='r')
        
        # Number the nodes in sequence
        for i, point in enumerate(best_route_points):
            ax2.annotate(f"{i}", (point[1], point[0]), 
                       xytext=(5, 5), textcoords='offset points',
                       fontsize=8, color='red')
    
    # Plot delivery points on detailed map
    if delivery_points:
        ax2.scatter(delivery_points[:, 1], delivery_points[:, 0], c='blue', s=50, label='Delivery Points')
        
        # Label delivery points
        for i, node_id in enumerate(delivery_nodes):
            if node_id in G.nodes:
                point = (G.nodes[node_id]['y'], G.nodes[node_id]['x'])
                ax2.annotate(f"D{i+1}", (point[1], point[0]), 
                           xytext=(-5, -10), textcoords='offset points',
                           fontsize=8, color='blue')
    
    # Mark depot on detailed map
    if best_route and best_route[0] in G.nodes:
        start_point = (G.nodes[best_route[0]]['y'], G.nodes[best_route[0]]['x'])
        ax2.scatter(start_point[1], start_point[0], c='green', s=100, label='Depot')
    
    ax.legend()
    ax.set_title('All Delivery Routes')
    
    ax2.legend()
    ax2.set_title('Best Delivery Route')
    
    # Save figures
    os.makedirs("plots", exist_ok=True)
    plt.figure(fig.number)
    plt.savefig("plots/all_delivery_routes.png", dpi=300, bbox_inches='tight')
    
    plt.figure(fig2.number)
    plt.savefig("plots/best_delivery_route.png", dpi=300, bbox_inches='tight')
    
    plt.show()

def debug_environment(graph_path="data/udupi.graphml", deliveries_path="data/deliveries.csv"):
    """
    Debug the environment to identify potential issues
    """
    # Import here to avoid unnecessary dependency in main function
    import networkx as nx
    
    print("\n" + "="*50)
    print("ENVIRONMENT DIAGNOSTICS")
    print("="*50)
    
    # Load environment
    env = UdupiDeliveryEnv(graph_path=graph_path, delivery_file=deliveries_path)
    obs, _ = env.reset()
    
    print(f"Observation shape: {obs.shape}")
    print(f"Initial node (depot): {env.current_node}")
    print(f"Number of deliveries: {env.num_deliveries}")
    print(f"Graph nodes: {len(env.G.nodes())}")
    print(f"Graph edges: {len(env.G.edges())}")
    
    # Check if each delivery node exists in the graph
    print("\nValidating delivery nodes:")
    for i, delivery in enumerate(env.deliveries):
        node_id = delivery['node']
        exists = node_id in env.G.nodes()
        print(f"Delivery {i}: Node {node_id} {'exists' if exists else 'MISSING'}")
        
        if exists:
            # Check connectivity to this node from depot
            try:
                path = nx.shortest_path(env.G, env.depot, node_id)
                print(f"  - Path exists from depot: {len(path)} nodes")
            except nx.NetworkXNoPath:
                print(f"  - WARNING: No path from depot to this node!")
    
    # Test random actions
    print("\nTesting random actions:")
    for i in range(3):
        # Choose a valid action
        if env.undelivered:
            action = np.random.choice(env.undelivered)
            print(f"\nRandom action {i+1}: Delivery {action}")
            
            # Get details of the selected delivery
            delivery = env.deliveries[action]
            print(f"Selected delivery node: {delivery['node']}")
            print(f"Time window: {delivery['slot_start']} - {delivery['slot_end']}")
            
            # Take action
            prev_node = env.current_node
            obs, reward, terminated, truncated, info = env.step(action)
            print(f"Result: Node {prev_node} -> {env.current_node}")
            print(f"Reward: {reward}")
            print(f"Current time: {env.current_time:.2f}h")
            print(f"Remaining deliveries: {len(env.undelivered)}")
        else:
            print("No undelivered packages left")
            break
    
    print("\nDiagnostics complete.")

if __name__ == "__main__":
    # Add networkx import for debug functions
    import networkx as nx
    
    # Run diagnostics first to identify issues
    debug_environment()
    
    # Check if model exists
    model_path = "models/udupi_dqn_model"
    if not os.path.exists(f"{model_path}.zip"):
        print("Trained model not found. Please train the model first.")
    else:
        evaluate_agent(model_path=model_path)