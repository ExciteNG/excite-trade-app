/** @format */

import { View, Text, StatusBar, TouchableOpacity, Image } from "react-native";
import React from "react";
import { ArrowLeft, Globe } from "lucide-react-native";

const VerifyEmail = ({ navigation }) => {
  return (
    <View className="bg-white flex-1 p-5">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      <View className=" mt-11 flex-row items-center justify-center space-x-1 border-b border-gray-300 pb-1">
        <Globe size={12} color={"black"} />
        <Text>excitetrade.com</Text>
      </View>
      <View className="flex-row items-center h-[60px] px-4 w-full mt-2">
        {/* <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          className="p-1 rounded-full"
        >
          <ArrowLeft size={24} color={"black"} />
        </TouchableOpacity> */}
        <Image
          source={require("../assets/app-icon.png")}
          className="h-[40px] w-[50px] mx-auto mt-2"
        />
      </View>
      <View className="mt-6">
        <Text className="font-bold text-[22px]">Verify Your Email</Text>
        <Text className="mt-2 text-gray-600">
          A verification link has been sent to your registered email.
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.replace("Login")}
          className="mt-14 bg-[#A7CC48] flex items-center p-3 rounded"
        >
          <Text className="font-semibold">I've Verified My Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled
          className="mt-2  flex items-center p-3 rounded"
        >
          <Text className=" text-gray-500">Open Gmail App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyEmail;
