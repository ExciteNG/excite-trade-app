/** @format */
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "../locales/en";
import es from "../locales/es";
import fr from "../locales/fr";
import ar from "../locales/ar";
import pt from "../locales/pt";
import de from "../locales/de";
import yo from "../locales/yo";
import ig from "../locales/ig";
import ha from "../locales/ha";

export const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇧🇷" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
  { code: "yo", label: "Yoruba", nativeLabel: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", label: "Igbo", nativeLabel: "Igbo", flag: "🇳🇬" },
  { code: "ha", label: "Hausa", nativeLabel: "Hausa", flag: "🇳🇬" },
];

export const LANGUAGE_STORAGE_KEY = "app_language";

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    ar: { translation: ar },
    pt: { translation: pt },
    de: { translation: de },
    yo: { translation: yo },
    ig: { translation: ig },
    ha: { translation: ha },
  },
  interpolation: { escapeValue: false },
});

/** Load the saved language and apply it. Call once on app startup. */
export async function loadSavedLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved) {
      await i18next.changeLanguage(saved);
    }
  } catch {
    // Fall back to default English
  }
}

/**
 * Change language, persist locally, and optionally save to backend.
 * Returns { saved: true } on full success, or { saved: false, error } if
 * the backend call fails (language is still applied locally in that case).
 */
export async function changeLanguage(code, apiInstance = null) {
  await i18next.changeLanguage(code);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  if (apiInstance) {
    await apiInstance.put("/user/language", { language: code });
  }
  return { saved: true };
}

export default i18next;
