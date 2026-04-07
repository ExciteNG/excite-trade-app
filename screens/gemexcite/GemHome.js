/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Bell,
  Search,
  Users,
  ClipboardList,
  Warehouse,
  ChevronRight,
  Package,
  Calendar,
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
};

const StatCard = ({ label, value, bg, iconColor, Icon, onPress }) => (
  <TouchableOpacity
    className='flex-1 rounded-2xl p-3'
    style={{ backgroundColor: bg }}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <View
      className='w-8 h-8 rounded-xl items-center justify-center mb-2'
      style={{ backgroundColor: iconColor + "22" }}
    >
      <Icon size={15} color={iconColor} />
    </View>
    <Text className='text-[22px] font-[700] text-gray-800'>{value}</Text>
    <Text className='text-[10px] font-[500] text-gray-500 mt-0.5 leading-3'>
      {label}
    </Text>
  </TouchableOpacity>
);

const GemHome = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [clusterName, setClusterName] = useState("GemExcite");
  const [overview, setOverview] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await AsyncStorage.getItem("userInfo");
      if (raw) {
        const userInfo = JSON.parse(raw);
        setClusterName(
          userInfo?.profile?.isAssignedCluster?.clusterName ??
            userInfo?.name?.firstName ??
            "GemExcite"
        );
      }
      const [overviewRes, countRes] = await Promise.all([
        api.get("/gem-excite/overview"),
        api.get("/notifications/unread-count"),
      ]);
      const data = overviewRes.data.data;
      setUnreadCount(countRes.data.data?.count ?? 0);
      setOverview(data);
      const mapped = (data.request ?? []).map((r) => ({
        id: r._id,
        commodity:
          r.sourceId?.commodityName ?? r.order?.commodityName ?? "",
        trackingId: r.order?.trackingId ?? null,
        quantity: r.order?.quantity ? `${r.order.quantity} tonnes` : "",
        orderDate: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
        deliveryDate: r.order?.estimatedDeliveryDate
          ? new Date(r.order.estimatedDeliveryDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
        status: r.status ?? "new-request",
      }));
      setRequests(mapped);
    } catch (err) {
      setError("Failed to load data. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const filtered = requests.filter((r) =>
    (r.commodity ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const renderRequest = ({ item }) => {
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
        <View className='flex-row items-center justify-between mb-3'>
          <View className='flex-row items-center gap-2 flex-1'>
            <View className='w-10 h-10 rounded-xl bg-[#F0FDF4] items-center justify-center'>
              <Package size={18} color='#A7CC48' />
            </View>
            <View className='flex-1'>
              <Text className='text-[14px] font-[700] text-gray-800'>
                {item.commodity || "—"}
              </Text>
              <Text className='text-[11px] text-gray-400'>{item.quantity}</Text>
            </View>
          </View>
          <View
            className='px-2 py-1 rounded-full ml-2'
            style={{ backgroundColor: st.bg }}
          >
            <Text className='text-[10px] font-[600]' style={{ color: st.text }}>
              {st.label}
            </Text>
          </View>
        </View>
        {item.trackingId ? (
          <Text className='text-[11px] text-gray-400 mb-2'>
            #{item.trackingId}
          </Text>
        ) : null}
        <View className='flex-row gap-4'>
          <View className='flex-row items-center gap-1'>
            <Calendar size={11} color='#9CA3AF' />
            <Text className='text-[11px] text-gray-400'>
              {item.orderDate}
            </Text>
          </View>
          {item.deliveryDate ? (
            <View className='flex-row items-center gap-1'>
              <Calendar size={11} color='#A7CC48' />
              <Text className='text-[11px] text-gray-500'>
                EDD: {item.deliveryDate}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      {/* Header */}
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <View className='flex-row items-center justify-between'>
          <View>
            <Text className='text-[13px] text-gray-400'>Good morning,</Text>
            <Text className='text-[19px] font-[700] text-gray-800'>
              {clusterName} 👋
            </Text>
          </View>
          <TouchableOpacity
            className='w-10 h-10 rounded-full bg-gray-100 items-center justify-center'
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Bell size={19} color='#374151' />
            {unreadCount > 0 && (
              <View
                className='absolute top-0 right-0 bg-red-500 rounded-full items-center justify-center'
                style={{ width: 16, height: 16 }}
              >
                <Text className='text-white text-[9px] font-[700]'>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stat Cards */}
        <View className='px-4 pt-4 pb-3'>
          <Text className='text-[11px] font-[700] text-gray-400 uppercase tracking-widest mb-3'>
            Overview
          </Text>
          <View className='flex-row gap-2'>
            <StatCard
              label='New Requests'
              value={String(overview?.newRequest ?? 0)}
              bg='#EFF6FF'
              iconColor='#3B82F6'
              Icon={Users}
              onPress={() => navigation.navigate("Requests")}
            />
            <StatCard
              label='In Cultivation'
              value={String(overview?.inCultivationRequest ?? 0)}
              bg='#FFF7ED'
              iconColor='#F97316'
              Icon={ClipboardList}
              onPress={() => navigation.navigate("Requests")}
            />
            <StatCard
              label='Harvested'
              value={String(overview?.harvestedRequest ?? 0)}
              bg='#F0FDF4'
              iconColor='#22C55E'
              Icon={Warehouse}
              onPress={() =>
                navigation.navigate("ProfileStack", { screen: "Depository" })
              }
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className='flex-row px-4 gap-3 mb-4'>
          <TouchableOpacity
            className='flex-1 bg-[#A7CC48] rounded-2xl py-4 items-center'
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Requests")}
          >
            <ClipboardList size={20} color='#fff' />
            <Text className='text-[12px] font-[600] text-white mt-1'>
              New Requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 bg-gray-800 rounded-2xl py-4 items-center'
            activeOpacity={0.85}
            onPress={() => navigation.navigate("GemQualityControl")}
          >
            <Package size={20} color='#A7CC48' />
            <Text className='text-[12px] font-[600] text-white mt-1'>
              Quality Control
            </Text>
          </TouchableOpacity>
        </View>

        {/* Request History */}
        <View className='mb-8'>
          <View className='px-4 mb-3'>
            <View className='flex-row items-center justify-between mb-3'>
              <Text className='text-[15px] font-[700] text-gray-800'>
                Request History
              </Text>
              <TouchableOpacity
                className='flex-row items-center'
                activeOpacity={0.7}
                onPress={() => navigation.navigate("Requests")}
              >
                <Text className='text-[12px] font-[600] text-[#A7CC48]'>
                  See all
                </Text>
                <ChevronRight size={14} color='#A7CC48' />
              </TouchableOpacity>
            </View>
            {/* Search */}
            <View className='flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-[42px]'>
              <Search size={14} color='#9CA3AF' />
              <TextInput
                className='flex-1 ml-2 text-[13px] text-gray-700'
                placeholder='Search commodity...'
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
              style={{ marginTop: 20 }}
            />
          ) : error ? (
            <TouchableOpacity
              style={{ alignItems: "center", marginTop: 20 }}
              onPress={fetchData}
              activeOpacity={0.7}
            >
              <Text className='text-[13px] text-red-400'>{error}</Text>
            </TouchableOpacity>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              renderItem={renderRequest}
              scrollEnabled={false}
              ListEmptyComponent={
                <View className='items-center py-8'>
                  <Text className='text-[13px] text-gray-400'>
                    No results found
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GemHome;
