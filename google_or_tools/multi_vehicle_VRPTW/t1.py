from typing import List, Dict, Any, Optional, Tuple
import osmnx as ox
import networkx as nx
import datetime
import pandas as pd
import numpy as np
import pickle
import json
import requests
import logging
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from shapely.geometry import Point
import folium
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler, LabelEncoder
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TravelTimePredictor:
    """
    Machine Learning model to predict travel times based on contextual features.
    """
    
    def __init__(self, google_api_key: Optional[str] = None, weather_api_key: Optional[str] = None):
        """
        Initialize the travel time predictor.
        
        Args:
            google_api_key: Google Maps API key for data collection
            weather_api_key: OpenWeatherMap API key for weather data
        """
        self.google_api_key = google_api_key
        self.weather_api_key = weather_api_key
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_columns = []
        self.is_trained = False
        
    def collect_training_data(self, 
                            origin_destinations: List[Tuple[float, float, float, float]], 
                            num_samples_per_route: int = 50) -> pd.DataFrame:
        """
        Collect training data from Google Maps API and weather data.
        
        Args:
            origin_destinations: List of (origin_lat, origin_lng, dest_lat, dest_lng) tuples
            num_samples_per_route: Number of samples to collect per route
            
        Returns:
            DataFrame with training data
        """
        training_data = []
        
        logger.info(f"Collecting training data for {len(origin_destinations)} routes...")
        
        for origin_lat, origin_lng, dest_lat, dest_lng in origin_destinations:
            logger.info(f"Collecting data for route: ({origin_lat}, {origin_lng}) -> ({dest_lat}, {dest_lng})")
            
            # Generate different time samples
            base_date = datetime.datetime.now() - datetime.timedelta(days=30)
            
            for i in range(num_samples_per_route):
                # Sample random time within last 30 days
                sample_time = base_date + datetime.timedelta(
                    days=np.random.randint(0, 30),
                    hours=np.random.randint(6, 22),  # Business hours
                    minutes=np.random.randint(0, 60)
                )
                
                # Get travel time from Google Maps
                travel_time = self._get_google_maps_travel_time(
                    origin_lat, origin_lng, dest_lat, dest_lng, sample_time
                )
                
                if travel_time is None:
                    continue
                
                # Get weather data
                weather_data = self._get_weather_data(origin_lat, origin_lng, sample_time)
                
                # Create feature vector
                features = self._create_features(
                    origin_lat, origin_lng, dest_lat, dest_lng, sample_time, weather_data
                )
                features['travel_time_minutes'] = travel_time
                
                training_data.append(features)
        
        df = pd.DataFrame(training_data)
        logger.info(f"Collected {len(df)} training samples")
        
        # Save training data
        df.to_csv('training_data.csv', index=False)
        logger.info("Training data saved to training_data.csv")
        
        return df
    
    def _get_google_maps_travel_time(self, 
                                   origin_lat: float, origin_lng: float,
                                   dest_lat: float, dest_lng: float,
                                   departure_time: datetime.datetime) -> Optional[float]:
        """
        Get travel time from Google Maps Distance Matrix API.
        
        Args:
            origin_lat, origin_lng: Origin coordinates
            dest_lat, dest_lng: Destination coordinates
            departure_time: Time of departure
            
        Returns:
            Travel time in minutes, or None if failed
        """
        if not self.google_api_key:
            # Return simulated data if no API key available
            distance = np.sqrt((origin_lat - dest_lat)**2 + (origin_lng - dest_lng)**2)
            base_time = distance * 1000  # Convert to rough minutes
            noise = np.random.normal(0, base_time * 0.2)  # Add 20% noise
            return max(1, base_time + noise)
        
        try:
            url = "https://maps.googleapis.com/maps/api/distancematrix/json"
            params = {
                'origins': f"{origin_lat},{origin_lng}",
                'destinations': f"{dest_lat},{dest_lng}",
                'departure_time': int(departure_time.timestamp()),
                'traffic_model': 'best_guess',
                'key': self.google_api_key
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if data['status'] == 'OK' and data['rows'][0]['elements'][0]['status'] == 'OK':
                duration_in_traffic = data['rows'][0]['elements'][0].get('duration_in_traffic', 
                                    data['rows'][0]['elements'][0]['duration'])
                return duration_in_traffic['value'] / 60  # Convert to minutes
            
        except Exception as e:
            logger.warning(f"Google Maps API error: {e}")
        
        return None
    
    def _get_weather_data(self, lat: float, lng: float, timestamp: datetime.datetime) -> Dict[str, Any]:
        """
        Get weather data for the given location and time.
        
        Args:
            lat, lng: Coordinates
            timestamp: Time for weather data
            
        Returns:
            Weather data dictionary
        """
        if not self.weather_api_key:
            # Return simulated weather data
            return {
                'temperature': np.random.normal(25, 5),  # Temperature in Celsius
                'humidity': np.random.randint(40, 90),
                'weather_condition': np.random.choice(['clear', 'clouds', 'rain', 'fog']),
                'wind_speed': np.random.exponential(5),
                'visibility': np.random.normal(10, 3)
            }
        
        try:
            # For historical data, use OpenWeatherMap's historical API
            url = f"http://api.openweathermap.org/data/2.5/weather"
            params = {
                'lat': lat,
                'lon': lng,
                'appid': self.weather_api_key,
                'units': 'metric'
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if response.status_code == 200:
                return {
                    'temperature': data['main']['temp'],
                    'humidity': data['main']['humidity'],
                    'weather_condition': data['weather'][0]['main'].lower(),
                    'wind_speed': data['wind']['speed'],
                    'visibility': data.get('visibility', 10000) / 1000  # Convert to km
                }
        
        except Exception as e:
            logger.warning(f"Weather API error: {e}")
        
        # Return default values if API fails
        return {
            'temperature': 25,
            'humidity': 60,
            'weather_condition': 'clear',
            'wind_speed': 3,
            'visibility': 10
        }
    
    def _create_features(self, 
                        origin_lat: float, origin_lng: float,
                        dest_lat: float, dest_lng: float,
                        timestamp: datetime.datetime,
                        weather_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create feature vector from raw data.
        
        Args:
            origin_lat, origin_lng: Origin coordinates
            dest_lat, dest_lng: Destination coordinates
            timestamp: Time of travel
            weather_data: Weather information
            
        Returns:
            Feature dictionary
        """
        # Calculate distance features
        distance_km = np.sqrt((origin_lat - dest_lat)**2 + (origin_lng - dest_lng)**2) * 111  # Rough km conversion
        
        # Time features
        hour = timestamp.hour
        day_of_week = timestamp.weekday()
        is_weekend = 1 if day_of_week >= 5 else 0
        is_rush_hour = 1 if (7 <= hour <= 9) or (17 <= hour <= 19) else 0
        
        # Location features
        center_lat, center_lng = (origin_lat + dest_lat) / 2, (origin_lng + dest_lng) / 2
        
        return {
            'origin_lat': origin_lat,
            'origin_lng': origin_lng,
            'dest_lat': dest_lat,
            'dest_lng': dest_lng,
            'distance_km': distance_km,
            'center_lat': center_lat,
            'center_lng': center_lng,
            'hour': hour,
            'day_of_week': day_of_week,
            'is_weekend': is_weekend,
            'is_rush_hour': is_rush_hour,
            'temperature': weather_data['temperature'],
            'humidity': weather_data['humidity'],
            'weather_condition': weather_data['weather_condition'],
            'wind_speed': weather_data['wind_speed'],
            'visibility': weather_data['visibility']
        }
    
    def train_model(self, training_data: pd.DataFrame) -> Dict[str, float]:
        """
        Train the XGBoost regression model.
        
        Args:
            training_data: DataFrame with training samples
            
        Returns:
            Training metrics
        """
        logger.info("Training travel time prediction model...")
        
        # Prepare features
        X = training_data.drop('travel_time_minutes', axis=1)
        y = training_data['travel_time_minutes']
        
        # Handle categorical variables
        categorical_columns = ['weather_condition']
        for col in categorical_columns:
            if col in X.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                X[col] = self.label_encoders[col].fit_transform(X[col].astype(str))
        
        # Store feature columns for later use
        self.feature_columns = X.columns.tolist()
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Train XGBoost model
        self.model = xgb.XGBRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        self.is_trained = True
        
        metrics = {
            'mae': mae,
            'rmse': rmse,
            'training_samples': len(training_data)
        }
        
        logger.info(f"Model trained successfully! MAE: {mae:.2f} min, RMSE: {rmse:.2f} min")
        
        return metrics
    
    def predict_travel_time(self, 
                          origin_lat: float, origin_lng: float,
                          dest_lat: float, dest_lng: float,
                          timestamp: datetime.datetime) -> float:
        """
        Predict travel time for a given route and time.
        
        Args:
            origin_lat, origin_lng: Origin coordinates
            dest_lat, dest_lng: Destination coordinates
            timestamp: Time of travel
            
        Returns:
            Predicted travel time in minutes
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Get current weather data
        weather_data = self._get_weather_data(origin_lat, origin_lng, timestamp)
        
        # Create features
        features = self._create_features(
            origin_lat, origin_lng, dest_lat, dest_lng, timestamp, weather_data
        )
        
        # Convert to DataFrame
        feature_df = pd.DataFrame([features])
        
        # Handle categorical variables
        for col in ['weather_condition']:
            if col in feature_df.columns and col in self.label_encoders:
                try:
                    feature_df[col] = self.label_encoders[col].transform(feature_df[col].astype(str))
                except ValueError:
                    # Handle unseen categories
                    feature_df[col] = 0
        
        # Ensure feature order matches training
        feature_df = feature_df.reindex(columns=self.feature_columns, fill_value=0)
        
        # Scale features
        X_scaled = self.scaler.transform(feature_df)
        
        # Predict
        prediction = self.model.predict(X_scaled)[0]
        
        # Ensure minimum travel time of 1 minute
        return max(1.0, prediction)
    
    def save_model(self, filepath: str):
        """Save the trained model and preprocessors."""
        if not self.is_trained:
            raise ValueError("No trained model to save")
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_columns': self.feature_columns
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str):
        """Load a trained model and preprocessors."""
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.label_encoders = model_data['label_encoders']
        self.feature_columns = model_data['feature_columns']
        self.is_trained = True
        
        logger.info(f"Model loaded from {filepath}")


class MLEnhancedDeliveryOptimizer:
    """
    Enhanced delivery optimizer with ML-based travel time prediction.
    """
    
    def __init__(self, 
                 graph_path: Optional[str] = None,
                 predictor: Optional[TravelTimePredictor] = None):
        """
        Initialize the ML-enhanced delivery optimizer.
        
        Args:
            graph_path: Path to OSMnx graph file
            predictor: Trained travel time predictor
        """
        # Load OSMnx graph
        if graph_path:
            self.G = ox.load_graphml(graph_path)
        else:
            place_name = "Udupi, Karnataka, India"
            self.G = ox.graph_from_place(place_name, network_type='drive')
            self.G = ox.add_edge_speeds(self.G)
            self.G = ox.add_edge_travel_times(self.G)
        
        # Initialize travel time predictor
        self.predictor = predictor
        self.use_ml_prediction = predictor is not None and predictor.is_trained
        
        # Cache for nearest nodes and predictions
        self.nearest_node_cache = {}
        self.prediction_cache = {}
        
        logger.info(f"Optimizer initialized with ML prediction: {self.use_ml_prediction}")
    
    def optimize_routes(self, 
                      delivery_persons: List[Dict[str, Any]],
                      current_time: datetime.datetime,
                      deliveries: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Find optimal delivery routes using ML-predicted travel times.
        """
        # Prepare data for OR-Tools
        data = self._create_data_model(delivery_persons, current_time, deliveries)
        
        # Create Routing Model
        manager = pywrapcp.RoutingIndexManager(
            len(data['time_matrix']),
            data['num_vehicles'],
            data['starts'],
            data['ends']
        )
        routing = pywrapcp.RoutingModel(manager)
        
        # Define transit callback with ML predictions
        def time_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return data['time_matrix'][from_node][to_node]
        
        transit_callback_index = routing.RegisterTransitCallback(time_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        
        # Add time window constraints
        self._add_time_dimension(routing, manager, transit_callback_index, data)
        
        # Set solution parameters
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_parameters.time_limit.seconds = 15  # Slightly longer for better solutions
        
        # Solve the problem
        solution = routing.SolveWithParameters(search_parameters)
        
        if solution:
            return self._process_solution(data, manager, routing, solution, 
                                        delivery_persons, deliveries, current_time)
        else:
            return {"status": "failed", "message": "No solution found"}
    
    def _create_data_model(self, 
                          delivery_persons: List[Dict[str, Any]], 
                          current_time: datetime.datetime,
                          deliveries: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Create data model with ML-predicted travel times.
        """
        data = {}
        
        # Collect all locations
        all_locations = [dp['location'] for dp in delivery_persons] + [d['location'] for d in deliveries]
        
        # Map locations to coordinates
        coordinates = [(loc['lat'], loc['lng']) for loc in all_locations]
        
        # Generate time matrix using ML predictions
        if self.use_ml_prediction:
            data['time_matrix'] = self._generate_ml_time_matrix(coordinates, current_time)
            logger.info("Using ML-predicted travel times")
        else:
            # Fallback to OSM-based times
            osm_nodes = [self._get_nearest_node(lat, lng) for lat, lng in coordinates]
            data['time_matrix'] = self._generate_time_matrix_osm(osm_nodes)
            logger.info("Using OSM-based travel times")
        
        # Set vehicles and depot configuration
        data['num_vehicles'] = len(delivery_persons)
        data['starts'] = list(range(len(delivery_persons)))
        data['ends'] = list(range(len(delivery_persons)))
        
        # Process time windows
        base_time = int(current_time.timestamp() // 60)
        data['time_windows'] = []
        
        # Depot time windows
        for _ in delivery_persons:
            data['time_windows'].append((0, 0))
        
        # Delivery time windows
        for delivery in deliveries:
            start_time = int(delivery['time_window']['start'].timestamp() // 60) - base_time
            end_time = int(delivery['time_window']['end'].timestamp() // 60) - base_time
            start_time = max(0, start_time)
            end_time = max(start_time, end_time)
            data['time_windows'].append((start_time, end_time))
        
        data['coordinates'] = coordinates
        data['delivery_person_indices'] = list(range(len(delivery_persons)))
        data['delivery_indices'] = list(range(len(delivery_persons), len(delivery_persons) + len(deliveries)))
        
        return data
    
    def _generate_ml_time_matrix(self, 
                               coordinates: List[Tuple[float, float]], 
                               current_time: datetime.datetime) -> List[List[int]]:
        """
        Generate time matrix using ML predictions.
        """
        n_locations = len(coordinates)
        time_matrix = [[0 for _ in range(n_locations)] for _ in range(n_locations)]
        
        for i in range(n_locations):
            for j in range(n_locations):
                if i == j:
                    time_matrix[i][j] = 0
                else:
                    # Create cache key
                    cache_key = f"{coordinates[i][0]:.6f},{coordinates[i][1]:.6f}->{coordinates[j][0]:.6f},{coordinates[j][1]:.6f}@{current_time.hour}"
                    
                    if cache_key in self.prediction_cache:
                        predicted_time = self.prediction_cache[cache_key]
                    else:
                        # Get ML prediction
                        predicted_time = self.predictor.predict_travel_time(
                            coordinates[i][0], coordinates[i][1],
                            coordinates[j][0], coordinates[j][1],
                            current_time
                        )
                        self.prediction_cache[cache_key] = predicted_time
                    
                    time_matrix[i][j] = max(1, round(predicted_time))
        
        return time_matrix
    
    def _get_nearest_node(self, lat: float, lng: float) -> int:
        """Get nearest OSM node (fallback method)."""
        cache_key = f"{lat:.6f},{lng:.6f}"
        if cache_key in self.nearest_node_cache:
            return self.nearest_node_cache[cache_key]
        
        nearest_node = ox.distance.nearest_nodes(self.G, lng, lat)
        self.nearest_node_cache[cache_key] = nearest_node
        return nearest_node
    
    def _generate_time_matrix_osm(self, nodes: List[int]) -> List[List[int]]:
        """Generate time matrix using OSM (fallback method)."""
        n_locations = len(nodes)
        time_matrix = [[0 for _ in range(n_locations)] for _ in range(n_locations)]
        
        for i in range(n_locations):
            for j in range(n_locations):
                if i == j:
                    time_matrix[i][j] = 0
                else:
                    travel_time = self._get_osm_travel_time(nodes[i], nodes[j])
                    time_matrix[i][j] = max(1, round(travel_time / 60))
        
        return time_matrix
    
    def _get_osm_travel_time(self, origin_node: int, dest_node: int) -> float:
        """Calculate OSM-based travel time (fallback method)."""
        try:
            route = nx.shortest_path(self.G, origin_node, dest_node, weight='travel_time')
            travel_time = 0
            for i in range(len(route) - 1):
                edge_data = self.G.get_edge_data(route[i], route[i + 1], 0)
                travel_time += edge_data.get('travel_time', 0)
            return travel_time
        except nx.NetworkXNoPath:
            origin_point = Point((self.G.nodes[origin_node]['x'], self.G.nodes[origin_node]['y']))
            dest_point = Point((self.G.nodes[dest_node]['x'], self.G.nodes[dest_node]['y']))
            distance = origin_point.distance(dest_point) * 111000
            return distance / (25 * 1000 / 3600)
    
    def _add_time_dimension(self, routing, manager, transit_callback_index, data):
        """Add time dimension to routing model."""
        max_wait_time = 60
        max_route_time = 480
        
        routing.AddDimension(
            transit_callback_index,
            max_wait_time,
            max_route_time,
            False,
            "Time"
        )
        
        time_dimension = routing.GetDimensionOrDie("Time")
        
        for location_idx, time_window in enumerate(data["time_windows"]):
            index = manager.NodeToIndex(location_idx)
            time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])

        for i in range(data["num_vehicles"]):
            routing.AddVariableMinimizedByFinalizer(
                time_dimension.CumulVar(routing.Start(i))
            )
            routing.AddVariableMinimizedByFinalizer(
                time_dimension.CumulVar(routing.End(i))
            )
    
    def _process_solution(self, data, manager, routing, solution, 
                         delivery_persons, deliveries, current_time):
        """Process the solution into route plans."""
        time_dimension = routing.GetDimensionOrDie("Time")
        routes = []
        
        for vehicle_id in range(data["num_vehicles"]):
            if routing.IsVehicleUsed(solution, vehicle_id):
                vehicle_route = {
                    'delivery_person': delivery_persons[vehicle_id],
                    'stops': [],
                    'total_time_minutes': 0,
                    'total_distance_meters': 0,
                    'prediction_method': 'ML' if self.use_ml_prediction else 'OSM'
                }
                
                index = routing.Start(vehicle_id)
                previous_node_index = manager.IndexToNode(index)
                
                while not routing.IsEnd(index):
                    time_var = time_dimension.CumulVar(index)
                    node_index = manager.IndexToNode(index)
                    
                    if node_index >= len(delivery_persons):
                        delivery_index = node_index - len(delivery_persons)
                        delivery = deliveries[delivery_index].copy()
                        
                        arrival_time = current_time + datetime.timedelta(minutes=solution.Min(time_var))
                        
                        # Calculate predicted travel time for this segment
                        if self.use_ml_prediction:
                            prev_coords = data['coordinates'][previous_node_index]
                            curr_coords = data['coordinates'][node_index]
                            segment_time = self.predictor.predict_travel_time(
                                prev_coords[0], prev_coords[1],
                                curr_coords[0], curr_coords[1],
                                current_time
                            )
                        else:
                            segment_time = data['time_matrix'][previous_node_index][node_index]
                        
                        vehicle_route['stops'].append({
                            'delivery': delivery,
                            'arrival_time': arrival_time.isoformat(),
                            'wait_time_minutes': solution.Max(time_var) - solution.Min(time_var),
                            'predicted_travel_time': segment_time
                        })
                    
                    previous_node_index = node_index
                    index = solution.Value(routing.NextVar(index))
                
                vehicle_route['total_time_minutes'] = solution.Min(time_dimension.CumulVar(routing.End(vehicle_id)))
                routes.append(vehicle_route)
        
        return {
            'status': 'success',
            'routes': routes,
            'total_vehicles_used': len(routes),
            'prediction_method': 'ML' if self.use_ml_prediction else 'OSM',
            'unassigned_deliveries': self._get_unassigned_deliveries(data, routing, solution, manager, deliveries)
        }
    
    def _get_unassigned_deliveries(self, data, routing, solution, manager, deliveries):
        """Get unassigned deliveries."""
        unassigned_indices = []
        for node_idx in range(routing.Size()):
            if routing.IsStart(node_idx) or routing.IsEnd(node_idx):
                continue
            if solution.Value(routing.NextVar(node_idx)) == node_idx:
                node = manager.IndexToNode(node_idx)
                if node >= len(data['delivery_person_indices']):
                    delivery_idx = node - len(data['delivery_person_indices'])
                    unassigned_indices.append(delivery_idx)
        
        return [deliveries[idx] for idx in unassigned_indices]


# Example usage and training pipeline
def train_travel_time_model(google_api_key: Optional[str] = None, 
                          weather_api_key: Optional[str] = None) -> TravelTimePredictor:
    """
    Train a travel time prediction model for Udupi delivery routes.
    
    Args:
        google_api_key: Google Maps API key
        weather_api_key: OpenWeatherMap API key
        
    Returns:
        Trained predictor
    """
    # Initialize predictor
    predictor = TravelTimePredictor(google_api_key, weather_api_key)
    
    # Define sample routes in Udupi (you should replace with actual delivery routes)
    udupi_routes = [
        (13.3409, 74.7421, 13.3500, 74.7500),  # Sample routes within Udupi
        (13.3409, 74.7421, 13.3300, 74.7400),
        (13.3500, 74.7500, 13.3600, 74.7550),
        (13.3300, 74.7400, 13.3450, 74.7480),
        (13.3600, 74.7550, 13.3350, 74.7430),
        # Add more actual delivery routes here
    ]
    
    # Collect training data
    logger.info("Starting training data collection...")
    training_data = predictor.collect_training_data(udupi_routes, num_samples_per_route=20)
    
    # Train model
    metrics = predictor.train_model(training_data)
    logger.info(f"Training completed: {metrics}")
    
    # Save model
    predictor.save_model('travel_time_model.pkl')
    
    return predictor


