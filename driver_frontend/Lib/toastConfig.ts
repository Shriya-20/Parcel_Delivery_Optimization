// import Toast, {
//   BaseToast,
//   ErrorToast,
//   InfoToast,
// } from "react-native-toast-message";
// import type { ToastConfigParams } from "react-native-toast-message";

// type ToastProps = Parameters<typeof BaseToast>[0];

// export const toastConfig: ToastConfigParams = {
//   success: (props: ToastProps) => (
//     <BaseToast
//       {...props}
//       style={{ borderLeftColor: "#4CAF50", backgroundColor: "#ffffff" }}
//       contentContainerStyle={{ paddingHorizontal: 15 }}
//       text1Style={{
//         fontSize: 16,
//         fontWeight: "bold",
//         color: "#000000",
//       }}
//       text2Style={{
//         fontSize: 14,
//         color: "#333333",
//       }}
//     />
//   ),
//   error: (props: ToastProps) => (
//     <ErrorToast
//       {...props}
//       style={{ borderLeftColor: "#F44336", backgroundColor: "#ffffff" }}
//       contentContainerStyle={{ paddingHorizontal: 15 }}
//       text1Style={{
//         fontSize: 16,
//         fontWeight: "bold",
//         color: "#000000",
//       }}
//       text2Style={{
//         fontSize: 14,
//         color: "#333333",
//       }}
//     />
//   ),
//   info: (props: ToastProps) => (
//     <InfoToast
//       {...props}
//       style={{ borderLeftColor: "#2196F3", backgroundColor: "#ffffff" }}
//       contentContainerStyle={{ paddingHorizontal: 15 }}
//       text1Style={{
//         fontSize: 16,
//         fontWeight: "bold",
//         color: "#000000",
//       }}
//       text2Style={{
//         fontSize: 14,
//         color: "#333333",
//       }}
//     />
//   ),
// };
