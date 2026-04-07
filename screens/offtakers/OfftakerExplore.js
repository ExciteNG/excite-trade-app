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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Search,
  MapPin,
  Package,
  BarChart3,
  Star,
  ChevronRight,
  AlertCircle,
} from "lucide-react-native";
import api from "../../services/api";

const ClusterCard = ({ cluster, onPress }) => {
  const isfarmer = cluster.type === "Farmer" || cluster.producerType === "Farmer";
  const typeBg = isfarmer ? "#F0FDF4" : "#FFF7ED";
  const typeText = isfarmer ? "#15803D" : "#C2410C";
  const typeLabel = isfarmer ? "Farmer" : "Miner";

  return (
    <TouchableOpacity
      className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 mx-4"
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      }}
    >
      {/* Name + type badge */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-[15px] font-[700] text-gray-800 flex-1 mr-2" numberOfLines={1}>
          {cluster.name ?? "Unnamed Cluster"}
        </Text>
        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: typeBg }}>
          <Text className="text-[10px] font-[700]" style={{ color: typeText }}>
            {typeLabel}
          </Text>
        </View>
      </View>

      {/* Details grid */}
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <MapPin size={13} color="#9CA3AF" />
          <Text className="text-[12px] text-gray-500 flex-1" numberOfLines={1}>
            {cluster.location ?? cluster.address ?? "—"}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Package size={13} color="#9CA3AF" />
          <Text className="text-[12px] text-gray-500">
            {cluster.commodity ?? cluster.commodityType ?? "—"}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row items-center gap-2">
            <BarChart3 size={13} color="#A7CC48" />
            <Text className="text-[12px] font-[600] text-gray-700">
              {cluster.remainingCapacity ?? cluster.clusterAvailable ?? "—"} tonnes available
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text className="text-[12px] font-[600] text-gray-700">
              {cluster.rating ? cluster.rating.toFixed(1) : "4.5"}
            </Text>
          </View>
        </View>
      </View>

      {/* CTA */}
      <View className="flex-row items-center justify-end mt-3 pt-3 border-t border-gray-50">
        <Text className="text-[12px] font-[700] text-[#A7CC48] mr-1">View Details</Text>
        <ChevronRight size={14} color="#A7CC48" />
      </View>
    </TouchableOpacity>
  );
};

const OfftakerExplore = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [query, setQuery] = useState("");

  const fetchClusters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/cluster");
      setClusters(response.data.data ?? []);
    } catch (err) {
      setError("Failed to load clusters. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchClusters(); }, [fetchClusters]));

  const filtered = clusters.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (c.name ?? "").toLowerCase().includes(q) ||
      (c.location ?? "").toLowerCase().includes(q) ||
      (c.address ?? "").toLowerCase().includes(q) ||
      (c.commodity ?? "").toLowerCase().includes(q) ||
      (c.commodityType ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      {/* Header */}
      <View className="px-4 pt-2 pb-4 bg-white border-b border-gray-100">
        <Text className="text-[19px] font-[700] text-gray-800">Explore Clusters</Text>
        <Text className="text-[13px] text-gray-400 mt-0.5">
          Browse available commodity clusters
        </Text>
      </View>

      {/* Search bar */}
      <View className="px-4 pt-4 pb-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-[44px]">
          <Search size={16} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-[13px] text-gray-800"
            placeholder="Search by name, location, commodity..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A7CC48" />
          <Text className="text-[13px] text-gray-400 mt-3">Loading clusters...</Text>
        </View>
      ) : error ? (
        <TouchableOpacity
          className="flex-1 items-center justify-center px-6"
          activeOpacity={0.7}
          onPress={fetchClusters}
        >
          <AlertCircle size={32} color="#EF4444" />
          <Text className="text-[13px] text-red-400 mt-3 text-center">{error}</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id ?? item.id}
          renderItem={({ item }) => (
            <ClusterCard
              cluster={item}
              onPress={() =>
                navigation.navigate("ClusterDetail", { cluster: item })
              }
            />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Package size={36} color="#D1D5DB" />
              <Text className="text-[14px] font-[600] text-gray-400 mt-3">
                No clusters found
              </Text>
              <Text className="text-[12px] text-gray-400 mt-1">
                Try a different search term
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default OfftakerExplore;
