/** @format */
import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Search, ShoppingBag, UserCircle } from "lucide-react-native";

import OfftakerHome from "./OfftakerHome";
import OfftakerExplore from "./OfftakerExplore";
import OfftakerClusterDetail from "./OfftakerClusterDetail";
import OfftakerCheckout from "./OfftakerCheckout";
import OfftakerOrders from "./OfftakerOrders";
import OfftakerOrderDetail from "./OfftakerOrderDetail";
import OfftakerProfile from "./OfftakerProfile";
import OfftakerSettings from "./OfftakerSettings";
import NotificationsScreen from "../shared/NotificationsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <Stack.Screen name="OfftakerHome" component={OfftakerHome} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <Stack.Screen name="Explore" component={OfftakerExplore} />
    <Stack.Screen name="ClusterDetail" component={OfftakerClusterDetail} />
    <Stack.Screen name="Checkout" component={OfftakerCheckout} />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <Stack.Screen name="Orders" component={OfftakerOrders} />
    <Stack.Screen name="OrderDetail" component={OfftakerOrderDetail} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <Stack.Screen name="OfftakerProfileMenu" component={OfftakerProfile} />
    <Stack.Screen name="OfftakerSettings" component={OfftakerSettings} />
  </Stack.Navigator>
);

const TabIcon = ({ Icon, focused }) => {
  const color = focused ? "#A7CC48" : "#9CA3AF";
  return (
    <View className="items-center justify-center">
      <Icon size={24} color={color} strokeWidth={focused ? 2.3 : 1.8} />
    </View>
  );
};

const OfftakerTabNavigator = () => {
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
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 0,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} /> }}
      />
      <Tab.Screen
        name="ExploreStack"
        component={ExploreStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Search} focused={focused} /> }}
      />
      <Tab.Screen
        name="OrdersStack"
        component={OrdersStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={ShoppingBag} focused={focused} /> }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={UserCircle} focused={focused} /> }}
      />
    </Tab.Navigator>
  );
};

export default OfftakerTabNavigator;
