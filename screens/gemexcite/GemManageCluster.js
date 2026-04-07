/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Search,
  ChevronRight,
  MapPin,
  Package,
  BarChart3,
  User,
} from "lucide-react-native";
import api from "../../services/api";

const AVATAR_COLORS = [
  "#DBEAFE",
  "#D1FAE5",
  "#FEF3C7",
  "#FCE7F3",
  "#EDE9FE",
  "#FFEDD5",
  "#E0F2FE",
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

const FarmerRow = ({ item, onPress, index }) => (
  <TouchableOpacity
    className='flex-row items-center bg-white border border-gray-100 rounded-2xl mx-4 mb-3 p-4'
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    }}
    activeOpacity={0.8}
    onPress={onPress}
  >
    {/* Avatar */}
    <View
      className='w-12 h-12 rounded-full items-center justify-center mr-3'
      style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
    >
      <Text className='text-[14px] font-[700] text-gray-700'>
        {getInitials(item.name)}
      </Text>
    </View>

    {/* Info */}
    <View className='flex-1'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-[14px] font-[700] text-gray-800'>{item.name}</Text>
        <View
          className='px-2 py-0.5 rounded-full'
          style={{
            backgroundColor: item.status === "Active" ? "#DCFCE7" : "#FFF7ED",
          }}
        >
          <Text
            className='text-[9px] font-[700] uppercase'
            style={{
              color: item.status === "Active" ? "#15803D" : "#D97706",
            }}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View className='flex-row items-center gap-3 mt-1.5'>
        <View className='flex-row items-center gap-1'>
          <Package size={11} color='#A7CC48' />
          <Text className='text-[11px] text-gray-500'>{item.commodity}</Text>
        </View>
        <View className='flex-row items-center gap-1'>
          <BarChart3 size={11} color='#A7CC48' />
          <Text className='text-[11px] text-gray-500'>{item.capacity}</Text>
        </View>
        <View className='flex-row items-center gap-1'>
          <MapPin size={11} color='#A7CC48' />
          <Text className='text-[11px] text-gray-500'>
            {(item.location ?? "").split(" ")[0]}
          </Text>
        </View>
      </View>
    </View>

    <ChevronRight size={16} color='#D1D5DB' />
  </TouchableOpacity>
);

const GemManageCluster = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarmers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/gem-excite/cluster/users");
      const raw = response.data.data ?? [];
      const mapped = raw.map((f) => ({
        id: f._id,
        name: `${f.name?.firstName ?? ""} ${f.name?.lastName ?? ""}`.trim(),
        commodity: f.profile?.commodityName ?? "",
        capacity: f.profile?.commodityProductionCapacity
          ? `${f.profile.commodityProductionCapacity} tonnes`
          : "",
        location: f.profile?.farmLocation ?? "",
        status: f.status ?? "Pending",
      }));
      setFarmers(mapped);
    } catch (err) {
      setError("Failed to load cluster. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchFarmers(); }, [fetchFarmers]));

  const filtered = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.commodity.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = farmers.filter((f) => f.status === "Active").length;

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      {/* Header */}
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <Text className='text-[19px] font-[700] text-gray-800'>
          Manage Cluster
        </Text>
        <Text className='text-[13px] text-gray-400 mt-0.5'>
          {farmers.length} farmers in your cluster
        </Text>
      </View>

      {/* Stats row */}
      <View className='flex-row px-4 py-3 bg-white border-b border-gray-100 gap-3'>
        <View className='flex-1 bg-[#F0FDF4] rounded-xl px-3 py-2.5'>
          <Text className='text-[11px] text-gray-400'>Active Farmers</Text>
          <Text className='text-[17px] font-[700] text-green-700'>
            {activeCount}
          </Text>
        </View>
        <View className='flex-1 bg-[#EFF6FF] rounded-xl px-3 py-2.5'>
          <Text className='text-[11px] text-gray-400'>Total</Text>
          <Text className='text-[17px] font-[700] text-blue-700'>
            {farmers.length}
          </Text>
        </View>
        <View className='flex-1 bg-[#FFF7ED] rounded-xl px-3 py-2.5'>
          <Text className='text-[11px] text-gray-400'>Pending</Text>
          <Text className='text-[17px] font-[700] text-orange-600'>
            {farmers.length - activeCount}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View className='px-4 py-3 bg-white border-b border-gray-100'>
        <View className='flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-[44px]'>
          <Search size={15} color='#9CA3AF' />
          <TextInput
            className='flex-1 ml-2 text-[13px] text-gray-700'
            placeholder='Search by name, commodity, location...'
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
          onPress={fetchFarmers}
          activeOpacity={0.7}
        >
          <Text className='text-[13px] text-red-400'>{error}</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <FarmerRow
              item={item}
              index={index}
              onPress={() =>
                navigation.navigate("GemFarmerDetail", { farmer: item })
              }
            />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className='items-center mt-12'>
              <User size={36} color='#D1D5DB' />
              <Text className='text-[14px] text-gray-400 mt-3'>
                No farmers found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default GemManageCluster;
