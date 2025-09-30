/** @format */
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";

const FarmerSignup = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="px-2 m-3 ">
      <Text className="font-[600] text-[18px]">Join Excite Trade for Free</Text>
      <Text className="text-[13px] text-gray-500 mt-0">
        Sign up for an account and start selling today.
      </Text>
      {/* inputs view */}
      <Text className="mt-4 text-gray-800 text-[12px] font-[500]">Email</Text>
      <TextInput
        className="w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
        placeholder="Enter your email"
      />
      <Text className="mt-4 text-gray-800 text-[12px] font-[500]">
        Phone No
      </Text>
      <TextInput
        className="w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
        placeholder="080******"
        keyboardType="numeric"
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
      <TouchableOpacity className="bg-[#A7CC48] h-[43px] rounded justify-center items-center mt-8">
        <Text className="font-[500]">Proceed</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-2">
        <Text className="text-[11px]">
          By creating an account, you agree to Excite Trade's{" "}
          <Text className="text-[#A7CC48]">Terms of Service</Text> and{" "}
          <Text className="text-[#A7CC48]">Privacy Policy.</Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        className="mt-4 flex-row justify-center items-center"
        activeOpacity={0.7}
      >
        <Text>Already have an account? </Text>
        <Text className="text-[#A7CC48] font-[500]">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FarmerSignup;
