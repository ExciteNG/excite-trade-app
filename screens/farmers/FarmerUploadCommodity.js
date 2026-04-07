/** @format */
import React, { useState } from "react";
import api from "../../services/api";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  ChevronDown,
  CheckCircle,
  ArrowUpCircle,
  X,
} from "lucide-react-native";

const COMMODITY_TYPES = [
  "Cassava",
  "Cocoa",
  "Groundnut",
  "Maize",
  "Soybeans",
  "Palm Oil",
  "Yam",
  "Rice",
  "Sorghum",
  "Millet",
  "Tin Ore",
  "Iron Ore",
  "Limestone",
  "Columbite",
];

const FarmerUploadCommodity = ({ navigation, route }) => {
  const userRequestId = route?.params?.userRequestId ?? null;
  const [commodity, setCommodity] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!commodity || !price || !weight) return;
    setLoading(true);
    try {
      const body = {
        commodity,
        pricePerTonne: parseFloat(price),
        quantity: parseFloat(weight),
        ...(userRequestId ? { userRequestId } : {}),
      };
      await api.post("/farmer/upload-commodity", body);
      setSuccess(true);
    } catch (err) {
      alert(
        err?.response?.data?.message ?? "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isValid = commodity && price && weight;

  if (success) {
    return (
      <SafeAreaView
        edges={["top"]}
        className='flex-1 bg-white items-center justify-center px-8'
      >
        <View className='w-20 h-20 rounded-full bg-[#F0FDF4] items-center justify-center mb-5'>
          <CheckCircle size={40} color='#22C55E' />
        </View>
        <Text className='text-[20px] font-[700] text-gray-800 text-center'>
          Upload Successful!
        </Text>
        <Text className='text-[13px] text-gray-400 text-center mt-2 leading-5'>
          Your commodity has been submitted for review. You'll be notified once
          a quality check is scheduled.
        </Text>
        <TouchableOpacity
          className='bg-[#A7CC48] rounded-2xl px-8 py-4 mt-8 w-full items-center'
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text className='font-[700] text-[14px] text-white'>Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      {/* Header */}
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <Text className='text-[19px] font-[700] text-gray-800'>
          Upload Commodity
        </Text>
        <Text className='text-[13px] text-gray-400 mt-0.5'>
          Submit your produce for quality review
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <View className='px-4 pt-5 pb-10'>
          {/* Commodity Type */}
          <View className='mb-4'>
            <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
              Commodity Type
            </Text>
            <TouchableOpacity
              className='flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-[50px]'
              activeOpacity={0.8}
              onPress={() => setPickerVisible(true)}
            >
              <Text
                className={`text-[13px] ${commodity ? "text-gray-800 font-[500]" : "text-gray-400"}`}
              >
                {commodity || "Select a commodity"}
              </Text>
              <ChevronDown size={16} color='#9CA3AF' />
            </TouchableOpacity>
          </View>

          {/* Price per Tonne */}
          <View className='mb-4'>
            <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
              Price per Tonne (₦)
            </Text>
            <TextInput
              className='bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800'
              placeholder='e.g. 45000'
              placeholderTextColor='#9CA3AF'
              keyboardType='numeric'
              value={price}
              onChangeText={setPrice}
            />
          </View>

          {/* Weight */}
          <View className='mb-4'>
            <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
              Weight (Tonnes)
            </Text>
            <TextInput
              className='bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800'
              placeholder='e.g. 120'
              placeholderTextColor='#9CA3AF'
              keyboardType='numeric'
              value={weight}
              onChangeText={setWeight}
            />
          </View>

          {/* Image Upload */}
          <View className='mb-6'>
            <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
              Commodity Image
            </Text>
            <TouchableOpacity
              className='bg-white border-2 border-dashed rounded-2xl items-center justify-center py-8'
              style={{ borderColor: hasImage ? "#A7CC48" : "#D1D5DB" }}
              activeOpacity={0.8}
              onPress={() => setHasImage(true)}
            >
              {hasImage ? (
                <>
                  <CheckCircle size={28} color='#A7CC48' />
                  <Text className='text-[13px] font-[600] text-[#A7CC48] mt-2'>
                    Image Selected
                  </Text>
                  <Text className='text-[11px] text-gray-400 mt-1'>
                    Tap to change
                  </Text>
                </>
              ) : (
                <>
                  <Camera size={28} color='#9CA3AF' />
                  <Text className='text-[13px] font-[600] text-gray-500 mt-2'>
                    Tap to add photo
                  </Text>
                  <Text className='text-[11px] text-gray-400 mt-1'>
                    JPG, PNG up to 10MB
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Summary card (filled) */}
          {isValid && (
            <View className='bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 mb-6'>
              <Text className='text-[12px] font-[700] text-green-700 uppercase tracking-wide mb-2'>
                Summary
              </Text>
              <View className='flex-row justify-between mb-1'>
                <Text className='text-[12px] text-gray-500'>Commodity</Text>
                <Text className='text-[12px] font-[600] text-gray-800'>
                  {commodity}
                </Text>
              </View>
              <View className='flex-row justify-between mb-1'>
                <Text className='text-[12px] text-gray-500'>Price / Tonne</Text>
                <Text className='text-[12px] font-[600] text-gray-800'>
                  ₦{price}
                </Text>
              </View>
              <View className='flex-row justify-between'>
                <Text className='text-[12px] text-gray-500'>Total Weight</Text>
                <Text className='text-[12px] font-[600] text-gray-800'>
                  {weight} tonnes
                </Text>
              </View>
            </View>
          )}

          {/* Submit button */}
          <TouchableOpacity
            className='rounded-2xl h-[52px] items-center justify-center'
            style={{ backgroundColor: isValid ? "#A7CC48" : "#E5E7EB" }}
            activeOpacity={isValid ? 0.85 : 1}
            onPress={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading ? (
              <View className='flex-row items-center gap-2'>
                <ArrowUpCircle size={18} color='#fff' />
                <Text className='font-[700] text-[14px] text-white'>
                  Uploading...
                </Text>
              </View>
            ) : (
              <Text
                className='font-[700] text-[14px]'
                style={{ color: isValid ? "#fff" : "#9CA3AF" }}
              >
                Upload Commodity
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Commodity Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType='slide'>
        <View
          className='flex-1 justify-end'
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View className='bg-white rounded-t-3xl px-4 pt-4 pb-8'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-[17px] font-[700] text-gray-800'>
                Select Commodity
              </Text>
              <TouchableOpacity
                onPress={() => setPickerVisible(false)}
                activeOpacity={0.7}
              >
                <X size={20} color='#6B7280' />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COMMODITY_TYPES}
              keyExtractor={(item) => item}
              style={{ maxHeight: 320 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className='flex-row items-center justify-between py-4 border-b border-gray-50'
                  activeOpacity={0.7}
                  onPress={() => {
                    setCommodity(item);
                    setPickerVisible(false);
                  }}
                >
                  <Text className='text-[14px] text-gray-700 font-[500]'>
                    {item}
                  </Text>
                  {commodity === item && (
                    <CheckCircle size={16} color='#A7CC48' />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FarmerUploadCommodity;
