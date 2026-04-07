/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Package,
  User,
  CheckCircle,
  Clock,
  ArrowUpCircle,
  ClipboardCheck,
  XCircle,
} from "lucide-react-native";
import api from "../../services/api";

const AVATAR_COLORS = ["#DBEAFE", "#D1FAE5", "#FEF3C7", "#FCE7F3", "#EDE9FE"];

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "#FFF7ED",
    text: "#C2410C",
    Icon: Clock,
    iconColor: "#C2410C",
  },
  "in-cultivation": {
    label: "In Cultivation",
    bg: "#EFF6FF",
    text: "#2563EB",
    Icon: Package,
    iconColor: "#2563EB",
  },
  uploaded: {
    label: "Uploaded",
    bg: "#F5F3FF",
    text: "#7C3AED",
    Icon: ArrowUpCircle,
    iconColor: "#7C3AED",
  },
  validating: {
    label: "Quality Check",
    bg: "#FEF9C3",
    text: "#854D0E",
    Icon: ClipboardCheck,
    iconColor: "#854D0E",
  },
  delivered: {
    label: "Delivered",
    bg: "#F0FDF4",
    text: "#15803D",
    Icon: CheckCircle,
    iconColor: "#15803D",
  },
  declined: {
    label: "Declined",
    bg: "#FFF1F2",
    text: "#BE123C",
    Icon: XCircle,
    iconColor: "#BE123C",
  },
};

const AssignmentCard = ({ item, index, onReview }) => {
  const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG["pending"];
  const { Icon, iconColor } = statusCfg;
  const canReview = item.status === "uploaded" && item.uploadedCommodityId;

  return (
    <View
      className='bg-white border border-gray-100 rounded-2xl mx-4 mb-4 overflow-hidden'
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      }}
    >
      {/* Status banner */}
      <View
        className='px-3 py-1.5 flex-row items-center gap-2'
        style={{ backgroundColor: statusCfg.bg }}
      >
        <Icon size={11} color={statusCfg.text} />
        <Text
          className='text-[10px] font-[700] uppercase tracking-widest'
          style={{ color: statusCfg.text }}
        >
          {statusCfg.label}
        </Text>
      </View>

      <View className='p-4'>
        {/* Farmer info */}
        <View className='flex-row items-center mb-4'>
          <View
            className='w-12 h-12 rounded-full items-center justify-center mr-3'
            style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
          >
            <Text className='text-[13px] font-[700] text-gray-700'>
              {getInitials(item.farmerName)}
            </Text>
          </View>
          <View className='flex-1'>
            <Text className='text-[15px] font-[700] text-gray-800'>
              {item.farmerName || "—"}
            </Text>
            <Text className='text-[12px] text-gray-400 mt-0.5'>
              {item.commodity || "—"} · {item.quantity} tonnes assigned
            </Text>
          </View>
        </View>

        {/* Uploaded commodity info */}
        {item.uploadedCommodityId ? (
          <View className='bg-gray-50 rounded-xl p-3 mb-4 gap-1.5'>
            <Text className='text-[11px] font-[700] text-gray-500 uppercase tracking-wide mb-1'>
              Upload Details
            </Text>
            <View className='flex-row justify-between'>
              <Text className='text-[12px] text-gray-400'>Quantity</Text>
              <Text className='text-[12px] font-[600] text-gray-700'>
                {item.uploadedQuantity} tonnes
              </Text>
            </View>
            <View className='flex-row justify-between'>
              <Text className='text-[12px] text-gray-400'>Price / Tonne</Text>
              <Text className='text-[12px] font-[600] text-gray-700'>
                ₦{item.uploadedPrice?.toLocaleString() ?? "—"}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Review button for uploaded items */}
        {canReview ? (
          <TouchableOpacity
            className='flex-row items-center justify-center bg-[#A7CC48] rounded-xl py-3 gap-2'
            activeOpacity={0.85}
            onPress={() => onReview(item.uploadedCommodityId)}
          >
            <ClipboardCheck size={15} color='#fff' />
            <Text className='text-[13px] font-[700] text-white'>
              Quality Check
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const GemAssignedRequests = ({ navigation }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/gem-excite/assigned-requests");
      const raw = res.data.data ?? [];
      const mapped = raw.map((a) => ({
        id: a._id,
        farmerName: `${a.user?.name?.firstName ?? ""} ${a.user?.name?.lastName ?? ""}`.trim(),
        commodity: a.commodityName ?? a.request?.sourceId?.commodityName ?? "",
        quantity: a.quantity ?? 0,
        status: a.status,
        uploadedCommodityId: a.uploadedCommodity?._id ?? null,
        uploadedQuantity: a.uploadedCommodity?.quantity ?? null,
        uploadedPrice: a.uploadedCommodity?.pricePerTonne ?? null,
      }));
      setAssignments(mapped);
    } catch (err) {
      setError("Failed to load assignments. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchAssignments(); }, [fetchAssignments]));

  const handleReview = (uploadedCommodityId) => {
    navigation.navigate("GemQualityControl", { uploadedCommodityId });
  };

  const uploadedCount = assignments.filter((a) => a.status === "uploaded").length;

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <Text className='text-[19px] font-[700] text-gray-800'>
          Assigned Farmers
        </Text>
        <Text className='text-[13px] text-gray-400 mt-0.5'>
          {assignments.length} total · {uploadedCount} awaiting quality check
        </Text>
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
          onPress={fetchAssignments}
          activeOpacity={0.7}
        >
          <Text className='text-[13px] text-red-400'>{error}</Text>
        </TouchableOpacity>
      ) : assignments.length === 0 ? (
        <View className='flex-1 items-center justify-center'>
          <View className='w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4'>
            <User size={36} color='#D1D5DB' />
          </View>
          <Text className='text-[15px] font-[600] text-gray-500'>
            No assignments yet
          </Text>
          <Text className='text-[13px] text-gray-400 mt-1 text-center px-10'>
            Assigned farmers will appear here after you assign requests.
          </Text>
        </View>
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <AssignmentCard
              item={item}
              index={index}
              onReview={handleReview}
            />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default GemAssignedRequests;
