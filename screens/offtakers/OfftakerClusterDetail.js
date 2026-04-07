/** @format */
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  MapPin,
  Package,
  BarChart3,
  Star,
  Users,
  Warehouse,
  ChevronRight,
  ShoppingBag,
} from "lucide-react-native";

const DetailRow = ({ Icon, label, value }) => (
  <View className="flex-row items-center py-3 border-b border-gray-50">
    <View className="w-8 h-8 rounded-xl bg-gray-100 items-center justify-center mr-3">
      <Icon size={15} color="#6B7280" />
    </View>
    <View className="flex-1">
      <Text className="text-[11px] text-gray-400">{label}</Text>
      <Text className="text-[13px] font-[600] text-gray-800 mt-0.5">
        {value != null ? String(value) : "—"}
      </Text>
    </View>
  </View>
);

const OfftakerClusterDetail = ({ navigation, route }) => {
  const { cluster } = route.params ?? {};

  if (!cluster) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50 items-center justify-center">
        <StatusBar backgroundColor={"white"} barStyle="dark-content" />
        <Text className="text-[14px] text-gray-500">Cluster data not found.</Text>
      </SafeAreaView>
    );
  }

  const totalCapacity = cluster.totalCapacity ?? 0;
  const usedCapacity = cluster.usedCapacity ?? 0;
  const remaining = cluster.remainingCapacity ?? (totalCapacity - usedCapacity);
  const capacityPct =
    totalCapacity > 0 ? Math.min((usedCapacity / totalCapacity) * 100, 100) : 0;
  const capacityColor =
    capacityPct > 80 ? "#EF4444" : capacityPct > 60 ? "#F97316" : "#A7CC48";

  const isfarmer =
    cluster.type === "Farmer" || cluster.producerType === "Farmer";
  const typeBg = isfarmer ? "#F0FDF4" : "#FFF7ED";
  const typeText = isfarmer ? "#15803D" : "#C2410C";
  const typeLabel = isfarmer ? "Farmer Cluster" : "Miner Cluster";

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3"
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text
            className="text-[17px] font-[700] text-gray-800"
            numberOfLines={1}
          >
            {cluster.name ?? "Cluster Details"}
          </Text>
          <Text className="text-[12px] text-gray-400">Cluster information</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View
          className="mx-4 mt-4 bg-white rounded-2xl p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
          }}
        >
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-[19px] font-[800] text-gray-800">
                {cluster.name ?? "—"}
              </Text>
              <View className="flex-row items-center gap-2 mt-1.5">
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: typeBg }}
                >
                  <Text
                    className="text-[10px] font-[700]"
                    style={{ color: typeText }}
                  >
                    {typeLabel}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <Text className="text-[11px] font-[600] text-gray-600">
                    {cluster.rating ? cluster.rating.toFixed(1) : "4.5"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Capacity bar */}
          <View className="mb-1">
            <View className="flex-row justify-between mb-1">
              <Text className="text-[11px] text-gray-500">Capacity used</Text>
              <Text className="text-[11px] font-[600] text-gray-700">
                {usedCapacity}/{totalCapacity} tonnes
              </Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <View
                className="h-2 rounded-full"
                style={{ width: `${capacityPct}%`, backgroundColor: capacityColor }}
              />
            </View>
            <Text className="text-[10px] text-gray-400 mt-1">
              {remaining} tonnes available
            </Text>
          </View>
        </View>

        {/* Details card */}
        <View
          className="mx-4 mt-4 bg-white rounded-2xl px-4 py-2"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
          }}
        >
          <Text className="text-[13px] font-[700] text-gray-700 pt-3 pb-1">
            Cluster Details
          </Text>
          <DetailRow
            Icon={MapPin}
            label="Location"
            value={cluster.location ?? cluster.address}
          />
          <DetailRow
            Icon={Package}
            label="Commodity"
            value={cluster.commodity ?? cluster.commodityType}
          />
          <DetailRow
            Icon={Warehouse}
            label="GemExcite Manager"
            value={
              cluster.gemExcite?.name?.fullName ??
              cluster.gemExciteName ??
              "—"
            }
          />
          <DetailRow
            Icon={Users}
            label="Producers Count"
            value={
              cluster.farmers?.length ??
              cluster.miners?.length ??
              cluster.producersCount ??
              "—"
            }
          />
          <View className="flex-row items-center py-3">
            <View className="w-8 h-8 rounded-xl bg-gray-100 items-center justify-center mr-3">
              <BarChart3 size={15} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-gray-400">Total Capacity</Text>
              <Text className="text-[13px] font-[600] text-gray-800 mt-0.5">
                {totalCapacity} tonnes
              </Text>
            </View>
          </View>
        </View>

        {/* Description card */}
        {cluster.description ? (
          <View
            className="mx-4 mt-4 bg-white rounded-2xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
            }}
          >
            <Text className="text-[13px] font-[700] text-gray-700 mb-2">
              About
            </Text>
            <Text className="text-[13px] text-gray-500 leading-5">
              {cluster.description}
            </Text>
          </View>
        ) : null}

        {/* CTA */}
        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            className="bg-[#A7CC48] rounded-2xl h-[54px] items-center justify-center flex-row gap-2"
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Checkout", { cluster })}
          >
            <ShoppingBag size={18} color="#fff" />
            <Text className="text-[15px] font-[700] text-white">
              Place Pre-Order
            </Text>
            <ChevronRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OfftakerClusterDetail;
