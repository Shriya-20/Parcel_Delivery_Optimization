export interface Parcel {
  id: string;
  type: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: "waiting" | "on-route" | "canceled";
  estimatedDelivery?: Date;
  vehicle?: Vehicle;
}
export interface Vehicle {
  image: string;
  type: string;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  available: boolean;
  vehicleType: string;
}
