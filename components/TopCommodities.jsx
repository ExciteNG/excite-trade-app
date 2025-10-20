/** @format */

import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Boxes, MapPin, Warehouse } from "lucide-react-native";

const data = [
  {
    name: "Groundnut",
    image: require("../assets/groundnut.png"),
    price: "₦2,500/ton",
  },
  {
    name: "Millet",
    image: require("../assets/millet.png"),
    price: "₦3,500/ton",
  },
  {
    name: "Groundnut",
    image: require("../assets/groundnut.png"),
    price: "₦2,500/ton",
  },
  {
    name: "Millet",
    image: require("../assets/millet.png"),
    price: "₦3,500/ton",
  },
];

const TopCommodities = ({ navigation }) => {
  return (
    <ScrollView
      style={{ flexGrow: 0 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      className="p-5 space-x-3 mt-2 mb-8"
    >
      {data.map((item, index) => (
        <TouchableOpacity
          onPress={() => navigation?.navigate("ProductDetails")}
          key={index}
          className="flex items-start w-[300px] h-[230px] relative"
        >
          <Image source={item.image} className="h-[130px] w-full rounded" />
          <Text className="font-[600] text-[14px] my-[2px]">{item.name}</Text>
          <Text>{item.price}</Text>
          <View className="flex-row items-center space-x-1 mt-1">
            <Boxes size={14} color={"#A7CC48"} />
            <Text className="text-[12px]">Helen Cluster</Text>
          </View>
          <View className="flex-row items-center space-x-1 mt-1">
            <Warehouse size={14} color={"#A7CC48"} />
            <Text className="text-[12px]">Cluster Name</Text>
          </View>
          <View className="flex-row items-center space-x-1 mt-1">
            <MapPin size={14} color={"#A7CC48"} />
            <Text className="text-[12px]">Lagos</Text>
          </View>
          <TouchableOpacity className="bg-[#A7CC48] w-[100px] h-[30px] rounded items-center justify-center mt-3 absolute bottom-0 right-0">
            <Text className="font-[500]">Buy Now</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default TopCommodities;
