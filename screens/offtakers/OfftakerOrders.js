/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Search, ShoppingBag, AlertCircle, ChevronRight } from "lucide-react-native";
import api from "../../services/api";

const STATUS_STYLES = {
  "new-request": { label: "New Request", bg: "#FFF3F3", text: "#EF4444" },
  pending: { label: "Pending", bg: "#FFF7ED", text: "#F97316" },
  "in-cultivation": { label: "In Cultivation", bg: "#F5F3FF", text: "#8B5CF6" },
  harvested: { label: "Harvested", bg: "#F0FDF4", text: "#16A34A" },
  "quality-check": { label: "Quality Check", bg: "#EFF6FF", text: "#3B82F6" },
  depository: { label: "In Depository", bg: "#F8FAFC", text: "#64748B" },
  available: { label: "Available", bg: "#F0FDF4", text: "#15803D" },
  "in-transit": { label: "In Transit", bg: "#F0F9FF", text: "#0284C7" },
  delivered: { label: "Delivered", bg: "#DCFCE7", text: "#15803D" },
  canceled: { label: "Cancelled", bg: "#FFF1F2", text: "#E11D48" },
  seated: { label: "Seated", bg: "#F5F3FF", text: "#8B5CF6" },
};

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "new-request", label: "New" },
  { key: "pending", label: "Pending" },
  { key: "in-transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
];

const OrderCard = ({ order, onPress }) => {
  const st = STATUS_STYLES[order.status] || { label: order.status, bg: "#F3F4F6", text: "#6B7280" };
  const shortId = order.trackingId ? order.trackingId.slice(0, 8).toUpperCase() : "—";
  const qty = order.quantity ? `${order.quantity} tonnes` : "—";
  const edd = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <TouchableOpacity
      className="flex-row items-center bg-white border border-gray-100 rounded-2xl p-3 mb-3 mx-4"
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      }}
    >
      <View className="w-12 h-12 rounded-xl bg-[#EFF6FF] items-center justify-center mr-3">
        <ShoppingBag size={22} color="#3B82F6" />
      </View>
      <View className="flex-1">
        <Text className="text-[14px] font-[700] text-gray-800">
          {order.commodityName || "—"}
        </Text>
        <Text className="text-[12px] text-gray-500 mt-0.5">{qty} · #{shortId}</Text>
        <Text className="text-[11px] text-gray-400 mt-0.5">EDD: {edd}</Text>
      </View>
      <View className="items-end gap-1">
        <View className="px-2 py-1 rounded-full" style={{ backgroundColor: st.bg }}>
          <Text className="text-[10px] font-[600]" style={{ color: st.text }}>
            {st.label}
          </Text>
        </View>
        <ChevronRight size={14} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
};

const OfftakerOrders = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/offtaker/orders");
      setOrders(response.data.data ?? []);
    } catch (err) {
      setError("Failed to load orders. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchOrders(); }, [fetchOrders]));

  const filtered = orders.filter((o) => {
    const matchesFilter =
      activeFilter === "all" || o.status === activeFilter;
    const matchesSearch =
      !query.trim() ||
      (o.trackingId ?? "").toLowerCase().includes(query.toLowerCase()) ||
      (o.commodityName ?? "").toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      {/* Header */}
      <View className="px-4 pt-2 pb-4 bg-white border-b border-gray-100">
        <Text className="text-[19px] font-[700] text-gray-800">My Orders</Text>
        <Text className="text-[13px] text-gray-400 mt-0.5">
          Track all your orders
        </Text>
      </View>

      {/* Search */}
      <View className="px-4 pt-3 pb-2 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-[44px]">
          <Search size={16} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-[13px] text-gray-800"
            placeholder="Search by commodity or tracking ID..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {/* Filter pills */}
      <View className="bg-white border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
        >
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              className="px-3 py-1.5 rounded-full border"
              style={{
                backgroundColor: activeFilter === f.key ? "#A7CC48" : "#fff",
                borderColor: activeFilter === f.key ? "#A7CC48" : "#E5E7EB",
              }}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text
                className="text-[12px] font-[600]"
                style={{ color: activeFilter === f.key ? "#fff" : "#6B7280" }}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A7CC48" />
          <Text className="text-[13px] text-gray-400 mt-3">Loading orders...</Text>
        </View>
      ) : error ? (
        <TouchableOpacity
          className="flex-1 items-center justify-center px-6"
          activeOpacity={0.7}
          onPress={fetchOrders}
        >
          <AlertCircle size={32} color="#EF4444" />
          <Text className="text-[13px] text-red-400 mt-3 text-center">{error}</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id ?? item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate("OrderDetail", { order: item })}
            />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-12">
              <ShoppingBag size={36} color="#D1D5DB" />
              <Text className="text-[14px] font-[600] text-gray-400 mt-3">
                No orders found
              </Text>
              <Text className="text-[12px] text-gray-400 mt-1">
                {activeFilter !== "all"
                  ? "Try a different status filter"
                  : "Place your first order from Explore"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default OfftakerOrders;
