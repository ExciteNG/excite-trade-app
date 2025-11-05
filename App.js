/** @format */
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AuthStack, SignedInStack, SignedOutStack } from "./Navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { toast, Toast } from "./components/Toast";
import store from "./redux/store";
import { Provider } from "react-redux";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <Toast
            ref={(ref) => {
              toast.ref = ref;
            }}
          />
          <AuthStack />
        </NavigationContainer>
      </Provider>
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
