/** @format */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import {
  User,
  ShoppingBag,
  Search,
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  HelpCircle,
  Shield,
  Briefcase,
} from "lucide-react-native";

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      {
        key: "MyOrders",
        label: "My Orders",
        sub: "View and track orders",
        Icon: ShoppingBag,
        iconBg: "#EFF6FF",
        iconColor: "#3B82F6",
      },
      {
        key: "ExploreClusters",
        label: "Explore Clusters",
        sub: "Browse available clusters",
        Icon: Search,
        iconBg: "#F0FDF4",
        iconColor: "#22C55E",
      },
    ],
  },
  {
    title: "Manage",
    items: [
      {
        key: "OfftakerSettings",
        label: "Profile & Settings",
        sub: "Edit your details",
        Icon: Settings,
        iconBg: "#F5F3FF",
        iconColor: "#8B5CF6",
      },
      {
        key: "Notifications",
        label: "Notifications",
        sub: "Alert preferences",
        Icon: Bell,
        iconBg: "#FFF7ED",
        iconColor: "#F97316",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        key: "Help",
        label: "Help & Support",
        sub: "FAQs and contact",
        Icon: HelpCircle,
        iconBg: "#F8FAFC",
        iconColor: "#64748B",
      },
      {
        key: "Privacy",
        label: "Privacy Policy",
        sub: "How we use your data",
        Icon: Shield,
        iconBg: "#F8FAFC",
        iconColor: "#64748B",
      },
    ],
  },
];

const MenuItem = ({ item, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center px-4 py-3.5 bg-white"
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View
      className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
      style={{ backgroundColor: item.iconBg }}
    >
      <item.Icon size={18} color={item.iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-[14px] font-[600] text-gray-800">{item.label}</Text>
      <Text className="text-[11px] text-gray-400 mt-0.5">{item.sub}</Text>
    </View>
    <ChevronRight size={16} color="#D1D5DB" />
  </TouchableOpacity>
);

const OfftakerProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const [logoutModal, setLogoutModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem("userInfo");
        if (raw) setUserInfo(JSON.parse(raw));
      } catch {
        // Silently ignore
      }
    };
    loadUser();
  }, []);

  const fullName = userInfo
    ? `${userInfo.name?.firstName ?? ""} ${userInfo.name?.lastName ?? ""}`.trim()
    : "";
  const email = userInfo?.email ?? "";
  const companyName = userInfo?.profile?.companyName ?? "—";
  const status = userInfo?.status ?? "Pending";

  const handleNavigate = (key) => {
    if (key === "Notifications" || key === "Help" || key === "Privacy") return;
    if (key === "MyOrders") {
      navigation.navigate("OrdersStack", { screen: "Orders" });
      return;
    }
    if (key === "ExploreClusters") {
      navigation.navigate("ExploreStack", { screen: "Explore" });
      return;
    }
    navigation.navigate(key);
  };

  const handleLogout = async () => {
    setLogoutModal(false);
    await AsyncStorage.removeItem("userInfo");
    await AsyncStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      {/* Header */}
      <View className="px-4 pt-2 pb-4 bg-white border-b border-gray-100">
        <Text className="text-[19px] font-[700] text-gray-800">Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View
          className="mx-4 mt-4 bg-white rounded-2xl p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
          }}
        >
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-[#EFF6FF] border-2 border-[#A7CC48] items-center justify-center mr-4">
              <User size={28} color="#A7CC48" />
            </View>
            <View className="flex-1">
              <Text className="text-[17px] font-[700] text-gray-800">
                {fullName || "—"}
              </Text>
              <Text className="text-[12px] text-gray-400 mt-0.5">{email}</Text>
              <View className="flex-row items-center gap-1.5 mt-1.5">
                <View className="bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <Briefcase size={10} color="#3B82F6" />
                  <Text className="text-[10px] font-[700] text-blue-700">
                    Offtaker
                  </Text>
                </View>
                <View className="bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] font-[700] text-green-700">
                    {status}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats strip */}
          <View className="flex-row mt-4 pt-4 border-t border-gray-50 gap-0">
            {[
              { label: "Company", value: companyName },
              { label: "Status", value: status },
            ].map((stat, i, arr) => (
              <View
                key={stat.label}
                className="flex-1 items-center"
                style={
                  i < arr.length - 1
                    ? { borderRightWidth: 1, borderRightColor: "#F3F4F6" }
                    : {}
                }
              >
                <Text
                  className="text-[14px] font-[800] text-gray-800"
                  numberOfLines={1}
                >
                  {stat.value}
                </Text>
                <Text className="text-[10px] text-gray-400 mt-0.5">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} className="mx-4 mt-4">
            <Text className="text-[11px] font-[700] text-gray-400 uppercase tracking-widest mb-2 px-1">
              {section.title}
            </Text>
            <View
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
              }}
            >
              {section.items.map((item, index) => (
                <View key={item.key}>
                  {index > 0 && <View className="h-px bg-gray-50 ml-16" />}
                  <MenuItem
                    item={item}
                    onPress={() => handleNavigate(item.key)}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <View className="mx-4 mt-6 mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 border border-red-200 bg-red-50 rounded-2xl py-4"
            activeOpacity={0.8}
            onPress={() => setLogoutModal(true)}
          >
            <LogOut size={17} color="#EF4444" />
            <Text className="text-[14px] font-[700] text-red-500">Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* App version */}
        <View className="items-center pb-8">
          <View className="flex-row items-center gap-1.5">
            <Image
              source={require("../../assets/icon.png")}
              style={{ width: 14, height: 14, borderRadius: 3 }}
              resizeMode="contain"
            />
            <Text className="text-[11px] text-gray-400">
              excitetrade v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Logout confirmation modal */}
      <Modal visible={logoutModal} transparent animationType="fade">
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <View className="bg-white rounded-3xl p-6 w-full">
            <View className="items-center mb-4">
              <View className="w-14 h-14 rounded-full bg-red-50 items-center justify-center mb-3">
                <LogOut size={26} color="#EF4444" />
              </View>
              <Text className="text-[17px] font-[700] text-gray-800">
                Log Out?
              </Text>
              <Text className="text-[13px] text-gray-400 text-center mt-1.5 leading-5">
                You'll need to sign in again to access your account.
              </Text>
            </View>
            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                className="flex-1 border border-gray-200 rounded-2xl py-4 items-center"
                activeOpacity={0.7}
                onPress={() => setLogoutModal(false)}
              >
                <Text className="text-[13px] font-[600] text-gray-600">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-2xl py-4 items-center"
                activeOpacity={0.85}
                onPress={handleLogout}
              >
                <Text className="text-[13px] font-[700] text-white">
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OfftakerProfile;
