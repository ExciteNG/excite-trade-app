/** @format */

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";

const Login = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- Add this line

  return (
    <View className="flex-1 bg-white px-5">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      {/* header */}
      <View className="flex-row items-center  h-[60px] w-full mt-8 ">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          className="p-1 rounded-full"
        >
          <ArrowLeft size={24} color={"black"} />
        </TouchableOpacity>
        <Image
          source={require("../assets/app-icon.png")}
          className="h-[40px] w-[50px] ml-[33%]"
        />
      </View>

      <Text className="text-[20px] font-[600] mt-8">Welcome Back</Text>
      <Text className="text-[14px] text-gray-500">
        Log in into your account
      </Text>

      <Text className="mt-8 text-gray-800 text-[12px] font-[500]">Email</Text>
      <TextInput
        className="w-full h-[43px] rounded p-2 border border-gray-400 mt-1"
        placeholder="Enter your email"
      />
      <View className="mt-[18px]">
        <Text className="font-[500] text-gray-800 text-[12px]">Password</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            value={password}
            onChangeText={(val) => setPassword(val)}
            placeholder="*******"
            secureTextEntry={!showPassword}
            className="h-[43px] w-full border p-2 border-gray-400 rounded mt-1 pr-10"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: 10,
              top: 13,
              padding: 4,
            }}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff size={19} className="text-gray-700" />
            ) : (
              <Eye size={19} className="text-gray-700" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="mt-2 flex-row justify-end"
        activeOpacity={0.7}
      >
        <Text className="text-gray-500">Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-[#A7CC48] h-[43px] rounded justify-center items-center mt-8">
        <Text className="font-[500]">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        className="mt-4 flex-row justify-center items-center"
        activeOpacity={0.7}
      >
        <Text>Don't have an account? </Text>
        <Text className="text-[#A7CC48] font-[500]">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
