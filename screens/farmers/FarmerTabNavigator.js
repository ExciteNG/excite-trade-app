/** @format */
import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Package, ClipboardList, UserCircle } from "lucide-react-native";

import FarmerHome from "./FarmerHome";
import FarmerCommodity from "./FarmerCommodity";
import FarmerUploadCommodity from "./FarmerUploadCommodity";
import FarmerRequests from "./FarmerRequests";
import FarmerRequestHistory from "./FarmerRequestHistory";
import FarmerWallet from "./FarmerWallet";
import FarmerFinancialAid from "./FarmerFinancialAid";
import FarmerSettings from "./FarmerSettings";
import FarmerProfile from "./FarmerProfile";
import NotificationsScreen from "../shared/NotificationsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home — dashboard + nested screens launched from home
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name='FarmerHome' component={FarmerHome} />
    <Stack.Screen
      name='FarmerRequestHistory'
      component={FarmerRequestHistory}
    />
    <Stack.Screen name='Notifications' component={NotificationsScreen} />
  </Stack.Navigator>
);

// Produce — commodity list + upload form
const CommodityStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name='Commodity' component={FarmerCommodity} />
    <Stack.Screen name='Upload' component={FarmerUploadCommodity} />
  </Stack.Navigator>
);

// Requests — pending + in-cultivation requests with upload flow
const RequestsStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name='Requests' component={FarmerRequests} />
    <Stack.Screen name='UploadFromRequest' component={FarmerUploadCommodity} />
  </Stack.Navigator>
);

// Profile — menu hub + all nested account/settings screens
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name='FarmerProfileMenu' component={FarmerProfile} />
    <Stack.Screen name='FarmerWallet' component={FarmerWallet} />
    <Stack.Screen name='FarmerFinancialAid' component={FarmerFinancialAid} />
    <Stack.Screen name='FarmerSettings' component={FarmerSettings} />
  </Stack.Navigator>
);

const TabIcon = ({ Icon, focused }) => {
  const color = focused ? "#A7CC48" : "#9CA3AF";
  return (
    <View className='items-center justify-center'>
      <Icon size={24} color={color} strokeWidth={focused ? 2.3 : 1.8} />
    </View>
  );
};

const FarmerTabNavigator = () => {
  // Read bottom safe-area inset (Android nav bar / iOS home indicator)
  const insets = useSafeAreaInsets();
  const tabBarHeight = 48 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#A7CC48",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#F3F4F6",
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 0,
          paddingBottom: 0,
          elevation: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
        },
        // True vertical centering of the icon within its allocated slot
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 0,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Tab.Screen
        name='HomeStack'
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Home} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name='CommodityStack'
        component={CommodityStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Package} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name='RequestsStack'
        component={RequestsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={ClipboardList} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name='ProfileStack'
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={UserCircle} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default FarmerTabNavigator;
