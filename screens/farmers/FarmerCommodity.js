/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Search,
  Package,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react-native";
import api from "../../services/api";

const CHECK_STATUS = {
  ready: {
    label: "Ready for Check",
    Icon: Clock,
    bg: "#FFF7ED",
    text: "#F97316",
    iconColor: "#F97316",
  },
  passed: {
    label: "Passed Check",
    Icon: CheckCircle,
    bg: "#F0FDF4",
    text: "#16A34A",
    iconColor: "#22C55E",
  },
  failed: {
    label: "Failed Check",
    Icon: XCircle,
    bg: "#FFF1F2",
    text: "#E11D48",
    iconColor: "#EF4444",
  },
};

const ORDER_STATUS = {
  "quality-check": { label: "Quality Check", bg: "#EFF6FF", text: "#3B82F6" },
  pending: { label: "Pending", bg: "#FFF7ED", text: "#F97316" },
  harvested: { label: "Harvested", bg: "#F0FDF4", text: "#16A34A" },
  "in-cultivation": { label: "In Cultivation", bg: "#F5F3FF", text: "#8B5CF6" },
  delivered: { label: "Delivered", bg: "#DCFCE7", text: "#15803D" },
};

const FILTERS = ["All", "Ready", "Passed", "Failed"];

const apiStatusToCheckStatus = (status) => {
  if (status === "passed-quality-check") return "passed";
  if (status === "failed-quality-check") return "failed";
  return "ready";
};

const CommodityCard = ({ item }) => {
  const checkStatus = apiStatusToCheckStatus(item.status);
  const cs = CHECK_STATUS[checkStatus];
  const os = ORDER_STATUS[item.status] || ORDER_STATUS.pending;
  const Icon = cs.Icon;
  const dateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <View
      className='bg-white border border-gray-100 rounded-2xl p-4 mb-3 mx-4'
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      }}
    >
      <View className='flex-row items-center'>
        <View className='w-12 h-12 rounded-xl bg-[#F0FDF4] items-center justify-center mr-3'>
          <Package size={22} color='#A7CC48' />
        </View>
        <View className='flex-1'>
          <Text className='text-[15px] font-[700] text-gray-800'>
            {item.commodity}
          </Text>
          <Text className='text-[12px] text-gray-400 mt-0.5'>{dateStr}</Text>
        </View>
        <View className='items-end gap-1'>
          {/* check status */}
          <View
            className='flex-row items-center px-2 py-1 rounded-full gap-1'
            style={{ backgroundColor: cs.bg }}
          >
            <Icon size={10} color={cs.iconColor} />
            <Text className='text-[10px] font-[600]' style={{ color: cs.text }}>
              {cs.label}
            </Text>
          </View>
          {/* order status */}
          <View
            className='px-2 py-1 rounded-full'
            style={{ backgroundColor: os.bg }}
          >
            <Text className='text-[10px] font-[500]' style={{ color: os.text }}>
              {os.label}
            </Text>
          </View>
        </View>
      </View>

      <View className='flex-row mt-3 pt-3 border-t border-gray-50 gap-4'>
        <View>
          <Text className='text-[10px] text-gray-400 uppercase font-[600]'>
            Quantity
          </Text>
          <Text className='text-[13px] font-[600] text-gray-700 mt-0.5'>
            {item.quantity} tonnes
          </Text>
        </View>
        <View>
          <Text className='text-[10px] text-gray-400 uppercase font-[600]'>
            Price / Tonne
          </Text>
          <Text className='text-[13px] font-[600] text-gray-700 mt-0.5'>
            ₦{item.pricePerTonne}
          </Text>
        </View>
      </View>
    </View>
  );
};

const FarmerCommodity = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommodities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/farmer/uploaded-commodities");
      setCommodities(response.data.data ?? []);
    } catch (err) {
      setError("Failed to load commodities. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchCommodities(); }, [fetchCommodities]));

  const filtered = commodities.filter((c) => {
    const checkStatus = apiStatusToCheckStatus(c.status);
    const matchSearch = (c.commodity ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      (activeFilter === "Ready" && checkStatus === "ready") ||
      (activeFilter === "Passed" && checkStatus === "passed") ||
      (activeFilter === "Failed" && checkStatus === "failed");
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      {/* Header */}
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <Text className='text-[19px] font-[700] text-gray-800'>
          My Commodities
        </Text>
        <Text className='text-[13px] text-gray-400 mt-0.5'>
          Track your uploaded produce
        </Text>
      </View>

      {/* Search */}
      <View className='px-4 pt-4 pb-3 bg-white'>
        <View className='flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-[44px]'>
          <Search size={16} color='#9CA3AF' />
          <TextInput
            className='flex-1 ml-2 text-[13px] text-gray-700'
            placeholder='Search commodities...'
            placeholderTextColor='#9CA3AF'
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Filter pills */}
      <View className='flex-row px-4 pb-3 bg-white border-b border-gray-100 gap-2'>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            className='px-4 py-2 rounded-full'
            style={{
              backgroundColor: activeFilter === f ? "#A7CC48" : "#F3F4F6",
            }}
            activeOpacity={0.8}
          >
            <Text
              className='text-[12px] font-[600]'
              style={{ color: activeFilter === f ? "#fff" : "#6B7280" }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size='small' color='#A7CC48' style={{ marginTop: 40 }} />
      ) : error ? (
        <TouchableOpacity
          style={{ alignItems: "center", marginTop: 40 }}
          onPress={fetchCommodities}
          activeOpacity={0.7}
        >
          <Text className='text-[13px] text-red-400'>{error}</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id ?? item.id}
          renderItem={({ item }) => <CommodityCard item={item} />}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className='items-center mt-16'>
              <Package size={40} color='#D1D5DB' />
              <Text className='text-[14px] text-gray-400 mt-3'>
                No commodities found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default FarmerCommodity;
