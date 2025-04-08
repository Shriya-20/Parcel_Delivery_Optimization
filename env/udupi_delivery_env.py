
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
        self.deliveries_df = pd.read_csv(delivery_file)
        self.deliveries = self.deliveries_df.to_dict('records')
        self.num_deliveries = len(self.deliveries)

        # Set depot (starting point)
        self.depot = random.choice(list(self.G.nodes))
        self.current_node = self.depot
        self.current_time = 8.0  # Start day at 8:00 AM

        # Undelivered packages tracking
        self.undelivered = list(range(self.num_deliveries))
        self.max_time = 20.0  # End day at 8:00 PM

        # Observation space: [current_node, current_time, delivery1_node, delivery1_start, delivery1_end, ...]
        self.observation_space = spaces.Box(
            # low=0,
            # high=999999,
            low=-np.inf,  # Allow negative values for invalid deliveries
            high=np.inf,  # Allow large node IDs
            shape=(2 + self.num_deliveries * 3,),
            dtype=np.float32
        )

        # Action space: choose which delivery to do next
        self.action_space = spaces.Discrete(self.num_deliveries)

        # Metrics
        self.delivered_on_time = 0
        self.delivered_off_time = 0
        self.total_distance = 0.0

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

    def _get_obs(self):
        """Return the current observation."""
        # obs = [float(self.current_node), self.current_time]
        obs = [
        float(self.current_node) / 1e6,  # Normalize node ID
        self.current_time / 24.0  # Normalize time to [0,1]
        ]
        for i in range(self.num_deliveries):
            if i in self.undelivered:
                delivery = self.deliveries[i]
                obs.extend([
                    float(delivery['node']) / 1e6, #normalized nodee
                    self._parse_hour(delivery['slot_start']),
                    self._parse_hour(delivery['slot_end'])
                ])
            else:
                obs.extend([-1.0, -1.0, -1.0]) #mark as delivered
        return np.array(obs, dtype=np.float32)

    def _parse_hour(self, time_str):
        """Convert time string (HH:MM) to hour float."""
        hour, minute = time_str.split(":")
        return float(hour) + float(minute) / 60.0

    def _get_travel_time(self, source, target):
        """Calculate travel time between two nodes."""

        """Handle normalized node IDs"""
        source = int(source * 1e6)  # Convert back to original ID
        target = int(target * 1e6)
        try:
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
