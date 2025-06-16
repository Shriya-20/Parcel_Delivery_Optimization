# Parcel Delivery Optimization using Reinforcement Learning Algorithms

## Project Overview

This project optimizes parcel delivery routes using Reinforcement Learning (RL) Algorithms. The goal is to provide an efficient and realistic solution for managing parcel deliveries, incorporating real-world factors like road networks, traffic conditions, and package characteristics. The system includes an admin dashboard for route optimization and assignment, and a driver interface for managing deliveries.

## Features

-   **Realistic Delivery Environment:** Utilizes OpenStreetMap (OSM) road network and delivery data to simulate real-world conditions.
-   **Optimized Route Planning:** Employs advanced algorithms to determine the most efficient delivery routes and timings.
-   **Admin Dashboard:** Allows administrators to:
    -   Optimize daily delivery routes.
    -   Assign routes to available drivers.
    -   Track deliveries in real-time.
    -   View order history.
    -   Manage customer and carrier information.
-   **Driver Mobile App:** Enables delivery personnel to:
    -   View assigned delivery details.
    -   Mark tasks as complete or incomplete.
    -   Navigate routes.
    -   Contact customers.
-   **Multiple Optimization Models:** Offers different models for route optimization to cater to various needs and complexities.

## Technologies Used

-   **Backend:** [Specify backend technologies from backend/Readme.md if available, otherwise generalize]
-   **Frontend (Admin):** [Specify frontend technologies if available, otherwise generalize e.g., React, Next.js]
-   **Frontend (Driver):** Expo
-   **Machine Learning:** Python, Reinforcement Learning Libraries (e.g., TensorFlow, PyTorch), Google OR-Tools
-   **Database:** [Specify database if information is available]
-   **APIs:** OpenStreetMap API

## Project Structure

```
.
├── backend/                # Main backend API for the application
├── driver_frontend/        # Expo app for drivers
├── frontend/               # Frontend for the Admin point of view
├── models/                 # Contains the different optimization models
│   ├── deep_q_learning/
│   └── google_or_tools_ml/
└── README.md               # This file
```

*(Note: This is a simplified overview. More detailed structure can be added as the project evolves.)*

## Setup and Installation

### Backend

(Instructions for setting up the backend will be added here based on `backend/Readme.md` or further information.)

### Frontend (Admin)

(Instructions for setting up the admin frontend will be added here based on `frontend/README.md` or further information.)

### Driver Frontend (Expo App)

1.  **Install dependencies:**
    ```bash
    cd driver_frontend
    npm install
    ```
2.  **Start the app:**
    ```bash
    npx expo start
    ```
    This will provide options to open the app in a development build, Android emulator, iOS simulator, or Expo Go.

## Usage

### Admin Interface

1.  Access the Admin Dashboard through its URL.
2.  Use the "Optimize" feature to calculate the optimal delivery sequences for the day's orders.
3.  Assign the generated routes to available drivers via the "Assignment" section.
4.  Monitor ongoing deliveries using the "Tracking" feature.
5.  Manage "Customers" and "Carriers" information.
6.  Review past deliveries in "Order History".

### Driver App

1.  Open the Expo app on your mobile device.
2.  Log in with your driver credentials.
3.  View your assigned deliveries on the dashboard.
4.  Select a delivery to see detailed route information and customer details.
5.  Use the navigation feature to reach the destination.
6.  Mark the delivery status (complete/incomplete) upon arrival.

## Models

The project utilizes different models for route optimization:

### Model 1: Deep Q Learning

Details about the Deep Q Learning model implementation. (Further information to be added)

### Model 2: Google OR-Tools with ML Layer

This model uses Google's OR-Tools for route optimization, enhanced with a Machine Learning layer. This layer modifies the cost matrix based on several features such as:
    -   Day of the week
    -   Month
    -   Is it a weekend?
    -   Is it rush hour?
    -   Is it night time?
    -   Temperature
    -   Humidity
    -   Weather condition
    -   Wind speed
    -   Visibility
    -   Package weight

This allows the model to learn from custom data and adapt to changing conditions.

### Model 3: To be decided

(Details for a third model will be added here if developed.)

## Admin View Images from the Project

![Dashboard](./frontend/public/images/dashboard.png)
![Tracking](./frontend/public/images/tracking.png)
![Assignment](./frontend/public/images/assign.png)
![OrderHistory](./frontend/public/images/order_history.png)
![Customers](./frontend/public/images/customer.png)
![Optimize](./frontend/public/images/optimize.png)
![Carriers](./frontend/public/images/carriers.png)

## Driver View Images from the Project

![Driver Dashboard](./frontend/public/images/driver_app/dashboard.png)
![Active Delivery 1](./frontend/public/images/driver_app/active1.png)
![Active Delivery 2](./frontend/public/images/driver_app/active2.png)
![Driver Route](./frontend/public/images/driver_app/route.png)
![Driver Navigation](./frontend/public/images/driver_app/navigation.png)
![Driver Profile](./frontend/public/images/driver_app/profile.png)

## Contributing

We welcome contributions to improve and expand this project. If you have new features, bug fixes, or improvements, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or fix.
3.  Make your changes, ensuring clear comments and documentation.
4.  Add relevant tests if applicable.
5.  Submit a pull request for review.

(More specific contribution guidelines can be added, e.g., coding standards, testing procedures.)

## License

This project is released under the [Specify License - e.g., MIT License]. (To be confirmed and updated)

(If a `LICENSE` file exists, refer to it. Otherwise, a standard license like MIT is common for open-source projects.)
