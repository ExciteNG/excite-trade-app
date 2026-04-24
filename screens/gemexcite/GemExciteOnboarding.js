/** @format */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertCircle, User, Globe, MapPin, Package } from "lucide-react-native";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { toast } from "../../components/Toast";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
}) => (
  <View className='mb-4'>
    <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>{label}</Text>
    <TextInput
      className='bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800'
      placeholder={placeholder ?? label}
      placeholderTextColor='#9CA3AF'
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType ?? "default"}
      autoCapitalize={autoCapitalize ?? "sentences"}
    />
  </View>
);

const SectionHeader = ({ Icon, label, color }) => (
  <View className='flex-row items-center gap-2 mb-4 mt-2'>
    <View
      className='w-8 h-8 rounded-xl items-center justify-center'
      style={{ backgroundColor: color + "22" }}
    >
      <Icon size={16} color={color} />
    </View>
    <Text className='text-[14px] font-[700] text-gray-800'>{label}</Text>
  </View>
);

const GemExciteOnboarding = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [area, setArea] = useState("");
  const [sourcingLocality, setSourcingLocality] = useState("");
  const [commodityType, setCommodityType] = useState("");
  const [agroCommodity, setAgroCommodity] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      const raw = await AsyncStorage.getItem("userInfo");
      const currentUser = raw ? JSON.parse(raw) : null;
      setEmail(currentUser?.email ?? "");
    };
    loadUser();
  }, []);

  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    area.trim() &&
    sourcingLocality.trim() &&
    commodityType.trim() &&
    agroCommodity.trim() &&
    email.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);

    try {
      await api.post("/gem-excite/onboarding", {
        firstName,
        lastName,
        email,
        area,
        sourcingLocality,
        commodityType,
        agroCommodity,
      });

      const rawUser = await AsyncStorage.getItem("userInfo");
      const currentUser = rawUser ? JSON.parse(rawUser) : null;
      const updatedUser = currentUser
        ? {
            ...currentUser,
            status: "Active",
            profile: {
              ...currentUser.profile,
              firstName,
              lastName,
              area,
              sourcingLocality,
              commodityType,
              agroCommodity,
            },
          }
        : currentUser;

      if (updatedUser) {
        await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUser));
        dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
      }

      toast.show({
        title: "Success",
        status: "success",
        message: "GEM Excite onboarding completed.",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ?? "Onboarding failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor='white' barStyle='dark-content' />
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <Text className='text-[19px] font-[700] text-gray-800'>
          GEM Excite Onboarding
        </Text>
        <Text className='text-[13px] text-gray-400 mt-0.5'>
          Share your sourcing details and commodity focus.
        </Text>
      </View>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <View className='px-4 pt-5 pb-10'>
            <View
              className='bg-white rounded-2xl p-4 mb-4'
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
              }}
            >
              <SectionHeader
                Icon={User}
                label='Your Identity'
                color='#3B82F6'
              />
              <InputField
                label='First Name'
                value={firstName}
                onChangeText={setFirstName}
                placeholder='John'
                autoCapitalize='words'
              />
              <InputField
                label='Last Name'
                value={lastName}
                onChangeText={setLastName}
                placeholder='Doe'
                autoCapitalize='words'
              />
              <InputField
                label='Email'
                value={email}
                onChangeText={setEmail}
                placeholder='you@example.com'
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>
            <View
              className='bg-white rounded-2xl p-4 mb-5'
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
              }}
            >
              <SectionHeader
                Icon={MapPin}
                label='Operating Area'
                color='#A7CC48'
              />
              <InputField
                label='Area'
                value={area}
                onChangeText={setArea}
                placeholder='Western Region'
              />
              <InputField
                label='Sourcing Locality'
                value={sourcingLocality}
                onChangeText={setSourcingLocality}
                placeholder='State or neighbourhood'
              />
              <InputField
                label='Commodity Type'
                value={commodityType}
                onChangeText={setCommodityType}
                placeholder='Agricultural/Processed'
              />
              <InputField
                label='Agro Commodity'
                value={agroCommodity}
                onChangeText={setAgroCommodity}
                placeholder='Cocoa, Maize, Rice'
              />
            </View>
            {error ? (
              <View className='flex-row items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4'>
                <AlertCircle
                  size={15}
                  color='#EF4444'
                  style={{ marginTop: 1 }}
                />
                <Text className='text-[12px] text-red-600 flex-1 leading-4'>
                  {error}
                </Text>
              </View>
            ) : null}
            <TouchableOpacity
              className='rounded-2xl h-[54px] items-center justify-center'
              style={{ backgroundColor: isValid ? "#A7CC48" : "#E5E7EB" }}
              activeOpacity={isValid ? 0.85 : 1}
              onPress={handleSubmit}
              disabled={loading || !isValid}
            >
              {loading ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Text
                  className='font-[700] text-[15px]'
                  style={{ color: isValid ? "#fff" : "#9CA3AF" }}
                >
                  Complete GEM Excite Onboarding
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GemExciteOnboarding;
