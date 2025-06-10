// import { Customer } from "@/types";
import Feather from "@expo/vector-icons/Feather";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Text, View } from "react-native";
import { Card } from "react-native-paper";

export default function CustomerInfo({
  customer,
}: {
  customer: {
    first_name: string;
    last_name: string | null;
    phone_number: string;
    address: string | null;
    customer_id: string;
  };
}) {
  return (
    <Card className="bg-gray-900 p-4 rounded-lg mt-2">
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-white text-xl mb-2">Customer Information</Text>

        <View className="flex flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-white text-lg">
              {customer.first_name} {customer.last_name}
            </Text>
            <Text className="text-gray-400">{customer.address}</Text>
          </View>

          {/* <View className="flex flex-row gap-2">
            <View className="bg-gray-800 p-3 rounded-lg">
              <Feather name="phone" size={24} color="white" />
            </View>
            <View className="bg-gray-800 p-3 rounded-lg">
              <FontAwesome6 name="message" size={24} color="white" />
            </View>
          </View> */}
        </View>

        <View className="bg-gray-800 p-3 rounded-lg gap-2">
          <View className="flex flex-row items-center mb-2">
            <Feather name="phone" size={24} color="white" />
            <Text className="text-white font-medium ml-2">Phone Number</Text>
          </View>
          <Text className="text-gray-300 ml-2">{customer.phone_number}</Text>
        </View>
      </View>
    </Card>
  );
}
