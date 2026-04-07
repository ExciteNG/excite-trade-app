/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  ArrowLeft,
  Package,
  Calendar,
  Warehouse,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";
import api from "../../services/api";

const OfftakerCheckout = ({ navigation, route }) => {
  const { cluster } = route.params ?? {};

  const [quantity, setQuantity] = useState("");
  const [edd, setEdd] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [warehousesLoading, setWarehousesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState(null);

  const fetchWarehouses = useCallback(async () => {
    setWarehousesLoading(true);
    try {
      const response = await api.get("/warehouse");
      setWarehouses(response.data.data ?? []);
    } catch {
      setWarehouses([]);
    } finally {
      setWarehousesLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchWarehouses(); }, [fetchWarehouses]));

  const isValid =
    quantity.trim() &&
    !isNaN(parseInt(quantity)) &&
    parseInt(quantity) > 0 &&
    edd.trim() &&
    selectedWarehouse;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        clusters: [{ clusterId: cluster._id, quantity: parseInt(quantity) }],
        selectedWarehouse: {
          warehouseId: selectedWarehouse._id,
          warehouseType: selectedWarehouse.type,
        },
        orderType: "pre-order",
        EDD: new Date(edd),
      };
      const response = await api.post("/offtaker/checkout", body);
      const result = response.data.data;
      const firstOrder = Array.isArray(result) ? result[0] : result;
      setTrackingId(
        firstOrder?.trackingId ??
          firstOrder?.[0]?.trackingId ??
          "Generated"
      );
      setSuccessModal(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ?? "Failed to place order. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessDone = () => {
    setSuccessModal(false);
    navigation.navigate("OrdersStack", { screen: "Orders" });
  };

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
          <Text className="text-[17px] font-[700] text-gray-800">
            Place Pre-Order
          </Text>
          <Text className="text-[12px] text-gray-400" numberOfLines={1}>
            {cluster?.name ?? "Cluster"}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-5 pb-10">
          {/* Cluster summary */}
          <View
            className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 mb-5 flex-row items-center"
          >
            <View className="w-10 h-10 rounded-xl bg-[#DCFCE7] items-center justify-center mr-3">
              <Package size={18} color="#16A34A" />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] font-[700] text-green-800">
                {cluster?.name ?? "—"}
              </Text>
              <Text className="text-[11px] text-green-700 mt-0.5">
                {cluster?.commodity ?? cluster?.commodityType ?? "—"} •{" "}
                {cluster?.remainingCapacity ?? "—"} tonnes available
              </Text>
            </View>
          </View>

          {/* Quantity */}
          <View className="mb-4">
            <Text className="text-[13px] font-[600] text-gray-700 mb-1.5">
              Quantity (tonnes)
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800"
              placeholder="e.g. 50"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          {/* Estimated Delivery Date */}
          <View className="mb-4">
            <Text className="text-[13px] font-[600] text-gray-700 mb-1.5">
              Estimated Delivery Date
            </Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-[50px]">
              <Calendar size={15} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-2 text-[13px] text-gray-800"
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={edd}
                onChangeText={setEdd}
              />
            </View>
            <Text className="text-[11px] text-gray-400 mt-1 ml-1">
              Format: YYYY-MM-DD (e.g. 2026-06-30)
            </Text>
          </View>

          {/* Warehouse selector */}
          <View className="mb-6">
            <Text className="text-[13px] font-[600] text-gray-700 mb-1.5">
              Delivery Warehouse
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-[50px]"
              activeOpacity={0.7}
              onPress={() => setWarehouseModal(true)}
            >
              <Warehouse size={15} color="#9CA3AF" />
              <Text
                className="flex-1 ml-2 text-[13px]"
                style={{ color: selectedWarehouse ? "#1F2937" : "#9CA3AF" }}
              >
                {selectedWarehouse
                  ? selectedWarehouse.name ?? selectedWarehouse._id
                  : "Select a warehouse"}
              </Text>
              <ChevronDown size={15} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {error ? (
            <View className="flex-row items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <AlertCircle size={15} color="#EF4444" style={{ marginTop: 1 }} />
              <Text className="text-[12px] text-red-600 flex-1 leading-4">
                {error}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            className="rounded-2xl h-[54px] items-center justify-center"
            style={{ backgroundColor: isValid ? "#A7CC48" : "#E5E7EB" }}
            activeOpacity={isValid ? 0.85 : 1}
            onPress={handleSubmit}
            disabled={submitting || !isValid}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                className="font-[700] text-[15px]"
                style={{ color: isValid ? "#fff" : "#9CA3AF" }}
              >
                Confirm Order
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Warehouse picker modal */}
      <Modal visible={warehouseModal} transparent animationType="slide">
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View className="bg-white rounded-t-3xl px-4 pt-4 pb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[16px] font-[700] text-gray-800">
                Select Warehouse
              </Text>
              <TouchableOpacity
                onPress={() => setWarehouseModal(false)}
                activeOpacity={0.7}
              >
                <Text className="text-[13px] font-[600] text-[#A7CC48]">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            {warehousesLoading ? (
              <ActivityIndicator size="small" color="#A7CC48" className="my-6" />
            ) : warehouses.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-[13px] text-gray-400">
                  No warehouses available
                </Text>
              </View>
            ) : (
              <FlatList
                data={warehouses}
                keyExtractor={(item) => item._id ?? item.id}
                style={{ maxHeight: 320 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row items-center py-4 border-b border-gray-50"
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedWarehouse(item);
                      setWarehouseModal(false);
                    }}
                  >
                    <View className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center mr-3">
                      <Warehouse size={16} color="#6B7280" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[13px] font-[600] text-gray-800">
                        {item.name ?? item._id}
                      </Text>
                      <Text className="text-[11px] text-gray-400 mt-0.5">
                        {item.type ?? "Standard"} •{" "}
                        {item.location ?? item.address ?? "—"}
                      </Text>
                    </View>
                    {selectedWarehouse?._id === item._id && (
                      <CheckCircle size={17} color="#A7CC48" />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Success modal */}
      <Modal visible={successModal} transparent animationType="fade">
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <View className="bg-white rounded-3xl p-6 w-full items-center">
            <View className="w-16 h-16 rounded-full bg-[#F0FDF4] items-center justify-center mb-4">
              <CheckCircle size={32} color="#22C55E" />
            </View>
            <Text className="text-[18px] font-[700] text-gray-800">
              Order Placed!
            </Text>
            <Text className="text-[13px] text-gray-400 text-center mt-2 leading-5">
              Your pre-order has been submitted successfully.
            </Text>
            <View className="bg-gray-100 rounded-xl px-5 py-3 mt-4 mb-5">
              <Text className="text-[11px] text-gray-500 text-center">
                Tracking ID
              </Text>
              <Text className="text-[16px] font-[800] text-gray-800 text-center mt-0.5">
                {trackingId}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-[#A7CC48] rounded-2xl h-[50px] w-full items-center justify-center"
              activeOpacity={0.85}
              onPress={handleSuccessDone}
            >
              <Text className="text-[14px] font-[700] text-white">
                View My Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OfftakerCheckout;
