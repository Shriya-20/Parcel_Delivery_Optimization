# env/udupi_delivery_env.py
import gymnasium as gym
import numpy as np
import networkx as nx
import pandas as pd
import random
import osmnx as ox
from gymnasium import spaces

class UdupiDeliveryEnv(gym.Env):
    """
    Custom environment for delivery optimization in Udupi using reinforcement learning.
    """

    def __init__(self, graph_path="data/udupi.graphml", delivery_file="data/deliveries.csv"):
        super().__init__()
        self.metadata = {'render_modes': ['human']}

        # Load data
        self.G = ox.load_graphml(graph_path)
        
        # Ensure all nodes are strings
        if not all(isinstance(n, str) for n in self.G.nodes()):
            self.G = nx.relabel_nodes(self.G, {n: str(n) for n in self.G.nodes()})
        
        self.deliveries_df = pd.read_csv(delivery_file)
        
        # Ensure node column in deliveries is string type
        self.deliveries_df['node'] = self.deliveries_df['node'].astype(str)
        self.deliveries = self.deliveries_df.to_dict('records')
        self.num_deliveries = len(self.deliveries)

        # Set depot (starting point)
        self.depot = random.choice(list(self.G.nodes))
        self.current_node = self.depot
        self.current_time = 8.0  # Start day at 8:00 AM

        # Undelivered packages tracking
        self.undelivered = list(range(self.num_deliveries))
        self.max_time = 20.0  # End day at 8:00 PM

        # Observation space: [current_node_embedding, current_time, delivery1_node_embedding, delivery1_start, delivery1_end, ...]
        # For node embedding, we'll use a simple numerical representation
        self.observation_space = spaces.Box(
            low=-np.inf,  # Allow any values for node embeddings
            high=np.inf,  # Allow any values for node embeddings
            shape=(2 + self.num_deliveries * 3,),
            dtype=np.float32
        )

        # Action space: choose which delivery to do next
        self.action_space = spaces.Discrete(self.num_deliveries)

        # Metrics
        self.delivered_on_time = 0
        self.delivered_off_time = 0
        self.total_distance = 0.0
        
        # Node to index mapping for embedding
        self.node_to_idx = {node: idx for idx, node in enumerate(self.G.nodes())}

    def reset(self, seed=None, options=None):
        """Reset environment to initial state."""
        super().reset(seed=seed)
        self.current_node = self.depot
        self.current_time = 8.0
        self.undelivered = list(range(self.num_deliveries))
        self.delivered_on_time = 0
        self.delivered_off_time = 0
        self.total_distance = 0.0
        return self._get_obs(), {}  # Gymnasium requires returning (obs, info)

    def _node_to_embedding(self, node):
        """Convert node string to a numerical embedding"""
        return self.node_to_idx.get(node, 0) / len(self.node_to_idx)  # Normalize to [0,1]

    def _get_obs(self):
        """Return the current observation."""
        # Use node embedding instead of raw node id
        obs = [
            self._node_to_embedding(self.current_node),  # Node embedding
            self.current_time / 24.0  # Normalize time to [0,1]
        ]
        
        for i in range(self.num_deliveries):
            if i in self.undelivered:
                delivery = self.deliveries[i]
                obs.extend([
                    self._node_to_embedding(delivery['node']),  # Node embedding
                    self._parse_hour(delivery['slot_start']),
                    self._parse_hour(delivery['slot_end'])
                ])
            else:
                obs.extend([-1.0, -1.0, -1.0])  # Mark as delivered
                
        return np.array(obs, dtype=np.float32)

    def _parse_hour(self, time_str):
        """Convert time string (HH:MM) to hour float."""
        hour, minute = time_str.split(":")
        return float(hour) + float(minute) / 60.0

    def _get_travel_time(self, source, target):
        """Calculate travel time between two nodes."""
        try:
            # Both source and target are now strings
            path = nx.shortest_path(self.G, source, target, weight='travel_time')
            travel_time = sum(
                self.G[path[i]][path[i + 1]][0]['travel_time']
                for i in range(len(path) - 1)
            )
            return travel_time / 3600.0, path  # seconds to hours
        except nx.NetworkXNoPath:
            return 10.0, []  # Penalty if no path
        except Exception as e:
            print(f"Error finding path: {e}")
            return 10.0, []

    def step(self, action):
        """
        Take an action (deliver to a specific location).
        Returns: obs, reward, terminated, truncated, info
        """
        if action not in self.undelivered:
            return self._get_obs(), -20.0, False, False, {"message": "Invalid action"}

        delivery = self.deliveries[action]
        target_node = delivery['node']

        travel_time, path = self._get_travel_time(self.current_node, target_node)
        self.current_time += travel_time

        if path:
            distance = sum(
                self.G[path[i]][path[i + 1]][0]['length']
                for i in range(len(path) - 1)
            )
            self.total_distance += distance

        slot_start = self._parse_hour(delivery['slot_start'])
        slot_end = self._parse_hour(delivery['slot_end'])

        reward = -travel_time * 10
        if slot_start <= self.current_time <= slot_end:
            reward += 50
            self.delivered_on_time += 1
        else:
            reward -= 30
            self.delivered_off_time += 1

        self.current_node = target_node
        self.undelivered.remove(action)

        terminated = len(self.undelivered) == 0
        truncated = self.current_time >= self.max_time

        info = {
            "travel_time": travel_time,
            "current_time": self.current_time,
            "on_time": slot_start <= self.current_time <= slot_end,
            "remaining": len(self.undelivered),
            "on_time_count": self.delivered_on_time,
            "off_time_count": self.delivered_off_time,
            "total_distance": self.total_distance
        }

        return self._get_obs(), reward, terminated, truncated, info

    def render(self, mode="human"):
        """Render current state."""
        print(f"Current Node: {self.current_node}")
        print(f"Current Time: {self.current_time:.2f}h")
        print(f"Undelivered: {len(self.undelivered)}/{self.num_deliveries}")
        print(f"On-time deliveries: {self.delivered_on_time}")
        print(f"Off-time deliveries: {self.delivered_off_time}")
        print(f"Total distance: {self.total_distance:.2f} meters")
        print("-" * 40)