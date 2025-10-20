/** @format */
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { Bell, Search } from "lucide-react-native";
import Categories from "../components/Categories";
import TopCommodities from "../components/TopCommodities";

const Home = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      {/* header */}
      <View className="flex-row items-center py-2 px-4 border-b border-gray-300 mt-2 justify-between">
        <Image
          source={require("../assets/app-icon.png")}
          className="h-[34px] w-[42px]"
        />
        <View className="flex-row items-center p-[6px] border border-gray-400 rounded">
          <Search size={20} className="text-gray-400" />
          <TextInput
            className="text-[13px] p-1 w-[220px]"
            placeholder="Search Products..."
          />
        </View>
        <TouchableOpacity>
          <Bell size={21} />
        </TouchableOpacity>
      </View>
      {/* banner */}
      <View className="m-3">
        <TouchableOpacity activeOpacity={0.7} className="w-full items-center">
          <Image
            source={require("../assets/banner.png")}
            className="h-[170px] w-[400px] object-contain"
          />
        </TouchableOpacity>
      </View>
      {/* commodities category */}
      <Categories />
      <TopCommodities navigation={navigation} />
      {/* <TopCommodities /> */}
    </View>
  );
};

export default Home;
