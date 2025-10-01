/** @format */
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React from "react";

const categories = [
  {
    id: "1",
    name: "Cassava",
    image: require("../assets/cassava.png"),
  },
  {
    id: "2",
    name: "Cocoa",
    image: require("../assets/cocoa.png"),
  },
  {
    id: "3",
    name: "Carrot",
    image: require("../assets/carrot.png"),
  },
  {
    id: "4",
    name: "Maize",
    image: require("../assets/corn.png"),
  },
  {
    id: "5",
    name: "Cashew",
    image: require("../assets/cashew.png"),
  },
  {
    id: "6",
    name: "Cocoa",
    image: require("../assets/cocoa.png"),
  },
  {
    id: "7",
    name: "Carrot",
    image: require("../assets/carrot.png"),
  },
  {
    id: "8",
    name: "Maize",
    image: require("../assets/corn.png"),
  },
];

const Categories = () => {
  return (
    <View className="px-4 -mt-2">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-[500]">Top Commodities</Text>
        <TouchableOpacity>
          <Text className="text-[#A7CC48] font-[500]">See All</Text>
        </TouchableOpacity>
      </View>
      {/* mapping */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
      >
        {categories?.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="items-center flex-row p-1 bg-gray-100 rounded"
          >
            <Image source={item.image} className="h-6 w-6 object-contain" />
            <Text className="text-[12px] mt-1 font-[400]">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;
