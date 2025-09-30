/** @format */

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SignedInStack, SignedOutStack } from "./Navigation";

export default function App() {
  return (
    <NavigationContainer>
      {/* <Toast
        ref={(ref) => {
          toast.ref = ref;
        }}
      /> */}
      <SignedInStack />
    </NavigationContainer>
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
