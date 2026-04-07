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
  Hash,
  Package,
  Calendar,
  DollarSign,
  CreditCard,
  ShoppingBag,
  Truck,
} from "lucide-react-native";

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
  canceled: { label: "Cancelled", bg: "#FFF1F2", text: "#E11D48" },
  seated: { label: "Seated", bg: "#F5F3FF", text: "#8B5CF6" },
};

const InfoRow = ({ label, value, Icon }) => (
  <View className="flex-row items-center py-3 border-b border-gray-50">
    {Icon ? (
      <View className="w-8 h-8 rounded-xl bg-gray-100 items-center justify-center mr-3">
        <Icon size={14} color="#6B7280" />
      </View>
    ) : null}
    <View className="flex-1">
      <Text className="text-[11px] text-gray-400">{label}</Text>
      <Text className="text-[13px] font-[600] text-gray-800 mt-0.5">
        {value ?? "—"}
      </Text>
    </View>
  </View>
);

const Card = ({ title, children }) => (
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
      {title}
    </Text>
    {children}
  </View>
);

const OfftakerOrderDetail = ({ navigation, route }) => {
  const { order } = route.params ?? {};

  if (!order) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50 items-center justify-center">
        <StatusBar backgroundColor={"white"} barStyle="dark-content" />
        <Text className="text-[14px] text-gray-500">Order data not found.</Text>
      </SafeAreaView>
    );
  }

  const st =
    STATUS_STYLES[order.status] || {
      label: order.status ?? "Unknown",
      bg: "#F3F4F6",
      text: "#6B7280",
    };

  const edd = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const totalAmount = order.totalAmount
    ? `₦${order.totalAmount.toLocaleString()}`
    : order.pricePerTonne && order.quantity
    ? `₦${(order.pricePerTonne * order.quantity).toLocaleString()}`
    : "—";

  const pricePerTonne = order.pricePerTonne
    ? `₦${order.pricePerTonne.toLocaleString()}/tonne`
    : "—";

  const depositAmount = order.depositAmount
    ? `₦${order.depositAmount.toLocaleString()}`
    : "—";

  const remainingAmount = order.remainingAmount
    ? `₦${order.remainingAmount.toLocaleString()}`
    : "—";

  const depositPaid = order.depositPaid ? "Yes" : "No";

  const orderTypeBg =
    order.orderType === "pre-order" ? "#EFF6FF" : "#F5F3FF";
  const orderTypeText =
    order.orderType === "pre-order" ? "#3B82F6" : "#8B5CF6";

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
            Order Details
          </Text>
          <Text className="text-[12px] text-gray-400">
            Placed on {createdAt}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status card */}
        <Card title="Status">
          <View className="flex-row items-center justify-between py-3 border-b border-gray-50">
            <View className="flex-row items-center gap-2">
              <Hash size={14} color="#6B7280" />
              <Text className="text-[13px] font-[700] text-gray-800">
                {order.trackingId ?? "—"}
              </Text>
            </View>
            <View
              className="px-2.5 py-1 rounded-full"
              style={{ backgroundColor: st.bg }}
            >
              <Text
                className="text-[11px] font-[700]"
                style={{ color: st.text }}
              >
                {st.label}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center py-3">
            <View className="w-8 h-8 rounded-xl bg-gray-100 items-center justify-center mr-3">
              <ShoppingBag size={14} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-gray-400">Order Type</Text>
              <View
                className="self-start mt-1 px-2 py-0.5 rounded-full"
                style={{ backgroundColor: orderTypeBg }}
              >
                <Text
                  className="text-[11px] font-[700] capitalize"
                  style={{ color: orderTypeText }}
                >
                  {order.orderType ?? "—"}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Order details */}
        <Card title="Order Details">
          <InfoRow Icon={Package} label="Quantity" value={order.quantity ? `${order.quantity} tonnes` : "—"} />
          <InfoRow Icon={DollarSign} label="Price per Tonne" value={pricePerTonne} />
          <InfoRow Icon={DollarSign} label="Total Amount" value={totalAmount} />
          <InfoRow Icon={Calendar} label="Estimated Delivery" value={edd} />
          <InfoRow Icon={Truck} label="Delivery Status" value={st.label} />
        </Card>

        {/* Payment details */}
        <Card title="Payment">
          <InfoRow Icon={CreditCard} label="Deposit Paid" value={depositPaid} />
          <InfoRow Icon={DollarSign} label="Deposit Amount" value={depositAmount} />
          <InfoRow Icon={DollarSign} label="Remaining Amount" value={remainingAmount} />
        </Card>

        {/* Timeline note */}
        <View
          className="mx-4 mt-4 mb-8 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4"
        >
          <Text className="text-[13px] font-[700] text-green-800 mb-1">
            Order Progress
          </Text>
          <Text className="text-[12px] text-green-700 leading-4">
            Your order is currently{" "}
            <Text className="font-[700]">{st.label}</Text>. You will receive
            updates as your order progresses through each stage.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OfftakerOrderDetail;
