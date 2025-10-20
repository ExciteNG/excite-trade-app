/** @format */

import { View, Text, StatusBar, TouchableOpacity, Image } from "react-native";
import React from "react";
import { ArrowLeft } from "lucide-react-native";

const Orders = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white px-4">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />

      {/* header */}
      <View className="flex-row items-center h-[60px] w-full mt-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation?.goBack && navigation.goBack()}
          className="p-1 rounded-full"
        >
          <ArrowLeft size={24} color={"black"} />
        </TouchableOpacity>
        <Text className="text-[16px] font-[600] ml-3">My Account</Text>
      </View>

      <View className="flex-1 justify-center items-center space-y-4">
        <Image
          source={require("../assets/orders.png")}
          className="h-44 w-40 object-contain mx-auto"
        />
        <Text className="font-bold text-lg -mb-2">No Favorites</Text>
        <Text className="text-[12px] text-gray-500">
          You have not liked any items yet
        </Text>
      </View>
    </View>
  );
};

export default Orders;
