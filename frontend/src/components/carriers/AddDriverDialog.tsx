// import React, { useState } from "react";
// import { Plus, Eye, EyeOff } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner"; // Assuming you have sonner for toasts

// // Define VehicleType enum based on your Prisma schema
// enum VehicleType {
//   motorcycle = "motorcycle",
//   sedan = "sedan",
//   suv = "suv",
//   van = "van",
//   truck = "truck",
// }

// interface FormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phoneNumber: string;
//   address: string;
//   startLocationLatitude: string;
//   startLocationLongitude: string;
//   startLocation: string;
//   status: "ACTIVE" | "INACTIVE" | "BUSY";
//   // Vehicle Details
//   vehicleType: VehicleType | ""; // Add vehicle type
//   vehicleCompany: string;
//   vehicleModel: string;
//   vehicleYear: string; // Keep as string for input, convert to number on submit
//   vehicleColor: string;
//   licensePlate: string;
// }

// interface FormErrors {
//   firstName?: string;
//   email?: string;
//   password?: string;
//   phoneNumber?: string;
//   startLocation?: string;
//   startLocationLatitude?: string;
//   startLocationLongitude?: string;
//   // Vehicle Errors
//   vehicleType?: string;
//   vehicleCompany?: string;
//   vehicleModel?: string;
//   vehicleYear?: string;
//   vehicleColor?: string;
//   licensePlate?: string;
// }

// const AddDriverDialog: React.FC = () => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const [formData, setFormData] = useState<FormData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     address: "",
//     startLocationLatitude: "",
//     startLocationLongitude: "",
//     startLocation: "",
//     status: "ACTIVE",
//     // Vehicle Details
//     vehicleType: "",
//     vehicleCompany: "",
//     vehicleModel: "",
//     vehicleYear: "",
//     vehicleColor: "",
//     licensePlate: "",
//   });

//   const [errors, setErrors] = useState<FormErrors>({});

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error when user starts typing
//     if (errors[name as keyof FormErrors]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: undefined,
//       }));
//     }
//   };

//   const handleSelectChange = (
//     name: keyof FormData,
//     value: string | "ACTIVE" | "INACTIVE" | "BUSY" | VehicleType
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error for select inputs
//     if (errors[name as keyof FormErrors]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: undefined,
//       }));
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     // Driver Details Validation
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!formData.phoneNumber.trim()) {
//       newErrors.phoneNumber = "Phone number is required";
//     }

//     if (!formData.startLocation.trim()) {
//       newErrors.startLocation = "Start location is required";
//     }

//     // Validate coordinates if provided
//     if (
//       formData.startLocationLatitude &&
//       (isNaN(Number(formData.startLocationLatitude)) ||
//         Number(formData.startLocationLatitude) < -90 ||
//         Number(formData.startLocationLatitude) > 90)
//     ) {
//       newErrors.startLocationLatitude = "Invalid latitude (-90 to 90)";
//     }

//     if (
//       formData.startLocationLongitude &&
//       (isNaN(Number(formData.startLocationLongitude)) ||
//         Number(formData.startLocationLongitude) < -180 ||
//         Number(formData.startLocationLongitude) > 180)
//     ) {
//       newErrors.startLocationLongitude = "Invalid longitude (-180 to 180)";
//     }

//     // Vehicle Details Validation (all required for now)
//     if (!formData.vehicleType) {
//       newErrors.vehicleType = "Vehicle type is required";
//     }
//     if (!formData.vehicleCompany.trim()) {
//       newErrors.vehicleCompany = "Vehicle company is required";
//     }
//     if (!formData.vehicleModel.trim()) {
//       newErrors.vehicleModel = "Vehicle model is required";
//     }
//     if (!formData.vehicleYear.trim()) {
//       newErrors.vehicleYear = "Vehicle year is required";
//     } else if (
//       isNaN(Number(formData.vehicleYear)) ||
//       Number(formData.vehicleYear) <= 1900 ||
//       Number(formData.vehicleYear) > new Date().getFullYear() + 1
//     ) {
//       newErrors.vehicleYear = `Invalid year (e.g., 2023)`;
//     }
//     if (!formData.vehicleColor.trim()) {
//       newErrors.vehicleColor = "Vehicle color is required";
//     }
//     if (!formData.licensePlate.trim()) {
//       newErrors.licensePlate = "License plate is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       toast.error("Please correct the errors in the form.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Prepare data for API submission
//       const submitData = {
//         driver: {
//           first_name: formData.firstName,
//           last_name: formData.lastName || null,
//           email: formData.email,
//           password: formData.password, // Hash this on the backend
//           phone_number: formData.phoneNumber,
//           address: formData.address || null,
//           start_location_latitude: formData.startLocationLatitude
//             ? parseFloat(formData.startLocationLatitude)
//             : null,
//           start_location_longitude: formData.startLocationLongitude
//             ? parseFloat(formData.startLocationLongitude)
//             : null,
//           start_location: formData.startLocation,
//           status: formData.status,
//         },
//         vehicles: [{
//           type: formData.vehicleType,
//           company: formData.vehicleCompany,
//           model: formData.vehicleModel,
//           year: parseInt(formData.vehicleYear),
//           color: formData.vehicleColor,
//           license_plate: formData.licensePlate,
//         }],
//       };

//       // Replace this with your actual API call
//       console.log("Data to submit:", submitData);

//       const response = await fetch("/api/drivers", {
//         // Assuming your API endpoint
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submitData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message || "Failed to add driver and vehicle."
//         );
//       }

//       await response.json(); // If you need to read the response data

//       // Reset form and close dialog
//       setFormData({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         phoneNumber: "",
//         address: "",
//         startLocationLatitude: "",
//         startLocationLongitude: "",
//         startLocation: "",
//         status: "ACTIVE",
//         vehicleType: "",
//         vehicleCompany: "",
//         vehicleModel: "",
//         vehicleYear: "",
//         vehicleColor: "",
//         licensePlate: "",
//       });
//       setErrors({});
//       setIsOpen(false);

//       toast.success("Driver and vehicle added successfully!");
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       console.error("Error adding driver:", error);
//       toast.error(error.message || "Error adding driver. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       phoneNumber: "",
//       address: "",
//       startLocationLatitude: "",
//       startLocationLongitude: "",
//       startLocation: "",
//       status: "ACTIVE",
//       vehicleType: "",
//       vehicleCompany: "",
//       vehicleModel: "",
//       vehicleYear: "",
//       vehicleColor: "",
//       licensePlate: "",
//     });
//     setErrors({});
//     setIsOpen(false);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button variant="default" size="sm" className="h-9 hover:bg-primary/90 cursor-pointer">
//           <Plus className="h-4 w-4 mr-2" />
//           Add Driver
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         {" "}
//         {/* Increased max-width */}
//         <DialogHeader>
//           <DialogTitle>Add New Driver & Vehicle</DialogTitle>
//           <DialogDescription>
//             Fill in the driver&apos;s and their primary vehicle&apos;s
//             information.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-6 py-4">
//           {/* Driver Details Section */}
//           <div className="p-4 border rounded-md">
//             <h3 className="text-lg font-semibold mb-4">Driver Details</h3>
//             {/* Name Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">First Name *</Label>
//                 <Input
//                   id="firstName"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   placeholder="Enter first name"
//                   className={errors.firstName ? "border-destructive" : ""}
//                 />
//                 {errors.firstName && (
//                   <p className="text-sm text-destructive">{errors.firstName}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Last Name</Label>
//                 <Input
//                   id="lastName"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   placeholder="Enter last name"
//                 />
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email *</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter email address"
//                   className={errors.email ? "border-destructive" : ""}
//                 />
//                 {errors.email && (
//                   <p className="text-sm text-destructive">{errors.email}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="phoneNumber">Phone Number *</Label>
//                 <Input
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   type="tel"
//                   value={formData.phoneNumber}
//                   onChange={handleInputChange}
//                   placeholder="Enter phone number"
//                   className={errors.phoneNumber ? "border-destructive" : ""}
//                 />
//                 {errors.phoneNumber && (
//                   <p className="text-sm text-destructive">
//                     {errors.phoneNumber}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Password */}
//             <div className="space-y-2 mb-4">
//               <Label htmlFor="password">Password *</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Enter password"
//                   className={`pr-10 ${
//                     errors.password ? "border-destructive" : ""
//                   }`}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-muted-foreground" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-muted-foreground" />
//                   )}
//                 </Button>
//               </div>
//               {errors.password && (
//                 <p className="text-sm text-destructive">{errors.password}</p>
//               )}
//             </div>

//             {/* Address */}
//             <div className="space-y-2 mb-4">
//               <Label htmlFor="address">Address</Label>
//               <Textarea
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 placeholder="Enter address"
//                 rows={2}
//               />
//             </div>

//             {/* Start Location */}
//             <div className="space-y-2 mb-4">
//               <Label htmlFor="startLocation">Start Location *</Label>
//               <Input
//                 id="startLocation"
//                 name="startLocation"
//                 value={formData.startLocation}
//                 onChange={handleInputChange}
//                 placeholder="Enter start location"
//                 className={errors.startLocation ? "border-destructive" : ""}
//               />
//               {errors.startLocation && (
//                 <p className="text-sm text-destructive">
//                   {errors.startLocation}
//                 </p>
//               )}
//             </div>

//             {/* Coordinates */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div className="space-y-2">
//                 <Label htmlFor="startLocationLatitude">
//                   Start Location Latitude
//                 </Label>
//                 <Input
//                   id="startLocationLatitude"
//                   name="startLocationLatitude"
//                   type="number"
//                   step="any"
//                   value={formData.startLocationLatitude}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 12.9716"
//                   className={
//                     errors.startLocationLatitude ? "border-destructive" : ""
//                   }
//                 />
//                 {errors.startLocationLatitude && (
//                   <p className="text-sm text-destructive">
//                     {errors.startLocationLatitude}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="startLocationLongitude">
//                   Start Location Longitude
//                 </Label>
//                 <Input
//                   id="startLocationLongitude"
//                   name="startLocationLongitude"
//                   type="number"
//                   step="any"
//                   value={formData.startLocationLongitude}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 77.5946"
//                   className={
//                     errors.startLocationLongitude ? "border-destructive" : ""
//                   }
//                 />
//                 {errors.startLocationLongitude && (
//                   <p className="text-sm text-destructive">
//                     {errors.startLocationLongitude}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Status */}
//             <div className="space-y-2">
//               <Label htmlFor="status">Status</Label>
//               <Select
//                 value={formData.status}
//                 onValueChange={(value: "ACTIVE" | "INACTIVE" | "BUSY") =>
//                   handleSelectChange("status", value)
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ACTIVE">Active</SelectItem>
//                   <SelectItem value="INACTIVE">Inactive</SelectItem>
//                   <SelectItem value="BUSY">Busy</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Vehicle Details Section */}
//           <div className="p-4 border rounded-md">
//             <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
//             {/* Vehicle Type */}
//             <div className="space-y-2 mb-4">
//               <Label htmlFor="vehicleType">Vehicle Type *</Label>
//               <Select
//                 value={formData.vehicleType}
//                 onValueChange={(value: VehicleType) =>
//                   handleSelectChange("vehicleType", value)
//                 }
//               >
//                 <SelectTrigger
//                   className={errors.vehicleType ? "border-destructive" : ""}
//                 >
//                   <SelectValue placeholder="Select vehicle type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.values(VehicleType).map((type) => (
//                     <SelectItem key={type} value={type}>
//                       {type.charAt(0).toUpperCase() + type.slice(1)}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.vehicleType && (
//                 <p className="text-sm text-destructive">{errors.vehicleType}</p>
//               )}
//             </div>

//             {/* Company & Model */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div className="space-y-2">
//                 <Label htmlFor="vehicleCompany">Company *</Label>
//                 <Input
//                   id="vehicleCompany"
//                   name="vehicleCompany"
//                   value={formData.vehicleCompany}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Honda"
//                   className={errors.vehicleCompany ? "border-destructive" : ""}
//                 />
//                 {errors.vehicleCompany && (
//                   <p className="text-sm text-destructive">
//                     {errors.vehicleCompany}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="vehicleModel">Model *</Label>
//                 <Input
//                   id="vehicleModel"
//                   name="vehicleModel"
//                   value={formData.vehicleModel}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Civic"
//                   className={errors.vehicleModel ? "border-destructive" : ""}
//                 />
//                 {errors.vehicleModel && (
//                   <p className="text-sm text-destructive">
//                     {errors.vehicleModel}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Year & Color */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div className="space-y-2">
//                 <Label htmlFor="vehicleYear">Year *</Label>
//                 <Input
//                   id="vehicleYear"
//                   name="vehicleYear"
//                   type="number"
//                   value={formData.vehicleYear}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 2023"
//                   className={errors.vehicleYear ? "border-destructive" : ""}
//                 />
//                 {errors.vehicleYear && (
//                   <p className="text-sm text-destructive">
//                     {errors.vehicleYear}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="vehicleColor">Color *</Label>
//                 <Input
//                   id="vehicleColor"
//                   name="vehicleColor"
//                   value={formData.vehicleColor}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Red"
//                   className={errors.vehicleColor ? "border-destructive" : ""}
//                 />
//                 {errors.vehicleColor && (
//                   <p className="text-sm text-destructive">
//                     {errors.vehicleColor}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* License Plate */}
//             <div className="space-y-2">
//               <Label htmlFor="licensePlate">License Plate *</Label>
//               <Input
//                 id="licensePlate"
//                 name="licensePlate"
//                 value={formData.licensePlate}
//                 onChange={handleInputChange}
//                 placeholder="e.g., ABC-123"
//                 className={errors.licensePlate ? "border-destructive" : ""}
//               />
//               {errors.licensePlate && (
//                 <p className="text-sm text-destructive">
//                   {errors.licensePlate}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-2 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancel}
//               disabled={isLoading}
//               className="hover:bg-secondary/90 cursor-pointer"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="button"
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="hover:bg-primary/90 cursor-pointer"
//             >
//               {isLoading ? "Adding..." : "Add Driver & Vehicle"}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddDriverDialog;
import React, { useState } from "react";
import { Plus, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Assuming you have sonner for toasts

// Define VehicleType enum based on your Prisma schema (or Zod schema if preferred)
enum VehicleType {
  motorcycle = "motorcycle",
  sedan = "sedan",
  suv = "suv",
  van = "van",
  truck = "truck",
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  startLocationLatitude: string;
  startLocationLongitude: string;
  startLocation: string;
  status: "ACTIVE" | "INACTIVE" | "BUSY";
  // Vehicle Details (temporarily flattened for form input)
  vehicleType: VehicleType | "";
  vehicleCompany: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  licensePlate: string;
}

interface FormErrors {
  firstName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  startLocation?: string;
  startLocationLatitude?: string;
  startLocationLongitude?: string;
  vehicleType?: string;
  vehicleCompany?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColor?: string;
  licensePlate?: string;
}

const AddDriverDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    startLocationLatitude: "",
    startLocationLongitude: "",
    startLocation: "",
    status: "ACTIVE",
    vehicleType: "",
    vehicleCompany: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    licensePlate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (
    name: keyof FormData,
    value: string | "ACTIVE" | "INACTIVE" | "BUSY" | VehicleType
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Driver Details Validation
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      // Updated to 8 for Zod schema
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.startLocation.trim())
      newErrors.startLocation = "Start location is required";

    if (
      formData.startLocationLatitude &&
      (isNaN(Number(formData.startLocationLatitude)) ||
        Number(formData.startLocationLatitude) < -90 ||
        Number(formData.startLocationLatitude) > 90)
    ) {
      newErrors.startLocationLatitude = "Invalid latitude (-90 to 90)";
    }
    if (
      formData.startLocationLongitude &&
      (isNaN(Number(formData.startLocationLongitude)) ||
        Number(formData.startLocationLongitude) < -180 ||
        Number(formData.startLocationLongitude) > 180)
    ) {
      newErrors.startLocationLongitude = "Invalid longitude (-180 to 180)";
    }

    // Vehicle Details Validation
    if (!formData.vehicleType)
      newErrors.vehicleType = "Vehicle type is required";
    if (!formData.vehicleCompany.trim())
      newErrors.vehicleCompany = "Vehicle company is required";
    if (!formData.vehicleModel.trim())
      newErrors.vehicleModel = "Vehicle model is required";
    if (!formData.vehicleYear.trim()) {
      newErrors.vehicleYear = "Vehicle year is required";
    } else {
      const year = Number(formData.vehicleYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        // Allowing current year + 1 for new models
        newErrors.vehicleYear = `Invalid year (e.g., ${currentYear})`;
      }
    }
    if (!formData.vehicleColor.trim())
      newErrors.vehicleColor = "Vehicle color is required";
    if (!formData.licensePlate.trim())
      newErrors.licensePlate = "License plate is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data to match the Zod schema's expected structure
      const submitData = {
        first_name: formData.firstName,
        last_name: formData.lastName || undefined, // Use undefined for optional fields if empty
        email: formData.email,
        password: formData.password, // Send plain password to backend for hashing
        phone_number: formData.phoneNumber,
        address: formData.address || undefined,
        start_location_latitude: formData.startLocationLatitude
          ? parseFloat(formData.startLocationLatitude)
          : undefined,
        start_location_longitude: formData.startLocationLongitude
          ? parseFloat(formData.startLocationLongitude)
          : undefined,
        start_location: formData.startLocation,
        // Assuming 'status' is not part of your driverSchema currently for creation,
        // or you'll need to add it there if it's meant to be sent from the frontend.
        // If it's a default on the backend, you don't send it here.
        // For now, removing it as it's not in your provided driverSchema.
        // If you want to send it, add it to the Zod schema: status: z.enum(['ACTIVE', 'INACTIVE', 'BUSY']).default('ACTIVE'),

        vehicles: [
          // Create an array with a single vehicle object
          {
            type: formData.vehicleType as VehicleType, // Cast to VehicleType enum
            company: formData.vehicleCompany,
            model: formData.vehicleModel,
            year: parseInt(formData.vehicleYear),
            color: formData.vehicleColor,
            license_plate: formData.licensePlate,
          },
        ],
      };

      console.log("Data to submit:", submitData);

      const response = await fetch("http://localhost:8000/api/drivers", {
        // Your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message ||
          errorData.errors?.[0]?.message ||
          "Failed to add driver.";
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      // Reset form and close dialog
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        startLocationLatitude: "",
        startLocationLongitude: "",
        startLocation: "",
        status: "ACTIVE", // Resetting status as well for next open
        vehicleType: "",
        vehicleCompany: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleColor: "",
        licensePlate: "",
      });
      setErrors({});
      setIsOpen(false);

      toast.success("Driver and vehicle added successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error adding driver:", error);
      toast.error(error.message || "Error adding driver. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      startLocationLatitude: "",
      startLocationLongitude: "",
      startLocation: "",
      status: "ACTIVE",
      vehicleType: "",
      vehicleCompany: "",
      vehicleModel: "",
      vehicleYear: "",
      vehicleColor: "",
      licensePlate: "",
    });
    setErrors({});
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="h-9">
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Driver & Vehicle</DialogTitle>
          <DialogDescription>
            Fill in the driver&apos;s and their primary vehicle&apos;s information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Driver Details Section */}
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-4">Driver Details</h3>
            {/* ... (rest of your driver input fields remain the same) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className={errors.phoneNumber ? "border-destructive" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={`pr-10 ${
                    errors.password ? "border-destructive" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                rows={2}
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="startLocation">Start Location *</Label>
              <Input
                id="startLocation"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleInputChange}
                placeholder="Enter start location"
                className={errors.startLocation ? "border-destructive" : ""}
              />
              {errors.startLocation && (
                <p className="text-sm text-destructive">
                  {errors.startLocation}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="startLocationLatitude">
                  Start Location Latitude
                </Label>
                <Input
                  id="startLocationLatitude"
                  name="startLocationLatitude"
                  type="number"
                  step="any"
                  value={formData.startLocationLatitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 12.9716"
                  className={
                    errors.startLocationLatitude ? "border-destructive" : ""
                  }
                />
                {errors.startLocationLatitude && (
                  <p className="text-sm text-destructive">
                    {errors.startLocationLatitude}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startLocationLongitude">
                  Start Location Longitude
                </Label>
                <Input
                  id="startLocationLongitude"
                  name="startLocationLongitude"
                  type="number"
                  step="any"
                  value={formData.startLocationLongitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 77.5946"
                  className={
                    errors.startLocationLongitude ? "border-destructive" : ""
                  }
                />
                {errors.startLocationLongitude && (
                  <p className="text-sm text-destructive">
                    {errors.startLocationLongitude}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "ACTIVE" | "INACTIVE" | "BUSY") =>
                  handleSelectChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="BUSY">Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vehicle Details Section */}
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
            <div className="space-y-2 mb-4">
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select
                value={formData.vehicleType}
                onValueChange={(value: VehicleType) =>
                  handleSelectChange("vehicleType", value)
                }
              >
                <SelectTrigger
                  className={errors.vehicleType ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(VehicleType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleType && (
                <p className="text-sm text-destructive">{errors.vehicleType}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleCompany">Company *</Label>
                <Input
                  id="vehicleCompany"
                  name="vehicleCompany"
                  value={formData.vehicleCompany}
                  onChange={handleInputChange}
                  placeholder="e.g., Honda"
                  className={errors.vehicleCompany ? "border-destructive" : ""}
                />
                {errors.vehicleCompany && (
                  <p className="text-sm text-destructive">
                    {errors.vehicleCompany}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Model *</Label>
                <Input
                  id="vehicleModel"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  placeholder="e.g., Civic"
                  className={errors.vehicleModel ? "border-destructive" : ""}
                />
                {errors.vehicleModel && (
                  <p className="text-sm text-destructive">
                    {errors.vehicleModel}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleYear">Year *</Label>
                <Input
                  id="vehicleYear"
                  name="vehicleYear"
                  type="number"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2023"
                  className={errors.vehicleYear ? "border-destructive" : ""}
                />
                {errors.vehicleYear && (
                  <p className="text-sm text-destructive">
                    {errors.vehicleYear}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleColor">Color *</Label>
                <Input
                  id="vehicleColor"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleInputChange}
                  placeholder="e.g., Red"
                  className={errors.vehicleColor ? "border-destructive" : ""}
                />
                {errors.vehicleColor && (
                  <p className="text-sm text-destructive">
                    {errors.vehicleColor}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate *</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                placeholder="e.g., ABC-123"
                className={errors.licensePlate ? "border-destructive" : ""}
              />
              {errors.licensePlate && (
                <p className="text-sm text-destructive">
                  {errors.licensePlate}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Driver & Vehicle"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverDialog;