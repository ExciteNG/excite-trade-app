/** @format */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboard from "./screens/Onboard";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import TabsScreen from "./screens/TabsScreen";
import Explore from "./screens/Explore";
import Orders from "./screens/Orders";
import ProductDetails from "./screens/ProductDetails";
import { useState } from "react";
import SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import VerifyEmail from "./screens/VerifyEmail";
import { useSelector } from "react-redux";
import OrganizationOnboard from "./screens/offtakers/OrganizationOnboard";
import CommoditiesOnboard from "./screens/offtakers/CommoditiesOnboard";

const SignedOutStack = () => {
  //   NavigationBar.setBackgroundColorAsync("white");
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Onboard" component={Onboard} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      {/* <Stack.Screen name="OpenHome" component={OpenHome} />
      <Stack.Screen name="PollDetails" component={PollDetails} /> */}
      {/* <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="VerifyResetOtp" component={VerifyResetOtp} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} /> */}
    </Stack.Navigator>
  );
};

const SignedInStack = () => {
  const [user, setUser] = useState(null);

  const getUserInfo = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    // console.log(userInfo);
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [user]);

  return (
    <>
      {user?.status === "Pending" ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="OrganizationOnboard"
            component={OrganizationOnboard}
          />
          <Stack.Screen
            name="CommoditiesOnboard"
            component={CommoditiesOnboard}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="TabsScreen" component={TabsScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Explore" component={Explore} />
          <Stack.Screen name="Orders" component={Orders} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
        </Stack.Navigator>
      )}
    </>
  );
};

const AuthStack = () => {
  const { userInfo } = useSelector((state) => state.loginReducer);
  const [user, setUser] = useState(null);

  SplashScreen?.preventAutoHideAsync();

  const getUserInfo = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    // console.log(userInfo);
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(null);
    }
    setTimeout(() => {
      SplashScreen?.hideAsync();
    }, 1000);
  };

  useEffect(() => {
    getUserInfo();
  }, [user, userInfo]);

  return <>{user ? <SignedInStack /> : <SignedOutStack />}</>;
};

export { SignedOutStack, SignedInStack, AuthStack };
