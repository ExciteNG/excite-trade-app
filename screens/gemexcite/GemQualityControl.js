/** @format */
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckCircle, ClipboardCheck, DollarSign } from "lucide-react-native";
import api from "../../services/api";

const QUALITY_MEASURES = [
  { id: "1", measure: "Moisture Content", range: "< 14%", category: "Physical" },
  { id: "2", measure: "Foreign Matter", range: "< 1%", category: "Physical" },
  { id: "3", measure: "Broken Grains", range: "< 5%", category: "Physical" },
  { id: "4", measure: "Aflatoxin Level", range: "< 10 ppb", category: "Chemical" },
  { id: "5", measure: "Mould Count", range: "< 50,000 cfu/g", category: "Chemical" },
  { id: "6", measure: "Colour Uniformity", range: "≥ 90%", category: "Visual" },
  { id: "7", measure: "Aroma / Odour", range: "Natural scent", category: "Sensory" },
  { id: "8", measure: "Grain Size", range: "Grade A standard", category: "Physical" },
];

const CATEGORY_COLORS = {
  Physical: { bg: "#EFF6FF", text: "#3B82F6" },
  Chemical: { bg: "#FFF7ED", text: "#F97316" },
  Visual: { bg: "#F0FDF4", text: "#16A34A" },
  Sensory: { bg: "#F5F3FF", text: "#8B5CF6" },
};

const GemQualityControl = ({ navigation, route }) => {
  const uploadedCommodityId = route?.params?.uploadedCommodityId ?? null;
  const [approved, setApproved] = useState({});
  const [priceModal, setPriceModal] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState("150000");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleApproval = (id) => {
    setApproved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const approvedCount = Object.values(approved).filter(Boolean).length;
  const allApproved = approvedCount === QUALITY_MEASURES.length;

  const handleSubmit = async () => {
    if (!uploadedCommodityId) {
      setPriceModal(false);
      setSubmitted(true);
      return;
    }
    setSubmitting(true);
    try {
      const result = allApproved
        ? "passed-quality-check"
        : "failed-quality-check";
      const body = { result };
      const parsed = parseFloat(negotiatedPrice);
      if (!isNaN(parsed) && parsed > 0) body.negotiatedPrice = parsed;
      await api.post(
        `/gem-excite/quality-check/${uploadedCommodityId}`,
        body
      );
      setPriceModal(false);
      setSubmitted(true);
    } catch (err) {
      alert(
        err?.response?.data?.message ?? "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white items-center justify-center px-8">
        <StatusBar backgroundColor={"white"} barStyle="dark-content" />
        <View className="w-20 h-20 rounded-full bg-[#F0FDF4] items-center justify-center mb-5">
          <CheckCircle size={40} color="#22C55E" />
        </View>
        <Text className="text-[20px] font-[700] text-gray-800 text-center">Quality Check Complete!</Text>
        <Text className="text-[13px] text-gray-400 text-center mt-2 leading-5">
          {approvedCount}/{QUALITY_MEASURES.length} measures approved. Price negotiation has been submitted for review.
        </Text>
        <TouchableOpacity
          className="bg-[#A7CC48] rounded-2xl px-8 py-4 mt-8 w-full items-center"
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text className="font-[700] text-[14px] text-white">Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      {/* Header */}
      <View className="px-4 pt-2 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={18} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-[19px] font-[700] text-gray-800">Quality Control</Text>
            <Text className="text-[13px] text-gray-400 mt-0.5">
              {approvedCount}/{QUALITY_MEASURES.length} measures approved
            </Text>
          </View>
          {/* Progress indicator */}
          <View className="items-center">
            <Text className="text-[18px] font-[800] text-[#A7CC48]">
              {Math.round((approvedCount / QUALITY_MEASURES.length) * 100)}%
            </Text>
          </View>
        </View>
        {/* Progress bar */}
        <View className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
          <View
            className="h-full bg-[#A7CC48] rounded-full"
            style={{ width: `${(approvedCount / QUALITY_MEASURES.length) * 100}%` }}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Legend */}
        <View className="flex-row flex-wrap px-4 pt-4 pb-2 gap-2">
          {Object.entries(CATEGORY_COLORS).map(([cat, style]) => (
            <View key={cat} className="flex-row items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: style.bg }}>
              <Text className="text-[11px] font-[600]" style={{ color: style.text }}>{cat}</Text>
            </View>
          ))}
        </View>

        {/* Measures */}
        <View className="px-4 pt-2 pb-4">
          {QUALITY_MEASURES.map((item) => {
            const isApproved = !!approved[item.id];
            const catStyle = CATEGORY_COLORS[item.category];
            return (
              <View
                key={item.id}
                className="bg-white border rounded-2xl p-4 mb-3"
                style={{
                  borderColor: isApproved ? "#BBF7D0" : "#F3F4F6",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 3,
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1 pr-3">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-[14px] font-[700] text-gray-800">{item.measure}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: catStyle.bg }}>
                        <Text className="text-[10px] font-[600]" style={{ color: catStyle.text }}>
                          {item.category}
                        </Text>
                      </View>
                      <Text className="text-[12px] text-gray-500">Range: {item.range}</Text>
                    </View>
                  </View>

                  {/* Approve toggle */}
                  <TouchableOpacity
                    className="w-10 h-10 rounded-full border-2 items-center justify-center"
                    style={{
                      borderColor: isApproved ? "#A7CC48" : "#D1D5DB",
                      backgroundColor: isApproved ? "#A7CC48" : "transparent",
                    }}
                    activeOpacity={0.8}
                    onPress={() => toggleApproval(item.id)}
                  >
                    {isApproved && <CheckCircle size={18} color="#fff" />}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Submit */}
        <View className="px-4 mb-10">
          <TouchableOpacity
            className="rounded-2xl h-[52px] items-center justify-center flex-row gap-2"
            style={{ backgroundColor: approvedCount > 0 ? "#A7CC48" : "#E5E7EB" }}
            activeOpacity={approvedCount > 0 ? 0.85 : 1}
            onPress={() => approvedCount > 0 && setPriceModal(true)}
          >
            <ClipboardCheck size={18} color={approvedCount > 0 ? "#fff" : "#9CA3AF"} />
            <Text className="font-[700] text-[14px]" style={{ color: approvedCount > 0 ? "#fff" : "#9CA3AF" }}>
              Submit Check ({approvedCount}/{QUALITY_MEASURES.length})
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Price Negotiation Modal */}
      <Modal visible={priceModal} transparent animationType="fade">
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <View className="bg-white rounded-3xl p-6 w-full">
            <View className="items-center mb-5">
              <View className="w-14 h-14 rounded-full bg-amber-50 items-center justify-center mb-3">
                <DollarSign size={26} color="#F59E0B" />
              </View>
              <Text className="text-[17px] font-[700] text-gray-800">Negotiate Price?</Text>
              <Text className="text-[13px] text-gray-400 text-center mt-1.5 leading-5">
                Review and adjust the price per tonne before confirming the quality check.
              </Text>
            </View>

            <View className="mb-5">
              <Text className="text-[12px] font-[600] text-gray-500 mb-1.5">Uploaded Price / Tonne (₦)</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 h-[50px]">
                <Text className="text-[15px] font-[700] text-gray-400 mr-2">₦</Text>
                <TextInput
                  className="flex-1 text-[15px] font-[600] text-gray-800"
                  keyboardType="numeric"
                  value={negotiatedPrice}
                  onChangeText={setNegotiatedPrice}
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-gray-200 rounded-2xl py-4 items-center"
                activeOpacity={0.7}
                onPress={() => setPriceModal(false)}
              >
                <Text className="text-[13px] font-[600] text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#A7CC48] rounded-2xl py-4 items-center"
                activeOpacity={submitting ? 1 : 0.85}
                onPress={submitting ? undefined : handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-[13px] font-[700] text-white">Check Complete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GemQualityControl;
