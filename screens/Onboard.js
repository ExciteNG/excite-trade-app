/** @format */

import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { ArrowRight, MoveRight } from "lucide-react-native";

const Onboard = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ImageBackground
        source={require("../assets/full.png")}
        className="absolute inset-0 w-full h-full"
      />
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle="light-content"
      />

      <Image
        source={require("../assets/white-logo.png")}
        className="w-[70px] h-14 mb-4 absolute top-[60px] left-8"
      />
      {/* buttons view */}
      <View className="w-full px-4 absolute bottom-[120px]">
        <View className="flex-row items-center justify-between space-x-4 mb-6">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-white p-[10px] flex-1 rounded-lg items-center w-[220px]"
          >
            <Text className="font-[500]">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-[#A7CC48] p-[10px] flex-1 rounded-lg items-center w-[220px]"
          >
            <Text className="font-[500]">Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row space-x-1 justify-center items-center border-b border-white w-[130px] mx-auto"
        >
          <Text className="text-white font-[500]">Continue as Guest</Text>
          <ArrowRight size={18} color={"white"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboard;
