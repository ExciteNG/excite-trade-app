/** @format */
import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  ArrowLeft,
  Package,
  MapPin,
  BarChart3,
  PhoneCall,
  Mail,
  Clock,
  ArrowUpCircle,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Calendar,
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

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in-cultivation", label: "Active" },
  { key: "uploaded", label: "Uploaded" },
  { key: "validating", label: "Quality Check" },
  { key: "delivered", label: "Delivered" },
  { key: "declined", label: "Declined" },
];

const PAST_STATUSES = new Set(["delivered", "declined"]);

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

const AssignmentCard = ({ item, onReview }) => {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG["pending"];
  const { Icon } = cfg;
  const canReview = item.status === "uploaded" && item.uploadedCommodityId;

  return (
    <View
      className='bg-white border border-gray-100 rounded-2xl mb-3 overflow-hidden'
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
      }}
    >
      {/* Status banner */}
      <View
        className='px-3 py-1.5 flex-row items-center gap-2'
        style={{ backgroundColor: cfg.bg }}
      >
        <Icon size={11} color={cfg.text} />
        <Text
          className='text-[10px] font-[700] uppercase tracking-widest'
          style={{ color: cfg.text }}
        >
          {cfg.label}
        </Text>
      </View>

      <View className='p-4'>
        {/* Commodity + qty */}
        <View className='flex-row items-start justify-between mb-3'>
          <View className='flex-1'>
            <Text className='text-[15px] font-[700] text-gray-800'>
              {item.commodityName || "—"}
            </Text>
            <Text className='text-[12px] text-gray-400 mt-0.5'>
              {item.assignedDate}
            </Text>
          </View>
          <View className='bg-gray-50 rounded-xl px-3 py-1.5 items-end'>
            <Text className='text-[11px] text-gray-400'>Assigned</Text>
            <Text className='text-[14px] font-[700] text-gray-700'>
              {item.quantity} t
            </Text>
          </View>
        </View>

        {/* Order info */}
        {item.trackingId ? (
          <View className='flex-row gap-4 mb-3 pb-3 border-b border-gray-50'>
            <View className='flex-row items-center gap-1.5'>
              <ClipboardCheck size={12} color='#A7CC48' />
              <Text className='text-[11px] text-gray-500'>
                #{item.trackingId}
              </Text>
            </View>
            {item.edd ? (
              <View className='flex-row items-center gap-1.5'>
                <Calendar size={12} color='#A7CC48' />
                <Text className='text-[11px] text-gray-500'>{item.edd}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Upload details */}
        {item.uploadedCommodityId ? (
          <View className='bg-gray-50 rounded-xl p-3 mb-3 gap-1.5'>
            <Text className='text-[10px] font-[700] text-gray-400 uppercase tracking-wide mb-1'>
              Upload Details
            </Text>
            <View className='flex-row justify-between'>
              <Text className='text-[12px] text-gray-400'>Uploaded Qty</Text>
              <Text className='text-[12px] font-[600] text-gray-700'>
                {item.uploadedQuantity} tonnes
              </Text>
            </View>
            {item.uploadedPrice ? (
              <View className='flex-row justify-between'>
                <Text className='text-[12px] text-gray-400'>Price / Tonne</Text>
                <Text className='text-[12px] font-[600] text-gray-700'>
                  ₦{item.uploadedPrice.toLocaleString()}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

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

const GemFarmerDetail = ({ navigation, route }) => {
  const farmer = route.params?.farmer ?? {};
  const avatarBg =
    AVATAR_COLORS[parseInt(farmer.id ?? "0") % AVATAR_COLORS.length];

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchAssignments = useCallback(async () => {
    if (!farmer.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(
        `/gem-excite/assigned-requests?farmerId=${farmer.id}`,
      );
      const data = res.data.data ?? {};

      // Check if user is assigned to cluster
      if (!data.isAssignedToCluster) {
        setAssignments([]);
        setError(
          data.message || "You have not been assigned to a cluster yet.",
        );
      } else {
        const raw = data.assignments ?? [];
        const mapped = raw.map((a) => ({
          id: a._id,
          commodityName:
            a.commodityName ?? a.request?.sourceId?.commodityName ?? "—",
          quantity: a.quantity ?? 0,
          status: a.status,
          trackingId: a.request?.order?.trackingId ?? null,
          edd: a.request?.order?.estimatedDeliveryDate
            ? new Date(
                a.request.order.estimatedDeliveryDate,
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : null,
          assignedDate: a.createdAt
            ? new Date(a.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—",
          uploadedCommodityId: a.uploadedCommodity?._id ?? null,
          uploadedQuantity: a.uploadedCommodity?.quantity ?? null,
          uploadedPrice: a.uploadedCommodity?.pricePerTonne ?? null,
        }));
        setAssignments(mapped);
      }
    } catch {
      setError("Failed to load assignments. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, [farmer.id]);

  useFocusEffect(
    useCallback(() => {
      fetchAssignments();
    }, [fetchAssignments]),
  );

  const filtered =
    activeFilter === "all"
      ? assignments
      : assignments.filter((a) => a.status === activeFilter);

  const currentOrders = filtered.filter((a) => !PAST_STATUSES.has(a.status));
  const pastOrders = filtered.filter((a) => PAST_STATUSES.has(a.status));

  const handleReview = (uploadedCommodityId) => {
    navigation.navigate("GemQualityControl", { uploadedCommodityId });
  };

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />

      {/* Header */}
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <View className='flex-row items-center gap-3'>
          <TouchableOpacity
            className='w-9 h-9 rounded-full bg-gray-100 items-center justify-center'
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={18} color='#374151' />
          </TouchableOpacity>
          <Text className='text-[19px] font-[700] text-gray-800'>
            Farmer Details
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        ListHeaderComponent={
          <>
            {/* Profile card */}
            <View
              className='bg-white rounded-2xl p-5 mt-4'
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 8,
              }}
            >
              <View className='flex-row items-center mb-4'>
                <View
                  className='w-16 h-16 rounded-full items-center justify-center mr-4'
                  style={{ backgroundColor: avatarBg }}
                >
                  <Text className='text-[20px] font-[800] text-gray-700'>
                    {getInitials(farmer.name ?? "")}
                  </Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-[18px] font-[700] text-gray-800'>
                    {farmer.name || "—"}
                  </Text>
                  <View
                    className='flex-row items-center self-start mt-1 px-2 py-0.5 rounded-full'
                    style={{
                      backgroundColor:
                        farmer.status === "Active" ? "#DCFCE7" : "#FFF7ED",
                    }}
                  >
                    <Text
                      className='text-[11px] font-[700] uppercase'
                      style={{
                        color:
                          farmer.status === "Active" ? "#15803D" : "#D97706",
                      }}
                    >
                      {farmer.status || "Pending"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className='bg-gray-50 rounded-xl p-4 gap-3'>
                {farmer.commodity ? (
                  <View className='flex-row items-center gap-3'>
                    <Package size={14} color='#A7CC48' />
                    <Text className='text-[12px] text-gray-400 w-24'>
                      Commodity
                    </Text>
                    <Text className='text-[13px] font-[600] text-gray-700 flex-1'>
                      {farmer.commodity}
                    </Text>
                  </View>
                ) : null}
                {farmer.capacity ? (
                  <View className='flex-row items-center gap-3'>
                    <BarChart3 size={14} color='#A7CC48' />
                    <Text className='text-[12px] text-gray-400 w-24'>
                      Farm Capacity
                    </Text>
                    <Text className='text-[13px] font-[600] text-gray-700 flex-1'>
                      {farmer.capacity}
                    </Text>
                  </View>
                ) : null}
                {farmer.location ? (
                  <View className='flex-row items-center gap-3'>
                    <MapPin size={14} color='#A7CC48' />
                    <Text className='text-[12px] text-gray-400 w-24'>
                      Location
                    </Text>
                    <Text className='text-[13px] font-[600] text-gray-700 flex-1'>
                      {farmer.location}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Contact */}
            <View
              className='bg-white rounded-2xl p-4 mt-4'
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
              }}
            >
              <View className='flex-row gap-3'>
                <TouchableOpacity
                  className='flex-1 flex-row items-center justify-center gap-2 border border-gray-200 rounded-xl py-3'
                  activeOpacity={0.7}
                >
                  <PhoneCall size={15} color='#A7CC48' />
                  <Text className='text-[13px] font-[600] text-gray-700'>
                    Call
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='flex-1 flex-row items-center justify-center gap-2 bg-[#A7CC48] rounded-xl py-3'
                  activeOpacity={0.85}
                >
                  <Mail size={15} color='#fff' />
                  <Text className='text-[13px] font-[700] text-white'>
                    Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Assigned Orders header + filters */}
            <View className='mt-5 mb-3'>
              <View className='flex-row items-center justify-between mb-3'>
                <Text className='text-[16px] font-[700] text-gray-800'>
                  Assigned Orders
                </Text>
                <Text className='text-[12px] text-gray-400'>
                  {assignments.length} total
                </Text>
              </View>

              {/* Filter pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {FILTERS.map((f) => (
                  <TouchableOpacity
                    key={f.key}
                    className='px-3 py-1.5 rounded-full border'
                    style={{
                      backgroundColor:
                        activeFilter === f.key ? "#A7CC48" : "#fff",
                      borderColor:
                        activeFilter === f.key ? "#A7CC48" : "#E5E7EB",
                    }}
                    activeOpacity={0.7}
                    onPress={() => setActiveFilter(f.key)}
                  >
                    <Text
                      className='text-[12px] font-[600]'
                      style={{
                        color: activeFilter === f.key ? "#fff" : "#6B7280",
                      }}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {loading ? (
              <ActivityIndicator
                size='small'
                color='#A7CC48'
                style={{ marginTop: 24 }}
              />
            ) : error ? (
              error.includes("not been assigned to a cluster") ? (
                <View className='items-center py-10 px-6'>
                  <View className='w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-6'>
                    <Package size={32} color='#9CA3AF' />
                  </View>
                  <Text className='text-[18px] font-[700] text-gray-800 text-center mb-2'>
                    Cluster Assignment Pending
                  </Text>
                  <Text className='text-[14px] text-gray-500 text-center leading-5 mb-6'>
                    {error}
                  </Text>
                  <TouchableOpacity
                    className='bg-[#A7CC48] rounded-xl px-6 py-3'
                    activeOpacity={0.8}
                    onPress={fetchAssignments}
                  >
                    <Text className='text-[14px] font-[600] text-white'>
                      Check Status
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className='items-center mt-6'
                  activeOpacity={0.7}
                  onPress={fetchAssignments}
                >
                  <Text className='text-[13px] text-red-400'>{error}</Text>
                </TouchableOpacity>
              )
            ) : filtered.length === 0 ? (
              <View className='items-center py-10'>
                <Package size={32} color='#D1D5DB' />
                <Text className='text-[14px] font-[600] text-gray-400 mt-3'>
                  {activeFilter === "all"
                    ? "No orders assigned yet"
                    : "No orders with this status"}
                </Text>
              </View>
            ) : currentOrders.length > 0 ? (
              <Text className='text-[12px] font-[700] text-gray-400 uppercase tracking-wide mb-2'>
                Current
              </Text>
            ) : null}
          </>
        }
        renderItem={({ item }) => {
          if (PAST_STATUSES.has(item.status)) return null;
          return <AssignmentCard item={item} onReview={handleReview} />;
        }}
        ListFooterComponent={
          !loading && !error && pastOrders.length > 0 ? (
            <>
              <Text className='text-[12px] font-[700] text-gray-400 uppercase tracking-wide mb-2 mt-2'>
                Past Orders
              </Text>
              {pastOrders.map((item) => (
                <AssignmentCard
                  key={item.id}
                  item={item}
                  onReview={handleReview}
                />
              ))}
            </>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default GemFarmerDetail;
