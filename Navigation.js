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
  //   NavigationBar.setBackgroundColorAsync("white");
  return (
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
    </Stack.Navigator>
  );
};

export { SignedOutStack, SignedInStack };
