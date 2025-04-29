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

export type Driver = {
  id: string;
  name: string;
  status: string;
  location: { lat: number; lng: number };
  vehicle: string;
  currentDelivery: string | null;
  avatar: string;
  rating: number;
  deliveriesCompleted: number;
  phone: string;
};
