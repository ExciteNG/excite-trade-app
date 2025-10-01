/** @format */
import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Platform,
  Dimensions,
  View,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  ChartPie,
  Layers,
  ShoppingBag,
  TextSearch,
  User,
} from "lucide-react-native";
import Home from "./Home";
import Explore from "./Explore";
import Profile from "./Profile";
import Orders from "./Orders";

export const { height, width } = Dimensions.get("window");
export const { height: screenHeight, width: screenWidth } =
  Dimensions.get("screen");

const TabsScreen = () => {
  const Tab = createBottomTabNavigator();
  const hasHomeIndicator = height >= 810; // Assuming iPhone X and later have a home indicator

  const androidTabBarStyle = {
    height: 55,
    paddingTop: 0,
    shadowColor: "black",
    borderColor: "whitesmoke",
    // marginBottom: -5,
  };

  const androidTabBarStyleBrands = {
    height: 60,
    paddingTop: 10,
    shadowColor: "black",
    borderColor: "whitesmoke",
  };

  const iosTabBarStyle = {
    marginBottom: hasHomeIndicator ? -35 : 0, // Adjust marginBottom based on home indicator
    paddingTop: 4,
    shadowColor: "white",
    borderColor: "whitesmoke",
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: Platform.select({
          android: androidTabBarStyle,
          ios: iosTabBarStyle,
        }),
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconComponent;
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
            iconComponent = <Entypo name={iconName} size={22} color={color} />;
          } else if (route.name === "Explore") {
            iconComponent = focused ? (
              <TextSearch size={20} color={color} />
            ) : (
              <TextSearch size={20} color={color} />
            );
          } else if (route.name === "Orders") {
            iconComponent = focused ? (
              <ShoppingBag size={20} color={color} />
            ) : (
              <ShoppingBag size={20} color={color} />
            );
          } else if (route.name === "Profile") {
            iconComponent = focused ? (
              <User size={20} color={color} />
            ) : (
              <User size={20} color={color} />
            );
          }
          return iconComponent;
        },
        tabBarActiveTintColor: "#A7CC48",
        tabBarInactiveTintColor: "gray",
        animation: "fade",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Orders" component={Orders} />

      {/* Center Action Button with Modal */}
      {/* <Tab.Screen
        name="CreateAction"
        component={EmptyComponent} // Dummy component
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ size }) => <LayoutGrid size={25} color={"#fff"} />,
          tabBarButton: (props) => (
            <CustomTabBarButton onPress={toggleModal}>
              <LayoutGrid size={23} color={"#fff"} />
            </CustomTabBarButton>
          ),
        }}
      /> */}

      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabsScreen;
