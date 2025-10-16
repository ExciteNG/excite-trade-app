/** @format */

import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import {
  ArrowLeft,
  Heart,
  CreditCard,
  Settings,
  HelpCircle,
  Bookmark,
  LogOut,
} from "lucide-react-native";

const Row = ({ Icon, title, subtitle, onPress, tint }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="flex-row items-center py-4 px-2"
  >
    <View className="h-12 w-12 rounded-full bg-gray-100 items-center justify-center">
      {Icon ? <Icon size={20} color={tint || "#111827"} /> : null}
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-gray-900 font-[600]">{title}</Text>
      {subtitle ? (
        <Text className="text-gray-500 text-[13px]">{subtitle}</Text>
      ) : null}
    </View>
    <View>
      <ArrowLeft
        size={20}
        color="#9CA3AF"
        style={{ transform: [{ rotate: "180deg" }] }}
      />
    </View>
  </TouchableOpacity>
);

const Profile = ({ navigation }) => {
  const initials = "JD";
  const name = "John Doe";
  const company = "Company name";

  return (
    <View className="flex-1 bg-white px-4">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />

      {/* header */}
      <View className="flex-row items-center h-[60px] w-full mt-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation?.goBack && navigation.goBack()}
          className="p-1 rounded-full"
        >
          <ArrowLeft size={24} color={"black"} />
        </TouchableOpacity>
        <Text className="text-[16px] font-[600] ml-3">My Account</Text>
      </View>

      {/* Profile header */}
      <View className="flex-row items-center mt-4 pb-4 border-b border-gray-200">
        <View className="h-14 w-14 rounded-full bg-gray-200 items-center justify-center">
          <Text className="font-[600] text-[18px] text-gray-700">
            {initials}
          </Text>
        </View>
        <View className="ml-4">
          <Text className="text-[16px] font-[600]">{name}</Text>
          <Text className="text-gray-500 mt-1">{company}</Text>
        </View>
      </View>

      {/* Menu items */}
      <View className="mt-4">
        <Row
          Icon={Heart}
          title="My Orders"
          subtitle="Track and manage your orders"
          onPress={() => navigation?.navigate?.("Orders")}
        />
        <View className="border-b border-gray-200" />

        <Row
          Icon={Bookmark}
          title="Saved Items"
          subtitle="View your wishlist"
          onPress={() => {}}
        />
        <View className="border-b border-gray-200" />

        <Row
          Icon={CreditCard}
          title="Payment Methods"
          subtitle="Manage your payment options"
          onPress={() => {}}
        />
        <View className="border-b border-gray-200" />

        <Row
          Icon={Settings}
          title="Settings"
          subtitle="App preferences and account settings"
          onPress={() => {}}
        />
        <View className="border-b border-gray-200" />

        <Row
          Icon={HelpCircle}
          title="Help & Support"
          subtitle="Contact us, FAQs, and resources"
          onPress={() => {}}
        />
        <View className="border-b border-gray-200" />

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center py-4 px-2"
          onPress={() => {}}
        >
          <View className="h-12 w-12 rounded-full bg-gray-100 items-center justify-center">
            <LogOut size={20} color="#EF4444" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-[#EF4444] font-[600]">Log out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
