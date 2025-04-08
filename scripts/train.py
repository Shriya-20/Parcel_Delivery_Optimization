# DQN training sciptt

import os
import numpy as np
import matplotlib.pyplot as plt
from stable_baselines3 import DQN
from stable_baselines3.common.monitor import Monitor
from env.udupi_delivery_env import UdupiDeliveryEnv

from stable_baselines3.common.env_checker import check_env
from stable_baselines3.common.callbacks import BaseCallback
from stable_baselines3.common.monitor import Monitor

class RewardCallback(BaseCallback):
    """
    Custom callback for plotting rewards during training
    """
    def __init__(self, log_dir="./logs/", verbose=0):
        super(RewardCallback, self).__init__(verbose)
        self.log_dir = log_dir
        os.makedirs(log_dir, exist_ok=True)
        self.rewards = []
        self.episode_lengths = []
        self.on_time_deliveries = []
        self.off_time_deliveries = []
        
    def _on_step(self):
        if self.locals.get("dones"):
            if self.locals["dones"]:
                info = self.locals["infos"][0]
                self.rewards.append(np.sum(self.locals["rewards"]))
                self.episode_lengths.append(self.num_timesteps - sum(self.episode_lengths))
                self.on_time_deliveries.append(info.get("on_time_count", 0))
                self.off_time_deliveries.append(info.get("off_time_count", 0))
                
                # Save metrics every 10 episodes
                if len(self.rewards) % 10 == 0:
                    self._save_metrics()
        return True
    
    def _save_metrics(self):
        """Save metrics to file and plot"""
        # Save to file
        metrics = np.column_stack((
            self.rewards, 
            self.episode_lengths,
            self.on_time_deliveries,
            self.off_time_deliveries
        ))
        np.savetxt(
            os.path.join(self.log_dir, "metrics.csv"),
            metrics,
            delimiter=",",
            header="reward,episode_length,on_time,off_time"
        )
        
        # Plot rewards
        plt.figure(figsize=(12, 8))
        
        plt.subplot(2, 2, 1)
        plt.plot(self.rewards)
        plt.title("Episode Rewards")
        plt.grid(True)
        
        plt.subplot(2, 2, 2)
        plt.plot(self.episode_lengths)
        plt.title("Episode Lengths")
        plt.grid(True)
        
        plt.subplot(2, 2, 3)
        plt.plot(self.on_time_deliveries, label='On-time')
        plt.plot(self.off_time_deliveries, label='Off-time')
        plt.title("Delivery Performance")
        plt.legend()
        plt.grid(True)
        
        plt.subplot(2, 2, 4)
        if len(self.rewards) >= 10:
            # Smoothed rewards for better visualization
            smoothed = np.convolve(self.rewards, np.ones(10)/10, mode='valid')
            plt.plot(smoothed)
            plt.title("Smoothed Rewards (10-ep avg)")
            plt.grid(True)
        
        plt.tight_layout()
        plt.savefig(os.path.join(self.log_dir, "training_metrics.png"))
        plt.close()

def train_dqn(env_path="data/udupi.graphml", deliveries_path="data/deliveries.csv", 
              total_timesteps=100_000, log_dir="./logs"):
    """
    Train a DQN agent for delivery optimization
    """
    # Create and validate environment
    env = UdupiDeliveryEnv(graph_path=env_path, delivery_file=deliveries_path)
    env = Monitor(env,log_dir)
    check_env(env, warn=True)
    # Add normalization layers to policy
    policy_kwargs = dict(
        net_arch=[128, 128],
        normalize_images=False
    )
    # Create callback for logging
    callback = RewardCallback(log_dir=log_dir)
    
    # Create DQN agent
    # model = DQN(
    #     policy="MlpPolicy",
    #     env=env,
    #     learning_rate=0.0005,
    #     buffer_size=50000,
    #     learning_starts=1000,
    #     batch_size=64,
    #     gamma=0.99,
    #     train_freq=4,
    #     target_update_interval=1000,
    #     exploration_fraction=0.2,
    #     exploration_final_eps=0.05,
    #     policy_kwargs=dict(net_arch=[128, 128]),
    #     verbose=1,
    #     tensorboard_log=log_dir
    # )
    model = DQN(
        "MlpPolicy",
        env,
        policy_kwargs=policy_kwargs,
        verbose=1,
        tensorboard_log=log_dir
    )
    
    # Train the agent
    print(f"Starting training for {total_timesteps} timesteps...")
    model.learn(total_timesteps=total_timesteps, callback=callback)
    
    # Save the trained model
    model_dir = "./models"
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "udupi_dqn_model")
    model.save(model_path)
    print(f"Model saved to {model_path}")
    
    return model, env

if __name__ == "__main__":
    # Make sure data exists before training
    from utils.map_utils import get_road_network
    from utils.delivery_utils import generate_deliveries
    import os
    
    # Create data directory
    os.makedirs("data", exist_ok=True)
    
    # Get Udupi map if it doesn't exist
    graph_path = "data/udupi.graphml"
    if not os.path.exists(graph_path):
        place_name = "Udupi, Karnataka, India"
        G, graph_path = get_road_network(place_name)
    else:
        G = ox.load_graphml(graph_path)
    
    # Generate deliveries if they don't exist
    deliveries_path = "data/deliveries.csv"
    if not os.path.exists(deliveries_path):
        df_deliveries, deliveries_path = generate_deliveries(G, num_deliveries=10)
    
    # Train the agent
    model, _ = train_dqn(graph_path, deliveries_path, total_timesteps=50000)