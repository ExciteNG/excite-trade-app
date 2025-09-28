/** @format */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboard from "./screens/Onboard";

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

export { SignedOutStack };
