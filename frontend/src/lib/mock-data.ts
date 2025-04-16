import { Parcel, Driver } from "./types";

// Mock parcels data
export const mockParcels: Parcel[] = [
  {
    id: "PRC-2345",
    type: "Standard",
    pickupAddress: "123 Main St, New York, NY 10001",
    deliveryAddress: "456 Park Ave, New York, NY 10022",
    status: "waiting",
  },
  {
    id: "PRC-6789",
    type: "Express",
    pickupAddress: "789 Broadway, New York, NY 10003",
    deliveryAddress: "321 5th Ave, New York, NY 10016",
    status: "on-route",
  },
  {
    id: "PRC-1357",
    type: "Heavy",
    pickupAddress: "555 Madison Ave, New York, NY 10022",
    deliveryAddress: "777 Lexington Ave, New York, NY 10021",
    status: "on-route",
  },
  {
    id: "PRC-2468",
    type: "Express",
    pickupAddress: "888 6th Ave, New York, NY 10001",
    deliveryAddress: "999 7th Ave, New York, NY 10019",
    status: "canceled",
  },
  {
    id: "PRC-9876",
    type: "Standard",
    pickupAddress: "111 East 72nd St, New York, NY 10021",
    deliveryAddress: "222 West 45th St, New York, NY 10036",
    status: "waiting",
  },
  {
    id: "PRC-5432",
    type: "Fragile",
    pickupAddress: "333 Canal St, New York, NY 10013",
    deliveryAddress: "444 Spring St, New York, NY 10013",
    status: "on-route",
  },
  {
    id: "PRC-8765",
    type: "Heavy",
    pickupAddress: "555 Water St, New York, NY 10002",
    deliveryAddress: "666 Pearl St, New York, NY 10004",
    status: "waiting",
  },
  {
    id: "PRC-4321",
    type: "Express",
    pickupAddress: "777 Fulton St, Brooklyn, NY 11217",
    deliveryAddress: "888 Atlantic Ave, Brooklyn, NY 11238",
    status: "canceled",
  },
];

// Mock drivers data
export const mockDrivers: Driver[] = [
  {
    id: "DRV-1001",
    name: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 4.8,
    available: true,
    vehicleType: "van",
  },
  {
    id: "DRV-1002",
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4.5,
    available: false,
    vehicleType: "truck",
  },
  {
    id: "DRV-1003",
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    rating: 4.9,
    available: true,
    vehicleType: "motorcycle",
  },
  {
    id: "DRV-1004",
    name: "Jessica Davis",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    rating: 4.7,
    available: true,
    vehicleType: "van",
  },
  {
    id: "DRV-1005",
    name: "David Wilson",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    rating: 4.3,
    available: false,
    vehicleType: "truck",
  },
  {
    id: "DRV-1006",
    name: "Emily Taylor",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    rating: 4.6,
    available: true,
    vehicleType: "motorcycle",
  },
];
