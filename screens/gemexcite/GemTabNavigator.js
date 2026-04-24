/** @format */
import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, User, Inbox, UserCircle } from "lucide-react-native";

import GemHome from "./GemHome";
import GemManageCluster from "./GemManageCluster";
import GemFarmerDetail from "./GemFarmerDetail";
import GemNewRequest from "./GemNewRequest";
import GemAssignedRequests from "./GemAssignedRequests";
import GemDepository from "./GemDepository";
import GemQualityControl from "./GemQualityControl";
import GemSettings from "./GemSettings";
import GemProfile from "./GemProfile";
import NotificationsScreen from "../shared/NotificationsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home — dashboard + quality control (launched from home quick action)
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name='GemHome' component={GemHome} />
    <Stack.Screen name='GemQualityControl' component={GemQualityControl} />
    <Stack.Screen name='Notifications' component={NotificationsScreen} />
  </Stack.Navigator>
);

// Cluster — farmer list + farmer detail
const ClusterStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name='Cluster' component={GemManageCluster} />
    <Stack.Screen name='GemFarmerDetail' component={GemFarmerDetail} />
  </Stack.Navigator>
);

// Requests — new order assignment + assigned farmer tracking + quality check
const RequestsStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name='Requests' component={GemNewRequest} />
    <Stack.Screen name='GemAssignedRequests' component={GemAssignedRequests} />
    <Stack.Screen name='GemQualityControl' component={GemQualityControl} />
  </Stack.Navigator>
);

// Profile — menu hub + storage, settings, quality control (all nested)
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name='GemProfileMenu' component={GemProfile} />
    <Stack.Screen name='Depository' component={GemDepository} />
    <Stack.Screen name='GemQualityControl' component={GemQualityControl} />
    <Stack.Screen name='GemSettings' component={GemSettings} />
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

const GemTabNavigator = () => {
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
        name='ClusterStack'
        component={ClusterStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={User} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name='RequestsStack'
        component={RequestsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Inbox} focused={focused} />
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

export default GemTabNavigator;
