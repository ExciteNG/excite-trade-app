/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Bell,
  ChevronRight,
  Package,
  Truck,
  AlertCircle,
  Wallet,
  ArrowUpCircle,
} from "lucide-react-native";
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
  cancelled: { label: "Cancelled", bg: "#FFF1F2", text: "#E11D48" },
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

const FarmerHome = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [userName, setUserName] = useState("");
  const [hasCluster, setHasCluster] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userInfoRaw = await AsyncStorage.getItem("userInfo");
      if (userInfoRaw) {
        const userInfo = JSON.parse(userInfoRaw);
        setUserName(userInfo?.name?.firstName ?? "");
        setHasCluster(!!userInfo?.profile?.clusterDetail?.clusterId);
      }
      const [overviewRes, countRes] = await Promise.all([
        api.get("/farmer/overview"),
        api.get("/notifications/unread-count"),
      ]);
      setOverview(overviewRes.data.data);
      setUnreadCount(countRes.data.data?.count ?? 0);
    } catch (err) {
      setError("Failed to load overview. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchOverview(); }, [fetchOverview]));

  const recentCommodities = overview?.requests?.slice(0, 3) ?? [];

  const renderCommodity = ({ item }) => {
    const commodityName = item.commodity ?? "";
    const quantityDisplay = item.quantity ? `${item.quantity} tonnes` : "";
    const priceDisplay = item.pricePerTonne
      ? `₦${item.pricePerTonne.toLocaleString()}`
      : "";
    const st = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
    return (
      <View
        className='flex-row items-center bg-white border border-gray-100 rounded-2xl p-3 mb-3 mx-4'
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
        }}
      >
        <View className='w-12 h-12 rounded-xl bg-[#F0FDF4] items-center justify-center mr-3'>
          <Package size={22} color='#A7CC48' />
        </View>
        <View className='flex-1'>
          <Text className='text-[14px] font-[600] text-gray-800'>
            {commodityName}
          </Text>
          <Text className='text-[12px] text-gray-500 mt-0.5'>
            {quantityDisplay}
          </Text>
          <Text className='text-[12px] font-[500] text-gray-600 mt-0.5'>
            {priceDisplay}/tonne
          </Text>
        </View>
        <View
          className='px-2 py-1 rounded-full'
          style={{ backgroundColor: st.bg }}
        >
          <Text className='text-[10px] font-[600]' style={{ color: st.text }}>
            {st.label}
          </Text>
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
              {userName} 👋
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
        <View className='px-4 pt-4 pb-4'>
          <Text className='text-[15px] font-[700] text-gray-800 mb-3'>
            Overview
          </Text>
          <View className='flex-row gap-3'>
            <StatCard
              label='New Requests'
              value={String(overview?.newRequest ?? 0)}
              bg='#FFF3F3'
              iconColor='#EF4444'
              Icon={Bell}
              onPress={() => navigation.navigate("RequestsTab")}
            />
            <StatCard
              label='Harvested'
              value={String(overview?.upLoadedCommodity ?? 0)}
              bg='#F0FDF4'
              iconColor='#22C55E'
              Icon={Package}
              onPress={() =>
                navigation.navigate("CommodityStack", { screen: "Commodity" })
              }
            />
            <StatCard
              label='Delivered'
              value={String(overview?.delivered?.length ?? 0)}
              bg='#FFF7ED'
              iconColor='#F97316'
              Icon={Truck}
              onPress={() => navigation.navigate("FarmerRequestHistory")}
            />
          </View>
        </View>

        {/* Cluster warning */}
        {!hasCluster && (
          <View className='mx-4 mb-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex-row items-start'>
            <AlertCircle size={15} color='#D97706' style={{ marginTop: 1 }} />
            <Text className='text-[12px] text-amber-700 ml-2 flex-1 leading-4'>
              You are not assigned to a cluster yet. Contact your GemExcite
              coordinator.
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View className='flex-row px-4 gap-3 mb-4'>
          <TouchableOpacity
            className='flex-1 bg-[#A7CC48] rounded-2xl py-4 items-center'
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("CommodityStack", { screen: "Upload" })
            }
          >
            <ArrowUpCircle size={20} color='#fff' />
            <Text className='text-[12px] font-[600] text-white mt-1'>
              Upload Commodity
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 bg-gray-800 rounded-2xl py-4 items-center'
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("ProfileStack", { screen: "FarmerWallet" })
            }
          >
            <Wallet size={20} color='#A7CC48' />
            <Text className='text-[12px] font-[600] text-white mt-1'>
              My Wallet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Commodities */}
        <View className='mb-8'>
          <View className='flex-row items-center justify-between px-4 mb-3'>
            <Text className='text-[15px] font-[700] text-gray-800'>
              My Commodities
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CommodityStack", { screen: "Commodity" })
              }
              className='flex-row items-center'
              activeOpacity={0.7}
            >
              <Text className='text-[12px] font-[600] text-[#A7CC48]'>
                See all
              </Text>
              <ChevronRight size={14} color='#A7CC48' />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size='small' color='#A7CC48' className='mt-6' />
          ) : error ? (
            <TouchableOpacity
              className='mx-4 items-center py-6'
              activeOpacity={0.7}
              onPress={fetchOverview}
            >
              <Text className='text-[13px] text-red-400'>{error}</Text>
            </TouchableOpacity>
          ) : (
            <FlatList
              data={recentCommodities}
              keyExtractor={(item) => item._id ?? item.id}
              renderItem={renderCommodity}
              scrollEnabled={false}
              ListEmptyComponent={
                <View className='items-center py-6'>
                  <Package size={32} color='#D1D5DB' />
                  <Text className='text-[13px] text-gray-400 mt-2'>
                    No commodities yet
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

export default FarmerHome;
