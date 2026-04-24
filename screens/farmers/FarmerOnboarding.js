/** @format */

import React, { useState } from "react";
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
import {
  AlertCircle,
  User,
  MapPin,
  Globe,
  Package,
  Layers,
  Sprout,
} from "lucide-react-native";
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

const FarmerOnboarding = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [farmCountry, setFarmCountry] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmArea, setFarmArea] = useState("");
  const [commodityName, setCommodityName] = useState("");
  const [commodityProductionCapacity, setCommodityProductionCapacity] =
    useState("");
  const [clusterCode, setClusterCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    farmName.trim() &&
    farmCountry.trim() &&
    farmLocation.trim() &&
    farmArea.trim() &&
    commodityName.trim() &&
    commodityProductionCapacity.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/farmer/onboarding", {
        firstName,
        lastName,
        farmName,
        clusterCode: clusterCode.trim() || undefined,
        farmLocation,
        farmArea,
        commodityName,
        farmCountry,
        commodityProductionCapacity: Number(commodityProductionCapacity),
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
              farmName,
              clusterCode: clusterCode.trim() || null,
              farmLocation,
              farmArea,
              commodityName,
              farmCountry,
              commodityProductionCapacity: Number(commodityProductionCapacity),
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
        message: "Farmer onboarding completed.",
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
          Farmer Onboarding
        </Text>
        <Text className='text-[13px] text-gray-400 mt-0.5'>
          Tell us more about your farm and production.
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
              <SectionHeader Icon={User} label='Your Details' color='#3B82F6' />
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
                label='Farm Name'
                value={farmName}
                onChangeText={setFarmName}
                placeholder='Green Acres Farm'
              />
            </View>

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
                Icon={Sprout}
                label='Farm Location'
                color='#A7CC48'
              />
              <InputField
                label='Country'
                value={farmCountry}
                onChangeText={setFarmCountry}
                placeholder='Nigeria'
              />
              <InputField
                label='Location'
                value={farmLocation}
                onChangeText={setFarmLocation}
                placeholder='Ikeja, Lagos'
              />
              <InputField
                label='Farm Area'
                value={farmArea}
                onChangeText={setFarmArea}
                placeholder='2 hectares'
              />
              <InputField
                label='Commodity Produced'
                value={commodityName}
                onChangeText={setCommodityName}
                placeholder='Cassava, Cocoa'
              />
              <View className='mb-4'>
                <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
                  Production Capacity
                </Text>
                <TextInput
                  className='bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800'
                  placeholder='e.g. 1000'
                  placeholderTextColor='#9CA3AF'
                  value={commodityProductionCapacity}
                  onChangeText={(text) =>
                    setCommodityProductionCapacity(text.replace(/[^0-9]/g, ""))
                  }
                  keyboardType='numeric'
                />
              </View>
              <InputField
                label='Cluster Code (optional)'
                value={clusterCode}
                onChangeText={setClusterCode}
                placeholder='Cluster code'
                autoCapitalize='characters'
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
                  Complete Farmer Onboarding
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FarmerOnboarding;
