/** @format */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "expo-splash-screen";
import { useSelector } from "react-redux";

// Auth screens
import Onboard from "./screens/Onboard";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import VerifyEmail from "./screens/VerifyEmail";

// Offtaker onboarding
import OrganizationOnboard from "./screens/offtakers/OrganizationOnboard";
import CommoditiesOnboard from "./screens/offtakers/CommoditiesOnboard";

// Role tab navigators
import FarmerTabNavigator from "./screens/farmers/FarmerTabNavigator";
import GemTabNavigator from "./screens/gemexcite/GemTabNavigator";
import OfftakerTabNavigator from "./screens/offtakers/OfftakerTabNavigator";

const Stack = createNativeStackNavigator();

// ─── Signed-Out Stack ────────────────────────────────────────────────────────
const SignedOutStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name="Onboard" component={Onboard} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
  </Stack.Navigator>
);

// ─── Farmer Signed-In Stack ─────────────────────────────────────────────────
const FarmerSignedInStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name="FarmerTabs" component={FarmerTabNavigator} />
  </Stack.Navigator>
);

// ─── GemExcite Signed-In Stack ───────────────────────────────────────────────
const GemExciteSignedInStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name="GemTabs" component={GemTabNavigator} />
  </Stack.Navigator>
);

// ─── Offtaker / Default Signed-In Stack ─────────────────────────────────────
const DefaultSignedInStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name="OfftakerTabs" component={OfftakerTabNavigator} />
  </Stack.Navigator>
);

// ─── Onboarding Stack (Pending users) ────────────────────────────────────────
const OnboardingStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name="OrganizationOnboard" component={OrganizationOnboard} />
    <Stack.Screen name="CommoditiesOnboard" component={CommoditiesOnboard} />
  </Stack.Navigator>
);

// ─── Signed-In Stack — routes based on userType ─────────────────────────────
const SignedInStack = () => {
  const [user, setUser] = useState(null);

  const getUserInfo = async () => {
    const raw = await AsyncStorage.getItem("userInfo");
    setUser(raw ? JSON.parse(raw) : null);
  };

  useEffect(() => {
    getUserInfo();
  }, [user]);

  // Pending status — show onboarding regardless of role
  if (user?.status === "Pending") {
    return <OnboardingStack />;
  }

  // Active — route by userType
  const userType = user?.userType ?? user?.data?.userType;

  if (userType === "Farmer" || userType === "Miner") {
    return <FarmerSignedInStack />;
  }

  if (userType === "GemExcite") {
    return <GemExciteSignedInStack />;
  }

  // Offtaker, Admin, GemAdmin, StoreKeeper, or unknown — default stack
  return <DefaultSignedInStack />;
};

// ─── Auth Stack — root navigator ─────────────────────────────────────────────
const AuthStack = () => {
  const { userInfo } = useSelector((state) => state.loginReducer);
  const [user, setUser] = useState(null);

  SplashScreen?.preventAutoHideAsync();

  const getUserInfo = async () => {
    const raw = await AsyncStorage.getItem("userInfo");
    setUser(raw ? JSON.parse(raw) : null);
    setTimeout(() => {
      SplashScreen?.hideAsync();
    }, 1000);
  };

  useEffect(() => {
    getUserInfo();
  }, [user, userInfo]);

  return user ? <SignedInStack /> : <SignedOutStack />;
};

export { SignedOutStack, SignedInStack, AuthStack };
