/** @format */
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AuthStack, SignedInStack, SignedOutStack } from "./Navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { toast, Toast } from "./components/Toast";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Toast
          ref={(ref) => {
            toast.ref = ref;
          }}
        />
        <AuthStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
