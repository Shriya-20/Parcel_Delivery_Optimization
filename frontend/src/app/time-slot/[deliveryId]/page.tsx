// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// // import { Separator } from "@/components/ui/separator";
// import { toast } from "sonner";
// import { fetchDeliveryByDeliveryId } from "@/lib/clientSideDataServices";
// import { Customer, DeliveryWithRelations } from "@/lib/types";
// import {
//   Clock,
//   MapPin,
//   Package,
//   User,
//   Phone,
//   Mail,
//   Calendar,
//   Truck,
// } from "lucide-react";

// interface TimeSlot {
//   start_time: Date;
//   end_time: Date;
// }

// const timeslots = [
//   { id: "1", date: "Today", start_time: "9:00", end_time: "10:00" },
//   { id: "2", date: "Today", start_time: "10:00", end_time: "11:00" },
//   { id: "3", date: "Today", start_time: "11:00", end_time: "12:00" },
//   { id: "4", date: "Today", start_time: "12:00", end_time: "13:00" },
//   { id: "5", date: "Today", start_time: "13:00", end_time: "14:00" },
//   { id: "6", date: "Tomorrow", start_time: "9:00", end_time: "10:00" },
//   { id: "7", date: "Tomorrow", start_time: "10:00", end_time: "11:00" },
//   { id: "8", date: "Tomorrow", start_time: "11:00", end_time: "12:00" },
//   { id: "9", date: "Tomorrow", start_time: "12:00", end_time: "13:00" },
// ];

// export default function TimeSlotPage() {
//   const { deliveryId } = useParams();
//   const [delivery, setDelivery] = useState<DeliveryWithRelations | null>(null);
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [timeslot, setTimeslot] = useState<TimeSlot | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selecting, setSelecting] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDeliveryDetails = async () => {
//       try {
//         const response: DeliveryWithRelations = await fetchDeliveryByDeliveryId(
//           deliveryId as string
//         );
//         setDelivery(response);
//         setCustomer(response.customer);
//         if (response.time_slot) {
//           setTimeslot(response.time_slot);
//         }
//       } catch (error) {
//         console.error("Error fetching delivery details:", error);
//         toast.error("Failed to load delivery details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeliveryDetails();
//   }, [deliveryId]);

//   const handleSelect = async (slotId: string) => {
//     setSelecting(slotId);
//     try {
//       const res = await fetch(`/api/select-slot`, {
//         method: "POST",
//         body: JSON.stringify({ deliveryId, slotId }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (res.ok) {
//         toast.success("Time slot selected successfully!");
//         // Refresh the data to show updated slot
//         const response: DeliveryWithRelations = await fetchDeliveryByDeliveryId(
//           deliveryId as string
//         );
//         setDelivery(response);
//         if (response.time_slot) {
//           setTimeslot(response.time_slot);
//         }
//       } else {
//         toast.error("Failed to select time slot");
//       }
//     } catch (error) {
//       console.error("Error selecting slot:", error);
//       toast.error("Failed to select time slot");
//     } finally {
//       setSelecting(null);
//     }
//   };

//   const formatDate = (date: Date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const formatTimeSlot = (slot: TimeSlot) => {
//     const startTime = new Date(slot.start_time).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//     const endTime = new Date(slot.end_time).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//     return `${startTime} - ${endTime}`;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex items-center justify-center min-h-[60vh]">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-lg text-gray-600">
//                 Loading delivery details...
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!delivery || !customer) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center">
//             <p className="text-lg text-red-600">
//               Failed to load delivery details
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="container mx-auto px-4 py-8 max-w-4xl">
//         {/* Header with Logo */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-4">
//             {/* <span className="text-3xl font-bold">
//               <span className="text-black">MD</span>
//               <span className="text-Black font-bold">MD</span>
//               <span className="text-blue-600 ml-1">Margadarshini</span>
//               <span className="font-semibold text-lg">Margadarshi </span>
//             </span> */}
//             <div className="p-4 border-b flex justify-start items-center gap-2">
//               <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
//                 <span className="text-primary-foreground font-bold">MD</span>
//               </div>
//               <span className="font-semibold text-lg">Margadarshi </span>
//             </div>
//           </div>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Delivery Time Slot Selection
//           </h1>
//         </div>

//         {/* Customer Information */}
//         <Card className="mb-6 shadow-lg border-0">
//           <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Customer Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <User className="h-4 w-4 text-gray-500" />
//                   <span className="font-medium">
//                     {customer.first_name} {customer.last_name || ""}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Phone className="h-4 w-4 text-gray-500" />
//                   <span>{customer.phone_number}</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Mail className="h-4 w-4 text-gray-500" />
//                   <span>{customer.email}</span>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex items-start gap-3">
//                   <MapPin className="h-4 w-4 text-gray-500 mt-1" />
//                   <span className="text-sm">
//                     {customer.address || "Address not provided"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Delivery Information */}
//         <Card className="mb-6 shadow-lg border-0">
//           <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
//             <CardTitle className="flex items-center gap-2">
//               <Package className="h-5 w-5" />
//               Delivery Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <Package className="h-4 w-4 text-gray-500" />
//                   <span>
//                     Weight: <strong>{delivery.weight} kg</strong>
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Package className="h-4 w-4 text-gray-500" />
//                   <span>
//                     Size: <strong>{delivery.size}</strong>
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Calendar className="h-4 w-4 text-gray-500" />
//                   <span>
//                     Delivery Date:{" "}
//                     <strong>{formatDate(delivery.delivery_date)}</strong>
//                   </span>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <MapPin className="h-4 w-4 text-gray-500" />
//                   <span>
//                     Drop-off: <strong>{delivery.dropoff_location}</strong>
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Badge
//                     variant={
//                       delivery.priority === 1
//                         ? "destructive"
//                         : delivery.priority === 2
//                         ? "default"
//                         : "secondary"
//                     }
//                   >
//                     Priority:{" "}
//                     {delivery.priority === 1
//                       ? "High"
//                       : delivery.priority === 2
//                       ? "Medium"
//                       : "Low"}
//                   </Badge>
//                 </div>
//                 {delivery.delivery_instructions && (
//                   <div className="mt-3">
//                     <p className="text-sm text-gray-600">
//                       <strong>Instructions:</strong>{" "}
//                       {delivery.delivery_instructions}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Current Time Slot or Selection */}
//         {timeslot ? (
//           <Card className="mb-6 shadow-lg border-0 border-l-4 border-l-green-500">
//             <CardHeader className="bg-green-50">
//               <CardTitle className="flex items-center gap-2 text-green-700">
//                 <Clock className="h-5 w-5" />
//                 Your Preferred Time Slot
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-lg font-semibold text-green-700">
//                     {formatTimeSlot(timeslot)}
//                   </p>
//                   <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
//                     <Truck className="h-4 w-4" />
//                     Delivery will arrive within 2 days
//                   </p>
//                 </div>
//                 <Badge
//                   variant="secondary"
//                   className="bg-green-100 text-green-700 border-green-200"
//                 >
//                   Confirmed
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//         ) : (
//           <Card className="shadow-lg border-0">
//             <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 Select Your Preferred Time Slot
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <p className="text-gray-600 mb-6 flex items-center gap-2">
//                 <Truck className="h-4 w-4" />
//                 Choose a convenient time slot. Delivery will arrive within 2
//                 days of your selected time.
//               </p>
//               <div className="grid gap-4 md:grid-cols-2">
//                 {timeslots.map((slot) => (
//                   <Card
//                     key={slot.id}
//                     className="hover:shadow-md transition-all duration-200 border-2 hover:border-blue-200"
//                   >
//                     <CardHeader className="pb-3">
//                       <CardTitle className="text-lg flex items-center justify-between">
//                         <span>{slot.date}</span>
//                         <Badge variant="outline">
//                           {slot.start_time} - {slot.end_time}
//                         </Badge>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="pt-0">
//                       <Button
//                         onClick={() => handleSelect(slot.id)}
//                         className="w-full bg-blue-600 hover:bg-blue-700"
//                         disabled={selecting === slot.id}
//                       >
//                         {selecting === slot.id ? (
//                           <div className="flex items-center gap-2">
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                             Selecting...
//                           </div>
//                         ) : (
//                           "Select This Slot"
//                         )}
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchDeliveryByDeliveryId, sendTimeslot } from "@/lib/clientSideDataServices";
import { Customer, DeliveryWithRelations } from "@/lib/types";
import {
  Clock,
  MapPin,
  Package,
  User,
  Phone,
  Mail,
  Calendar,
  Truck,
} from "lucide-react";
// import { sendTimeslot } from "@/lib/fetchDataService";

interface TimeSlot {
  start_time: Date;
  end_time: Date;
}

// Generate time slots with proper Date objects (2 days from today)
const generateTimeSlots = () => {
  const slots = [];
  const today = new Date();
  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);

  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

  const timeRanges = [
    { start: 9, end: 10 },
    { start: 10, end: 11 },
    { start: 11, end: 12 },
    { start: 12, end: 13 },
    { start: 13, end: 14 },
    { start: 14, end: 15 },
    { start: 15, end: 16 },
    { start: 16, end: 17 },
    { start: 17, end: 18 },
  ];

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Slots for 2 days from now
  timeRanges.forEach((range, index) => {
    const startTime = new Date(twoDaysFromNow);
    startTime.setHours(range.start, 0, 0, 0);
    const endTime = new Date(twoDaysFromNow);
    endTime.setHours(range.end, 0, 0, 0);

    slots.push({
      id: `day2-${index}`,
      date: formatDisplayDate(twoDaysFromNow),
      start_time: startTime,
      end_time: endTime,
      displayTime: `${range.start.toString().padStart(2, "0")}:00 - ${range.end
        .toString()
        .padStart(2, "0")}:00`,
    });
  });

  // Slots for 3 days from now
  timeRanges.forEach((range, index) => {
    const startTime = new Date(threeDaysFromNow);
    startTime.setHours(range.start, 0, 0, 0);
    const endTime = new Date(threeDaysFromNow);
    endTime.setHours(range.end, 0, 0, 0);

    slots.push({
      id: `day3-${index}`,
      date: formatDisplayDate(threeDaysFromNow),
      start_time: startTime,
      end_time: endTime,
      displayTime: `${range.start.toString().padStart(2, "0")}:00 - ${range.end
        .toString()
        .padStart(2, "0")}:00`,
    });
  });

  return slots;
};

export default function TimeSlotPage() {
  const { deliveryId } = useParams();
  const [delivery, setDelivery] = useState<DeliveryWithRelations | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [timeslot, setTimeslot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [timeSlots] = useState(generateTimeSlots());

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response: DeliveryWithRelations = await fetchDeliveryByDeliveryId(
          deliveryId as string
        );
        setDelivery(response);
        setCustomer(response.customer);
        if (response.time_slot) {
          setTimeslot(response.time_slot);
        }
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        toast.error("Failed to load delivery details");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [deliveryId]);

  const handleSelect = async (slot: any) => {
    setSelecting(slot.id);
    try {
      const payload = {
        deliveryId,
        timeSlot: {
          start_time: slot.start_time.toISOString(), // Convert to ISO string
          end_time: slot.end_time.toISOString(), // Convert to ISO string
        },
      };
      console.log("payload is ",payload)
    //   const res = await fetch(`/api/select-slot`, {
    //     method: "POST",
    //     body: JSON.stringify(payload),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    const res = await sendTimeslot(payload);

      if (res!== null) {
        toast.success("Time slot selected successfully!");
        // Refresh the data to show updated slot
        const response: DeliveryWithRelations = await fetchDeliveryByDeliveryId(
          deliveryId as string
        );
        setDelivery(response);
        if (response.time_slot) {
          setTimeslot(response.time_slot);
        }
      } else {
        toast.error("Failed to select time slot");
      }
    } catch (error) {
      console.error("Error selecting slot:", error);
      toast.error("Failed to select time slot");
    } finally {
      setSelecting(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    const startTime = new Date(slot.start_time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const endTime = new Date(slot.end_time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${startTime} - ${endTime}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">
                Loading delivery details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!delivery || !customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-red-600">
              Failed to load delivery details
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header with Logo */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">MD</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Margadarshi
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Delivery Time Slot Selection
          </h1>
          <p className="text-gray-600">
            Overview of your delivery details and time slot preferences
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Customer Info Card */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Customer</h3>
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">
                  {customer.first_name} {customer.last_name || ""}
                </p>
                <p className="text-sm text-gray-600">{customer.phone_number}</p>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info Card */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Package</h3>
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">
                  {delivery.weight} kg
                </p>
                <p className="text-sm text-gray-600">Size: {delivery.size}</p>
                <Badge
                  variant={
                    delivery.priority === 1
                      ? "destructive"
                      : delivery.priority === 2
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {delivery.priority === 1
                    ? "High"
                    : delivery.priority === 2
                    ? "Medium"
                    : "Low"}{" "}
                  Priority
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Location Card */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Location</h3>
                <MapPin className="h-4 w-4 text-orange-600" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {delivery.dropoff_location}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(delivery.delivery_date)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Address Details */}
        <Card className="bg-white border-gray-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">
                Delivery Address
              </h3>
            </div>
            <p className="text-gray-700 ml-8">
              {customer.address || "Address not provided"}
            </p>
            {delivery.delivery_instructions && (
              <div className="mt-4 ml-8">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Special Instructions:
                </p>
                <p className="text-sm text-gray-600">
                  {delivery.delivery_instructions}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Time Slot or Selection */}
        {timeslot ? (
          <Card className="bg-white border-l-4 border-l-green-500 shadow-sm mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium text-green-700">
                  Your Preferred Time Slot
                </h3>
              </div>
              <div className="flex items-center justify-between ml-8">
                <div>
                  <p className="text-xl font-semibold text-green-700 mb-1">
                    {formatTimeSlot(timeslot)}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Delivery scheduled for your selected time slot
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Confirmed
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg font-medium text-gray-900">
                  Select Your Preferred Time Slot
                </CardTitle>
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                <Truck className="h-4 w-4" />
                Choose a convenient time slot. Delivery slots are available
                starting 2 days from today.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {slot.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">
                          {slot.displayTime}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSelect(slot)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      disabled={selecting === slot.id}
                      size="sm"
                    >
                      {selecting === slot.id ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Selecting...</span>
                        </div>
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}