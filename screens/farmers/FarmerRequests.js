/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Package,
  Calendar,
  Weight,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpCircle,
  Hash,
} from "lucide-react-native";
import api from "../../services/api";

const STATUS_COLORS = {
  pending: { bg: "#FFF7ED", text: "#C2410C", label: "Pending" },
  "in-cultivation": { bg: "#EFF6FF", text: "#2563EB", label: "In Cultivation" },
};

const RequestCard = ({ item, onAccept, onDecline, onUpload }) => {
  const isPending = item.status === "pending";
  const statusStyle = STATUS_COLORS[item.status] ?? STATUS_COLORS["pending"];

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
      <View className='px-3 py-1.5' style={{ backgroundColor: statusStyle.bg }}>
        <Text
          className='text-[10px] font-[700] uppercase tracking-widest'
          style={{ color: statusStyle.text }}
        >
          {statusStyle.label}
        </Text>
      </View>

      <View className='p-4'>
        {/* Commodity info */}
        <View className='flex-row items-center mb-4'>
          <View className='w-14 h-14 rounded-2xl bg-[#F0FDF4] items-center justify-center mr-3'>
            <Package size={26} color='#A7CC48' />
          </View>
          <View className='flex-1'>
            <Text className='text-[17px] font-[700] text-gray-800'>
              {item.commodity || "—"}
            </Text>
            <Text className='text-[12px] font-[600] text-[#A7CC48] mt-0.5'>
              {item.quantity}
            </Text>
          </View>
        </View>

        {/* Meta row */}
        <View className='bg-gray-50 rounded-xl p-3 gap-2 mb-4'>
          {item.orderType ? (
            <View className='flex-row items-center gap-2'>
              <Hash size={11} color='#9CA3AF' />
              <Text className='text-[11px] text-gray-400 w-24'>Order Type</Text>
              <Text className='text-[11px] font-[600] text-gray-700 flex-1 capitalize'>
                {item.orderType}
              </Text>
            </View>
          ) : null}
          <View className='flex-row items-center gap-2'>
            <Calendar size={11} color='#9CA3AF' />
            <Text className='text-[11px] text-gray-400 w-24'>Assigned</Text>
            <Text className='text-[11px] font-[600] text-gray-700 flex-1'>
              {item.assignedDate}
            </Text>
          </View>
          {item.edd ? (
            <View className='flex-row items-center gap-2'>
              <Weight size={11} color='#9CA3AF' />
              <Text className='text-[11px] text-gray-400 w-24'>Est. Delivery</Text>
              <Text className='text-[11px] font-[600] text-gray-700 flex-1'>
                {item.edd}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Action buttons */}
        {isPending ? (
          <View className='flex-row gap-3'>
            <TouchableOpacity
              className='flex-1 flex-row items-center justify-center bg-[#A7CC48] rounded-xl py-3 gap-1.5'
              activeOpacity={0.85}
              onPress={() => onAccept(item)}
            >
              <CheckCircle size={15} color='#fff' />
              <Text className='text-[13px] font-[700] text-white'>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='flex-1 flex-row items-center justify-center border border-gray-200 rounded-xl py-3 gap-1.5'
              activeOpacity={0.8}
              onPress={() => onDecline(item)}
            >
              <XCircle size={15} color='#6B7280' />
              <Text className='text-[13px] font-[600] text-gray-600'>Decline</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className='flex-row items-center justify-center bg-[#EFF6FF] rounded-xl py-3 gap-2'
            activeOpacity={0.85}
            onPress={() => onUpload(item)}
          >
            <ArrowUpCircle size={15} color='#2563EB' />
            <Text className='text-[13px] font-[700] text-[#2563EB]'>
              Upload Commodity
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const FarmerRequests = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    item: null,
    action: null,
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        "/farmer/requests?status=pending,in-cultivation"
      );
      const raw = response.data.data ?? [];
      const mapped = raw.map((r) => ({
        id: r._id,
        commodity: r.commodityName ?? r.request?.sourceId?.commodityName ?? "",
        quantity: `${r.quantity ?? 0} ${r.quantityUnits ?? "tonnes"}`,
        assignedDate: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
        edd: r.request?.order?.estimatedDeliveryDate
          ? new Date(r.request.order.estimatedDeliveryDate).toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "short", year: "numeric" }
            )
          : "",
        orderType: r.request?.order?.orderType ?? "",
        status: r.status,
      }));
      setRequests(mapped);
    } catch (err) {
      setError("Failed to load requests. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchRequests(); }, [fetchRequests]));

  const handleAccept = (item) =>
    setConfirmModal({ visible: true, item, action: "accept" });
  const handleDecline = (item) =>
    setConfirmModal({ visible: true, item, action: "decline" });
  const handleUpload = (item) =>
    navigation.navigate("UploadFromRequest", { userRequestId: item.id });

  const confirmAction = async () => {
    const { item, action } = confirmModal;
    setConfirmModal({ visible: false, item: null, action: null });
    setActionLoading(true);
    try {
      await api.put(`/farmer/requests/${item.id}/respond`, { action });
      if (action === "decline") {
        setRequests((prev) => prev.filter((r) => r.id !== item.id));
      } else {
        // Update status to in-cultivation in local state
        setRequests((prev) =>
          prev.map((r) =>
            r.id === item.id ? { ...r, status: "in-cultivation" } : r
          )
        );
      }
    } catch (err) {
      alert(err?.response?.data?.message ?? "Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inCultivationCount = requests.filter(
    (r) => r.status === "in-cultivation"
  ).length;

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      {/* Header */}
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <Text className='text-[19px] font-[700] text-gray-800'>
          My Requests
        </Text>
        <Text className='text-[13px] text-gray-400 mt-0.5'>
          {pendingCount} pending · {inCultivationCount} in cultivation
        </Text>
      </View>

      {loading || actionLoading ? (
        <ActivityIndicator
          size='small'
          color='#A7CC48'
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <TouchableOpacity
          style={{ alignItems: "center", marginTop: 40 }}
          onPress={fetchRequests}
          activeOpacity={0.7}
        >
          <Text className='text-[13px] text-red-400'>{error}</Text>
        </TouchableOpacity>
      ) : requests.length === 0 ? (
        <View className='flex-1 items-center justify-center'>
          <View className='w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4'>
            <CheckCircle size={36} color='#D1D5DB' />
          </View>
          <Text className='text-[15px] font-[600] text-gray-500'>
            All caught up!
          </Text>
          <Text className='text-[13px] text-gray-400 mt-1'>
            No active requests at this time.
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestCard
              item={item}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onUpload={handleUpload}
            />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Confirm Modal */}
      <Modal visible={confirmModal.visible} transparent animationType='fade'>
        <View
          className='flex-1 items-center justify-center px-6'
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <View className='bg-white rounded-3xl p-6 w-full'>
            <View className='items-center mb-4'>
              <View
                className='w-14 h-14 rounded-full items-center justify-center mb-3'
                style={{
                  backgroundColor:
                    confirmModal.action === "accept" ? "#F0FDF4" : "#FFF1F2",
                }}
              >
                {confirmModal.action === "accept" ? (
                  <CheckCircle size={28} color='#22C55E' />
                ) : (
                  <AlertCircle size={28} color='#EF4444' />
                )}
              </View>
              <Text className='text-[17px] font-[700] text-gray-800'>
                {confirmModal.action === "accept"
                  ? "Accept Request?"
                  : "Decline Request?"}
              </Text>
              <Text className='text-[13px] text-gray-400 text-center mt-1.5 leading-5'>
                {confirmModal.action === "accept"
                  ? `You're agreeing to fulfill the order for ${confirmModal.item?.commodity}.`
                  : `Are you sure you want to decline the ${confirmModal.item?.commodity} order?`}
              </Text>
            </View>
            <View className='flex-row gap-3 mt-2'>
              <TouchableOpacity
                className='flex-1 border border-gray-200 rounded-2xl py-4 items-center'
                activeOpacity={0.7}
                onPress={() =>
                  setConfirmModal({ visible: false, item: null, action: null })
                }
              >
                <Text className='text-[13px] font-[600] text-gray-600'>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='flex-1 rounded-2xl py-4 items-center'
                style={{
                  backgroundColor:
                    confirmModal.action === "accept" ? "#A7CC48" : "#EF4444",
                }}
                activeOpacity={0.85}
                onPress={confirmAction}
              >
                <Text className='text-[13px] font-[700] text-white'>
                  {confirmModal.action === "accept" ? "Accept" : "Decline"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FarmerRequests;
