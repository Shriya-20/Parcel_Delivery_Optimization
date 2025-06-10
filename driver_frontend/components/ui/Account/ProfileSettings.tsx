import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FC } from "react";

export const ProfileSettings: FC = () => {
  return (
    <ScrollView className="flex-1">
      {/* Personal Information */}
      <View className="bg-gray-800 p-4 rounded-xl space-y-4">
        <Text className="text-white text-lg font-bold">
          Personal Information
        </Text>

        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-yellow-100 justify-center items-center mb-2">
            {/* Placeholder avatar */}
            <MaterialIcons name="manage-accounts" size={32} color="black" />
            {/* <Text className="text-3xl text-yellow-500">👤</Text> */}
          </View>
          <Text className="text-white font-semibold">Alex Johnson</Text>
          <Text className="text-gray-500 text-sm">Driver ID: DRV-12345</Text>
        </View>

        <View className="space-y-4">
          <View className="flex-row space-x-2">
            <View className="flex-1">
              <Text className="text-gray-400 text-sm mb-1">First Name</Text>
              <TextInput
                className="bg-white text-gray-800 px-3 py-2 rounded-md"
                defaultValue="Alex"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-sm mb-1">Last Name</Text>
              <TextInput
                className="bg-white text-gray-800 px-3 py-2 rounded-md"
                defaultValue="Johnson"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-400 text-sm mb-1">Email</Text>
            <TextInput
              className="bg-white text-gray-800 px-3 py-2 rounded-md"
              defaultValue="alex.johnson@example.com"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-gray-400 text-sm mb-1">Phone Number</Text>
            <TextInput
              className="bg-white text-gray-800 px-3 py-2 rounded-md"
              defaultValue="(555) 123-4567"
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-gray-400 text-sm mb-1">Address</Text>
            <TextInput
              className="bg-white text-gray-800 px-3 py-2 rounded-md"
              defaultValue="456 Driver Lane, Cityville, ST 12345"
            />
          </View>

          <TouchableOpacity className="bg-[#FFD86B] p-3 rounded-md items-center mt-2">
            <Text className="text-black font-semibold">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Security Section */}
      <View className="bg-gray-800 p-4 rounded-xl mt-6 space-y-4">
        <Text className="text-white text-lg font-bold">Security</Text>

        <View>
          <Text className="text-gray-400 text-sm mb-1">Current Password</Text>
          <TextInput
            secureTextEntry
            className="bg-white text-gray-800 px-3 py-2 rounded-md"
          />
        </View>

        <View>
          <Text className="text-gray-400 text-sm mb-1">New Password</Text>
          <TextInput
            secureTextEntry
            className="bg-white text-gray-800 px-3 py-2 rounded-md"
          />
        </View>

        <View>
          <Text className="text-gray-400 text-sm mb-1">
            Confirm New Password
          </Text>
          <TextInput
            secureTextEntry
            className="bg-white text-gray-800 px-3 py-2 rounded-md"
          />
        </View>

        <TouchableOpacity className="border border-[#FFD86B] p-3 rounded-md items-center mt-2">
          <Text className="text-[#FFD86B] font-semibold">Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
