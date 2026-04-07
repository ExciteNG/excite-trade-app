/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Package,
  Calendar,
  Users,
  Search,
  CheckCircle,
  X,
  Info,
  Hash,
  Truck,
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

const GemNewRequest = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [clusterFarmers, setClusterFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignModal, setAssignModal] = useState({ visible: false, order: null });
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [farmerQuantities, setFarmerQuantities] = useState({});
  const [farmerSearch, setFarmerSearch] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [requestsRes, farmersRes] = await Promise.all([
        api.get("/gem-excite/requests?status=new-request"),
        api.get("/gem-excite/cluster/users"),
      ]);
      const rawOrders = requestsRes.data.data ?? [];
      const mapped = rawOrders.map((r) => ({
        id: r._id,
        commodity: r.sourceId?.commodityName ?? r.order?.commodityName ?? "",
        quantity: r.order?.quantity ?? 0,
        unit: "tonnes",
        orderType: r.order?.orderType ?? "pre-order",
        status: r.order?.status ?? r.status ?? "new-request",
        trackingId: r.order?.trackingId ?? "",
        purchaseDate: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
        edd: r.order?.estimatedDeliveryDate
          ? new Date(r.order.estimatedDeliveryDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
      }));
      setOrders(mapped);

      const rawFarmers = farmersRes.data.data ?? [];
      const mappedFarmers = rawFarmers.map((f) => ({
        id: f._id,
        name: `${f.name?.firstName ?? ""} ${f.name?.lastName ?? ""}`.trim(),
        capacity: f.profile?.commodityProductionCapacity ?? 0,
        remaining: f.profile?.commodityProductionCapacity ?? 0,
        commodity: f.profile?.commodityName ?? "",
      }));
      setClusterFarmers(mappedFarmers);
    } catch (err) {
      setError("Failed to load requests. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const openAssign = (order) => {
    setAssignModal({ visible: true, order });
    setSelectedFarmers([]);
    setFarmerQuantities({});
    setFarmerSearch("");
  };

  const toggleFarmer = (farmerId) => {
    setSelectedFarmers((prev) => {
      if (prev.includes(farmerId)) {
        setFarmerQuantities((q) => { const next = { ...q }; delete next[farmerId]; return next; });
        return prev.filter((id) => id !== farmerId);
      }
      return [...prev, farmerId];
    });
  };

  const setFarmerQty = (farmerId, value) => {
    setFarmerQuantities((prev) => ({ ...prev, [farmerId]: value }));
  };

  const totalAssigned = selectedFarmers.reduce((sum, id) => {
    const qty = parseInt(farmerQuantities[id] ?? "0", 10);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  const isSufficient =
    assignModal.order &&
    selectedFarmers.length > 0 &&
    totalAssigned >= assignModal.order.quantity &&
    selectedFarmers.every((id) => parseInt(farmerQuantities[id] ?? "0", 10) > 0);

  const confirmAssign = async () => {
    if (!isSufficient) return;
    setAssigning(true);
    try {
      const users = selectedFarmers.map((id) => ({
        userId: id,
        quantity: parseInt(farmerQuantities[id], 10),
      }));
      await api.post(
        `/gem-excite/requests/${assignModal.order.id}/assign-users`,
        { users }
      );
      setOrders((prev) => prev.filter((o) => o.id !== assignModal.order.id));
      setAssignModal({ visible: false, order: null });
    } catch (err) {
      alert(
        err?.response?.data?.message ?? "Assignment failed. Please try again."
      );
    } finally {
      setAssigning(false);
    }
  };

  const filteredFarmers = clusterFarmers.filter(
    (f) =>
      f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.commodity.toLowerCase().includes(farmerSearch.toLowerCase())
  );

  const renderOrder = ({ item }) => (
    <View
      className='bg-white border border-gray-100 rounded-2xl mx-4 mb-4 overflow-hidden'
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      }}
    >
      {/* Order type banner */}
      <View
        className='px-3 py-1.5'
        style={{
          backgroundColor:
            item.orderType === "pre-order" ? "#F5F3FF" : "#EFF6FF",
        }}
      >
        <Text
          className='text-[10px] font-[700] uppercase tracking-widest'
          style={{
            color: item.orderType === "pre-order" ? "#8B5CF6" : "#3B82F6",
          }}
        >
          {item.orderType}
        </Text>
      </View>

      <View className='p-4'>
        {/* Commodity + quantity header */}
        <View className='flex-row items-center mb-4'>
          <View className='w-14 h-14 rounded-2xl bg-[#F0FDF4] items-center justify-center mr-3'>
            <Package size={26} color='#A7CC48' />
          </View>
          <View className='flex-1'>
            <Text className='text-[17px] font-[700] text-gray-800'>
              {item.commodity || "—"}
            </Text>
            <Text className='text-[13px] font-[600] text-[#A7CC48] mt-0.5'>
              {item.quantity} {item.unit}
            </Text>
          </View>
        </View>

        {/* Detail grid */}
        <View className='bg-gray-50 rounded-xl p-3 gap-2 mb-4'>
          {item.trackingId ? (
            <View className='flex-row items-center gap-2'>
              <Hash size={11} color='#9CA3AF' />
              <Text className='text-[11px] text-gray-400 w-24'>Tracking ID</Text>
              <Text className='text-[11px] font-[600] text-gray-700 flex-1'>
                {item.trackingId}
              </Text>
            </View>
          ) : null}
          <View className='flex-row items-center gap-2'>
            <Calendar size={11} color='#9CA3AF' />
            <Text className='text-[11px] text-gray-400 w-24'>Order Date</Text>
            <Text className='text-[11px] font-[600] text-gray-700 flex-1'>
              {item.purchaseDate || "—"}
            </Text>
          </View>
          <View className='flex-row items-center gap-2'>
            <Truck size={11} color='#9CA3AF' />
            <Text className='text-[11px] text-gray-400 w-24'>Est. Delivery</Text>
            <Text className='text-[11px] font-[600] text-gray-700 flex-1'>
              {item.edd || "—"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className='flex-row items-center justify-center gap-2 bg-[#A7CC48] rounded-xl py-3'
          activeOpacity={0.85}
          onPress={() => openAssign(item)}
        >
          <Users size={15} color='#fff' />
          <Text className='text-[13px] font-[700] text-white'>
            Assign to Farmer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <View className='flex-row items-center justify-between'>
          <View>
            <Text className='text-[19px] font-[700] text-gray-800'>
              New Requests
            </Text>
            <Text className='text-[13px] text-gray-400 mt-0.5'>
              {orders.length} pending {orders.length === 1 ? "order" : "orders"} to assign
            </Text>
          </View>
          <TouchableOpacity
            className='bg-gray-100 rounded-xl px-3 py-2'
            activeOpacity={0.7}
            onPress={() => navigation.navigate("GemAssignedRequests")}
          >
            <Text className='text-[12px] font-[600] text-gray-600'>
              Assigned
            </Text>
          </TouchableOpacity>
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
          onPress={fetchData}
          activeOpacity={0.7}
        >
          <Text className='text-[13px] text-red-400'>{error}</Text>
        </TouchableOpacity>
      ) : orders.length === 0 ? (
        <View className='flex-1 items-center justify-center'>
          <View className='w-20 h-20 rounded-full bg-[#F0FDF4] items-center justify-center mb-4'>
            <CheckCircle size={36} color='#22C55E' />
          </View>
          <Text className='text-[15px] font-[600] text-gray-500'>
            All orders assigned!
          </Text>
          <Text className='text-[13px] text-gray-400 mt-1 text-center px-10'>
            Great work. All pending requests have been assigned to farmers.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Assign Modal */}
      <Modal visible={assignModal.visible} transparent animationType='slide'>
        <View
          className='flex-1 justify-end'
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className='bg-white rounded-t-3xl px-4 pt-5 pb-8'
            style={{ maxHeight: "82%" }}
          >
            {/* Modal header */}
            <View className='flex-row items-center justify-between mb-3'>
              <View>
                <Text className='text-[17px] font-[700] text-gray-800'>
                  Assign to Farmer
                </Text>
                <Text className='text-[12px] text-gray-400'>
                  {assignModal.order?.commodity} · {assignModal.order?.quantity}{" "}
                  {assignModal.order?.unit}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setAssignModal({ visible: false, order: null })}
              >
                <X size={20} color='#6B7280' />
              </TouchableOpacity>
            </View>

            {/* Capacity notice */}
            <View
              className='flex-row items-start rounded-xl px-3 py-3 mb-3 gap-2'
              style={{
                backgroundColor: isSufficient ? "#F0FDF4" : "#FFF7ED",
                borderWidth: 1,
                borderColor: isSufficient ? "#BBF7D0" : "#FED7AA",
              }}
            >
              <Info size={14} color={isSufficient ? "#16A34A" : "#F97316"} style={{ marginTop: 1 }} />
              <Text
                className='text-[12px] flex-1 leading-4'
                style={{ color: isSufficient ? "#15803D" : "#C2410C" }}
              >
                Assigned: {totalAssigned}t / Required: {assignModal.order?.quantity}t
                {isSufficient ? "  ✓ Sufficient" : `  — need ${(assignModal.order?.quantity ?? 0) - totalAssigned}t more`}
              </Text>
            </View>

            {/* Farmer search */}
            <View className='flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-[42px] mb-3'>
              <Search size={14} color='#9CA3AF' />
              <TextInput
                className='flex-1 ml-2 text-[13px] text-gray-700'
                placeholder='Search farmers...'
                placeholderTextColor='#9CA3AF'
                value={farmerSearch}
                onChangeText={setFarmerSearch}
              />
            </View>

            {/* Farmer list */}
            <ScrollView
              style={{ maxHeight: 260 }}
              showsVerticalScrollIndicator={false}
            >
              {filteredFarmers.map((farmer, index) => {
                const isSelected = selectedFarmers.includes(farmer.id);
                return (
                  <View
                    key={farmer.id}
                    className='py-3 border-b border-gray-50'
                  >
                    <TouchableOpacity
                      className='flex-row items-center'
                      activeOpacity={0.7}
                      onPress={() => toggleFarmer(farmer.id)}
                    >
                      <View
                        className='w-10 h-10 rounded-full items-center justify-center mr-3'
                        style={{
                          backgroundColor:
                            AVATAR_COLORS[index % AVATAR_COLORS.length],
                        }}
                      >
                        <Text className='text-[12px] font-[700] text-gray-700'>
                          {getInitials(farmer.name)}
                        </Text>
                      </View>
                      <View className='flex-1'>
                        <Text className='text-[13px] font-[600] text-gray-800'>
                          {farmer.name}
                        </Text>
                        <Text className='text-[11px] text-gray-400'>
                          {farmer.commodity} · capacity: {farmer.capacity}t
                        </Text>
                      </View>
                      <View
                        className='w-6 h-6 rounded-full border-2 items-center justify-center'
                        style={{
                          borderColor: isSelected ? "#A7CC48" : "#D1D5DB",
                          backgroundColor: isSelected ? "#A7CC48" : "transparent",
                        }}
                      >
                        {isSelected && <CheckCircle size={14} color='#fff' />}
                      </View>
                    </TouchableOpacity>

                    {isSelected && (
                      <View className='flex-row items-center mt-2 ml-13 gap-2'
                        style={{ marginLeft: 52 }}
                      >
                        <Text className='text-[11px] text-gray-500'>
                          Quantity to assign (tonnes):
                        </Text>
                        <TextInput
                          className='flex-1 bg-gray-100 rounded-lg px-3 h-[34px] text-[13px] text-gray-800'
                          placeholder='0'
                          placeholderTextColor='#9CA3AF'
                          keyboardType='numeric'
                          value={farmerQuantities[farmer.id] ?? ""}
                          onChangeText={(v) => setFarmerQty(farmer.id, v)}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            {/* Confirm button */}
            <TouchableOpacity
              className='rounded-2xl h-[52px] items-center justify-center mt-4'
              style={{ backgroundColor: isSufficient ? "#A7CC48" : "#E5E7EB" }}
              activeOpacity={isSufficient ? 0.85 : 1}
              onPress={confirmAssign}
              disabled={!isSufficient || assigning}
            >
              {assigning ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Text
                  className='font-[700] text-[14px]'
                  style={{ color: isSufficient ? "#fff" : "#9CA3AF" }}
                >
                  {selectedFarmers.length === 0
                    ? "Select farmers to assign"
                    : isSufficient
                      ? `Assign to ${selectedFarmers.length} farmer${selectedFarmers.length > 1 ? "s" : ""}`
                      : "Enter quantities for all selected farmers"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GemNewRequest;
