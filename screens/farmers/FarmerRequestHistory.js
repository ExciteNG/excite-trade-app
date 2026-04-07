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
  ArrowLeft,
  Search,
  Package,
  Calendar,
  User,
  Hash,
} from "lucide-react-native";
import api from "../../services/api";

const STATUS_STYLES = {
  "new-request": { label: "New Request", bg: "#FFF3F3", text: "#EF4444" },
  pending: { label: "Pending", bg: "#FFF7ED", text: "#F97316" },
  "in-cultivation": { label: "In Cultivation", bg: "#F5F3FF", text: "#8B5CF6" },
  harvested: { label: "Harvested", bg: "#F0FDF4", text: "#16A34A" },
  "quality-check": { label: "Quality Check", bg: "#EFF6FF", text: "#3B82F6" },
  depository: { label: "In Depository", bg: "#F8FAFC", text: "#64748B" },
  "in-transit": { label: "In Transit", bg: "#F0F9FF", text: "#0284C7" },
  delivered: { label: "Delivered", bg: "#DCFCE7", text: "#15803D" },
  cancelled: { label: "Cancelled", bg: "#FFF1F2", text: "#E11D48" },
};

const HistoryCard = ({ item }) => {
  const st = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
  return (
    <View
      className='bg-white border border-gray-100 rounded-2xl mx-4 mb-3 p-4'
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      }}
    >
      {/* Status + product row */}
      <View className='flex-row items-center justify-between mb-3'>
        <View className='flex-row items-center gap-2'>
          <View className='w-10 h-10 rounded-xl bg-[#F0FDF4] items-center justify-center'>
            <Package size={18} color='#A7CC48' />
          </View>
          <View>
            <Text className='text-[15px] font-[700] text-gray-800'>
              {item.product}
            </Text>
            <Text className='text-[11px] text-gray-400'>{item.quantity}</Text>
          </View>
        </View>
        <View
          className='px-3 py-1 rounded-full'
          style={{ backgroundColor: st.bg }}
        >
          <Text className='text-[11px] font-[700]' style={{ color: st.text }}>
            {st.label}
          </Text>
        </View>
      </View>

      {/* Meta grid */}
      <View className='bg-gray-50 rounded-xl p-3 gap-2'>
        <View className='flex-row items-center gap-2'>
          <Hash size={12} color='#9CA3AF' />
          <Text className='text-[11px] text-gray-400 w-20'>Order ID</Text>
          <Text className='text-[11px] font-[600] text-gray-700 flex-1'>
            {item.orderId}
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <User size={12} color='#9CA3AF' />
          <Text className='text-[11px] text-gray-400 w-20'>Coordinator</Text>
          <Text className='text-[11px] font-[600] text-gray-700 flex-1'>
            {item.coordinator}
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <Calendar size={12} color='#9CA3AF' />
          <Text className='text-[11px] text-gray-400 w-20'>Delivery</Text>
          <Text className='text-[11px] font-[600] text-gray-700 flex-1'>
            {item.deliveryDate}
          </Text>
        </View>
      </View>
    </View>
  );
};

const FarmerRequestHistory = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/farmer/request-history");
      const raw = response.data.data ?? [];
      const mapped = raw.map((r) => ({
        id: r._id,
        product: r.commodity ?? r.request?.commodity ?? "",
        orderId: r.request?.trackingId ?? r._id,
        quantity: r.quantity ? `${r.quantity} tonnes` : "",
        coordinator: r.request?.cluster ?? "",
        deliveryDate: r.request?.estimatedDeliveryDate
          ? new Date(r.request.estimatedDeliveryDate).toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "short", year: "numeric" }
            )
          : "",
        status: r.status ?? "pending",
      }));
      setHistory(mapped);
    } catch (err) {
      setError("Failed to load history. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchHistory(); }, [fetchHistory]));

  const filtered = history.filter(
    (h) =>
      h.product.toLowerCase().includes(search.toLowerCase()) ||
      h.orderId.toLowerCase().includes(search.toLowerCase()) ||
      h.coordinator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <View className='flex-row items-center gap-3'>
          <TouchableOpacity
            className='w-9 h-9 rounded-full bg-gray-100 items-center justify-center'
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={18} color='#374151' />
          </TouchableOpacity>
          <View>
            <Text className='text-[19px] font-[700] text-gray-800'>
              Request History
            </Text>
            <Text className='text-[13px] text-gray-400'>
              {filtered.length} accepted orders
            </Text>
          </View>
        </View>

        {/* Search */}
        <View className='flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-[44px] mt-3'>
          <Search size={15} color='#9CA3AF' />
          <TextInput
            className='flex-1 ml-2 text-[13px] text-gray-700'
            placeholder='Search by product, order ID...'
            placeholderTextColor='#9CA3AF'
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size='small'
          color='#A7CC48'
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <TouchableOpacity
          style={{ alignItems: "center", marginTop: 40 }}
          onPress={fetchHistory}
          activeOpacity={0.7}
        >
          <Text className='text-[13px] text-red-400'>{error}</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard item={item} />}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className='items-center mt-16'>
              <Package size={40} color='#D1D5DB' />
              <Text className='text-[14px] text-gray-400 mt-3'>
                No orders found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default FarmerRequestHistory;
