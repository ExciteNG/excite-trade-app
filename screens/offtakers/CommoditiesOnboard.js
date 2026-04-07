/** @format */
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { CheckCircle, Package, DollarSign, Scale } from "lucide-react-native";

const PRODUCTS = [
  "Cassava",
  "Cocoa",
  "Groundnut",
  "Maize",
  "Soybeans",
  "Palm Oil",
  "Yam",
  "Rice",
  "Tin Ore",
  "Iron Ore",
  "Columbite",
];

const CURRENCIES = ["NGN", "USD", "GBP", "EUR"];

const UNITS = ["tonnes", "kg", "lbs"];

const OptionPill = ({ label, selected, onPress }) => (
  <TouchableOpacity
    className="px-3 py-2 rounded-full border mr-2 mb-2"
    style={{
      backgroundColor: selected ? "#A7CC48" : "#fff",
      borderColor: selected ? "#A7CC48" : "#E5E7EB",
    }}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <Text
      className="text-[12px] font-[600]"
      style={{ color: selected ? "#fff" : "#6B7280" }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const SectionCard = ({ Icon, title, color, children }) => (
  <View
    className="bg-white rounded-2xl p-4 mb-4"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
    }}
  >
    <View className="flex-row items-center gap-2 mb-4">
      <View
        className="w-8 h-8 rounded-xl items-center justify-center"
        style={{ backgroundColor: color + "22" }}
      >
        <Icon size={16} color={color} />
      </View>
      <Text className="text-[14px] font-[700] text-gray-800">{title}</Text>
    </View>
    {children}
  </View>
);

const CommoditiesOnboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currency, setCurrency] = useState("NGN");
  const [unit, setUnit] = useState("tonnes");

  const toggleProduct = (product) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  const handleFinish = async () => {
    try {
      const raw = await AsyncStorage.getItem("userInfo");
      if (raw) {
        const userInfo = JSON.parse(raw);
        const updated = {
          ...userInfo,
          status: "Active",
          profile: {
            ...userInfo.profile,
            preferredProducts: selectedProducts,
            preferredCurrency: currency,
            preferredUnitsOfMeasurement: unit,
          },
        };
        await AsyncStorage.setItem("userInfo", JSON.stringify(updated));
        dispatch({ type: "LOGIN_SUCCESS", payload: updated });
      }
    } catch {
      // Silently ignore storage errors
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      {/* Header */}
      <View className="px-4 pt-2 pb-4 bg-white border-b border-gray-100">
        <Text className="text-[19px] font-[700] text-gray-800">
          Your Preferences
        </Text>
        <Text className="text-[13px] text-gray-400 mt-0.5">
          Customize your trading preferences
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-5 pb-10">
          {/* Preferred Products */}
          <SectionCard Icon={Package} title="Preferred Products" color="#A7CC48">
            <Text className="text-[12px] text-gray-400 mb-3">
              Select the commodities you intend to purchase
            </Text>
            <View className="flex-row flex-wrap">
              {PRODUCTS.map((product) => (
                <OptionPill
                  key={product}
                  label={product}
                  selected={selectedProducts.includes(product)}
                  onPress={() => toggleProduct(product)}
                />
              ))}
            </View>
            {selectedProducts.length > 0 && (
              <View className="flex-row items-center gap-1.5 mt-2">
                <CheckCircle size={13} color="#22C55E" />
                <Text className="text-[11px] text-green-700">
                  {selectedProducts.length} product
                  {selectedProducts.length > 1 ? "s" : ""} selected
                </Text>
              </View>
            )}
          </SectionCard>

          {/* Preferred Currency */}
          <SectionCard Icon={DollarSign} title="Preferred Currency" color="#3B82F6">
            <View className="flex-row flex-wrap">
              {CURRENCIES.map((c) => (
                <OptionPill
                  key={c}
                  label={c}
                  selected={currency === c}
                  onPress={() => setCurrency(c)}
                />
              ))}
            </View>
          </SectionCard>

          {/* Preferred Unit */}
          <SectionCard Icon={Scale} title="Preferred Unit of Measurement" color="#8B5CF6">
            <View className="flex-row flex-wrap">
              {UNITS.map((u) => (
                <OptionPill
                  key={u}
                  label={u}
                  selected={unit === u}
                  onPress={() => setUnit(u)}
                />
              ))}
            </View>
          </SectionCard>

          {/* Summary */}
          <View className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 mb-5">
            <Text className="text-[12px] font-[700] text-green-800 mb-1">
              Almost done!
            </Text>
            <Text className="text-[12px] text-green-700 leading-4">
              Your account is now active. You can update these preferences anytime
              from your profile settings.
            </Text>
          </View>

          <TouchableOpacity
            className="bg-[#A7CC48] rounded-2xl h-[54px] items-center justify-center"
            activeOpacity={0.85}
            onPress={handleFinish}
          >
            <Text className="text-[15px] font-[700] text-white">
              Finish Setup
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommoditiesOnboard;
