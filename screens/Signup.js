/** @format */
import { View, Text, StatusBar, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ArrowLeft, Globe } from "lucide-react-native";

const Signup = ({ navigation }) => {
  const tabs = ["Offtakers", "Farmers/Miners", "Gem Excite"];
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  return (
    <View className="flex-1  bg-white">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      <View className=" mt-11 flex-row items-center justify-center space-x-1 border-b border-gray-300 pb-1">
        <Globe size={12} color={"black"} />
        <Text>excitetrade.com</Text>
      </View>
      {/* header */}
      <View className="flex-row items-center h-[60px] px-4 w-full mt-2">
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
      {/* tabs view */}
      <View className="flex-row justify-around items-center mt-4 border border-gray-300 rounded mx-6 py-1">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentTab(tab)}
            className={`${
              currentTab === tab ? "bg-[#A7CC48]" : ""
            } px-4 py-[7px] rounded-[2px]`}
          >
            <Text
              className={`font-[500] text-[12px] ${
                currentTab === tab ? "text-black" : "text-gray-500"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Signup;
