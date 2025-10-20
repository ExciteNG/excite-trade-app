/** @format */
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import {
  ArrowLeft,
  Heart,
  Boxes,
  Warehouse,
  MapPin,
  ChevronDown,
  CheckCircle,
} from "lucide-react-native";

const ProductDetails = ({ navigation }) => {
  const [descOpen, setDescOpen] = useState(false);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center py-3 px-3 border-b border-gray-200">
        <TouchableOpacity className="p-1">
          <ArrowLeft size={22} color={"#111827"} />
        </TouchableOpacity>
        <Text className="text-[16px] font-[600] ml-3">Product Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        {/* Image card */}
        <View className="rounded-lg overflow-hidden bg-gray-100 mb-4">
          <Image
            source={require("../assets/groundnut.png")}
            className="h-56 w-full object-contain"
            resizeMode="cover"
          />
        </View>

        {/* Title / Price / Actions */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 pr-3">
            <Text className="font-[600] text-[16px]">Groundnut</Text>
            <Text className="text-[#111827] font-[600] mt-1">
              ₦35,000.99/tonne
            </Text>
            <Text className="text-[#10B981] mt-1">Available</Text>

            <View className="mt-3 space-y-2">
              <View className="flex-row items-center space-x-2">
                <Boxes size={14} color={"#A7CC48"} />
                <Text className="text-[12px] text-gray-500">Helen Cluster</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Warehouse size={14} color={"#A7CC48"} />
                <Text className="text-[12px] text-gray-500">
                  45 Tonnes Capacity
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <MapPin size={14} color={"#A7CC48"} />
                <Text className="text-[12px] text-gray-500">Lagos</Text>
              </View>
            </View>
          </View>

          <View className="w-[120px] items-end">
            <TouchableOpacity className="bg-[#A7CC48] px-3 py-2 rounded-lg flex-row items-center mb-3">
              <Heart size={16} color="#0B1324" />
              <Text className="ml-2 font-[500]">Add to Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity className="border border-gray-300 px-6 py-2 rounded-lg items-center">
              <Text className="font-[600]">Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-[12px] text-[#16A34A]">
          Note: A 30% commitment fee is required before processing your
          purchase.
        </Text>

        {/* Description */}
        <View className="mt-6 bg-white rounded-lg">
          <TouchableOpacity
            activeOpacity={0.9}
            className="flex-row items-center justify-between px-3 py-3 border-b border-gray-200"
            onPress={() => setDescOpen((s) => !s)}
          >
            <Text className="font-[600]">Description</Text>
            <ChevronDown size={18} color="#374151" />
          </TouchableOpacity>

          {descOpen && (
            <View className="px-3 py-3">
              <Text className="text-gray-500">
                Lorem ipsum dolor sit amet consectetur. Erat nunc duis ut rutrum
                id vel. Viverra lorem viverra purus volutpat. Odio sodales
                lectus odio pharetra blandit facilisis. Lobortis.
              </Text>
            </View>
          )}
        </View>

        {/* Produce Details */}
        <View className="mt-4 bg-white rounded-lg p-3 shadow-sm">
          <Text className="font-[600] mb-3">Produce Details</Text>
          <View className="flex-row justify-between py-2 border-t border-gray-100">
            <Text className="text-gray-500">Purity</Text>
            <Text className="font-[600]">95% - 99% Max</Text>
          </View>
          <View className="flex-row justify-between py-2 border-t border-gray-100">
            <Text className="text-gray-500">Moisture</Text>
            <Text className="font-[600]">8% Max</Text>
          </View>
          <View className="flex-row justify-between py-2 border-t border-gray-100">
            <Text className="text-gray-500">Packaging</Text>
            <Text className="font-[600]">Bulk / Bags</Text>
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default ProductDetails;
