/** @format */
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStack } from "./Navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { toast, Toast } from "./components/Toast";
import store from "./redux/store";
import { Provider } from "react-redux";
import "./services/i18n"; // initialise i18next before any component renders
import { loadSavedLanguage } from "./services/i18n";

export default function App() {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    loadSavedLanguage().finally(() => setI18nReady(true));
  }, []);

  if (!i18nReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

