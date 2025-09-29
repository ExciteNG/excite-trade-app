/** @format */

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { Eye, EyeOff } from "lucide-react-native";

const OffTakerSignup = () => {
  const [country, setCountry] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const countries = [
    { name: "Nigeria" },
    { name: "Ghana" },
    { name: "Senegal" },
    { name: "United States" },
  ];
  return (
    <View className="px-2 m-3 ">
      <Text className="font-[600] text-[18px]">Join Excite Trade for Free</Text>
      <Text className="text-[13px] text-gray-500 mt-0">
        Sign up for an account and start buying today
      </Text>
      {/* inputs view */}
      <View className="mt-4">
        <View>
          <Text className="text-xs font-medium mt-1 mb-1">Country</Text>
          <Dropdown
            autoScroll
            showsVerticalScrollIndicator={false}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            itemTextStyle={{ fontSize: 13.5 }}
            maxHeight={250}
            data={countries}
            labelField={"name"}
            value={country?.name}
            valueField={"name"}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            placeholder="Select Your Country"
            onChange={(item) => {
              setCountry(item);
              setIsFocus(false);
            }}
          />
        </View>
      </View>
      <Text className="mt-4 text-gray-800 text-[12px] font-[500]">
        Work Email
      </Text>
      <TextInput
        className="w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
        placeholder="Enter your work email"
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

export default OffTakerSignup;

const styles = StyleSheet.create({
  textArea: {
    height: 150,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top", // Ensures the text starts at the top of the input box
    fontSize: 12,
    borderRadius: 5,
  },
  container: {
    backgroundColor: "white",
  },
  dropdown: {
    height: 45,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 11,
  },
  placeholderStyle: {
    fontSize: 12,
  },
  selectedTextStyle: {
    fontSize: 13,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
