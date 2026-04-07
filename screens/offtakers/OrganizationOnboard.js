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
import { AlertCircle, Building2, User, Phone, Globe } from "lucide-react-native";
import api from "../../services/api";

const InputField = ({ label, value, onChangeText, placeholder, keyboardType, autoCapitalize }) => (
  <View className="mb-4">
    <Text className="text-[13px] font-[600] text-gray-700 mb-1.5">{label}</Text>
    <TextInput
      className="bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800"
      placeholder={placeholder ?? label}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType ?? "default"}
      autoCapitalize={autoCapitalize ?? "sentences"}
    />
  </View>
);

const SectionHeader = ({ Icon, label, color }) => (
  <View className="flex-row items-center gap-2 mb-4 mt-2">
    <View
      className="w-8 h-8 rounded-xl items-center justify-center"
      style={{ backgroundColor: color + "22" }}
    >
      <Icon size={16} color={color} />
    </View>
    <Text className="text-[14px] font-[700] text-gray-800">{label}</Text>
  </View>
);

const OrganizationOnboard = ({ navigation }) => {
  // Personal info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Company info
  const [companyName, setCompanyName] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyPosition, setCompanyPosition] = useState("");
  const [companyEmployeeCount, setCompanyEmployeeCount] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  // Company address
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyZipCode, setCompanyZipCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    phoneNumber.trim() &&
    companyName.trim() &&
    companyCountry.trim() &&
    companyPosition.trim() &&
    companyEmployeeCount.trim() &&
    companyWebsite.trim() &&
    companyAddress.trim() &&
    companyState.trim() &&
    companyCity.trim() &&
    companyZipCode.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await api.post("/offtaker/onboarding", {
        firstName,
        lastName,
        phoneNumber,
        companyName,
        companyCountry,
        companyPosition,
        companyEmployeeCount,
        companyWebsite,
        companyAddress,
        companyState,
        companyCity,
        companyZipCode,
      });
      navigation.navigate("CommoditiesOnboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ?? "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      {/* Header */}
      <View className="px-4 pt-2 pb-4 bg-white border-b border-gray-100">
        <Text className="text-[19px] font-[700] text-gray-800">
          Complete Your Profile
        </Text>
        <Text className="text-[13px] text-gray-400 mt-0.5">
          Tell us about yourself and your company
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="px-4 pt-5 pb-10">
            {/* Personal Info section */}
            <View
              className="bg-white rounded-2xl p-4 mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
              }}
            >
              <SectionHeader Icon={User} label="Personal Information" color="#3B82F6" />
              <InputField
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                autoCapitalize="words"
              />
              <InputField
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                autoCapitalize="words"
              />
              <View className="mb-4">
                <Text className="text-[13px] font-[600] text-gray-700 mb-1.5">
                  Phone Number
                </Text>
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-[50px]">
                  <Phone size={15} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-2 text-[13px] text-gray-800"
                    placeholder="+234..."
                    placeholderTextColor="#9CA3AF"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            {/* Company Info section */}
            <View
              className="bg-white rounded-2xl p-4 mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
              }}
            >
              <SectionHeader Icon={Building2} label="Company Information" color="#A7CC48" />
              <InputField
                label="Company Name"
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Acme Ltd."
              />
              <InputField
                label="Company Country"
                value={companyCountry}
                onChangeText={setCompanyCountry}
                placeholder="Nigeria"
              />
              <InputField
                label="Your Position"
                value={companyPosition}
                onChangeText={setCompanyPosition}
                placeholder="Procurement Manager"
              />
              <InputField
                label="Employee Count"
                value={companyEmployeeCount}
                onChangeText={setCompanyEmployeeCount}
                placeholder="e.g. 50-100"
              />
              <View className="mb-2">
                <Text className="text-[13px] font-[600] text-gray-700 mb-1.5">
                  Company Website
                </Text>
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-[50px]">
                  <Globe size={15} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-2 text-[13px] text-gray-800"
                    placeholder="https://yourcompany.com"
                    placeholderTextColor="#9CA3AF"
                    value={companyWebsite}
                    onChangeText={setCompanyWebsite}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>

            {/* Company Address section */}
            <View
              className="bg-white rounded-2xl p-4 mb-5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
              }}
            >
              <SectionHeader Icon={Building2} label="Company Address" color="#8B5CF6" />
              <InputField
                label="Street Address"
                value={companyAddress}
                onChangeText={setCompanyAddress}
                placeholder="123 Business Street"
              />
              <InputField
                label="State"
                value={companyState}
                onChangeText={setCompanyState}
                placeholder="Lagos"
              />
              <InputField
                label="City"
                value={companyCity}
                onChangeText={setCompanyCity}
                placeholder="Ikeja"
              />
              <InputField
                label="ZIP / Postal Code"
                value={companyZipCode}
                onChangeText={setCompanyZipCode}
                placeholder="100001"
                keyboardType="numeric"
              />
            </View>

            {error ? (
              <View className="flex-row items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <AlertCircle size={15} color="#EF4444" style={{ marginTop: 1 }} />
                <Text className="text-[12px] text-red-600 flex-1 leading-4">
                  {error}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              className="rounded-2xl h-[54px] items-center justify-center"
              style={{ backgroundColor: isValid ? "#A7CC48" : "#E5E7EB" }}
              activeOpacity={isValid ? 0.85 : 1}
              onPress={handleSubmit}
              disabled={loading || !isValid}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  className="font-[700] text-[15px]"
                  style={{ color: isValid ? "#fff" : "#9CA3AF" }}
                >
                  Complete Registration
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OrganizationOnboard;
