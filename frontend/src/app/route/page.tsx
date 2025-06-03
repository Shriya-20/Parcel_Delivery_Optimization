"use client";
import { RouteVisualization } from '@/components/optimize-routes/RouteNew';
// import { RouteVisualization } from '@/components/optimize-routes/RouteVisualization'
import React from 'react'
const page = () => {
    // const driverId = "69ca617c-9259-492f-a73a-e9e351204678"; // Replace with actual driver ID
    const driverId = "0a29e7d9-b611-45c2-955c-65814acc8d2c";
    const date = "2025-06-03"; // Get today's date in YYYY-MM-DD format(it takes into account the date rute was created so we need to pass that one)
    // const simpleFunction = (routeId:string) => {
    //     console.log(`Driver ID: ${driverId}, Date: ${date} selected route ID: ${routeId}`);
    // };
  return (
    // <RouteVisualization
    //   driverId={driverId}
    //   date={date}
    //   onRouteSelect={simpleFunction}
    // />
    <RouteVisualization
      driverId={driverId}
      date={date}
      onRouteSelect={(routeId:string) => console.log(routeId)}
    />
  );
}

export default page
