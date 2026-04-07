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
import { ArrowLeft, Bell, CheckCheck, Circle } from "lucide-react-native";
import api from "../../services/api";

const NotificationItem = ({ item, onPress }) => {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "Just now";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="flex-row items-start bg-white border border-gray-100 rounded-2xl mx-4 mb-3 p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      }}
    >
      {/* Unread indicator dot */}
      <View className="mt-1 mr-3 items-center">
        {item.read ? (
          <View className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        ) : (
          <View className="w-2.5 h-2.5 rounded-full bg-[#A7CC48]" />
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <Text
            className="text-[13px] font-[700] text-gray-800 flex-1 mr-2"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="text-[10px] text-gray-400 mt-0.5">
            {timeAgo(item.createdAt)}
          </Text>
        </View>
        <Text className="text-[12px] text-gray-500 mt-1 leading-4">
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.data ?? []);
    } catch {
      setError("Failed to load notifications. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchNotifications(); }, [fetchNotifications]));

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silently ignore — UI already updated optimistically
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // silently ignore
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 pt-2 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#374151" />
            </TouchableOpacity>
            <View>
              <Text className="text-[19px] font-[700] text-gray-800">
                Notifications
              </Text>
              <Text className="text-[12px] text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </Text>
            </View>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              disabled={markingAll}
              activeOpacity={0.7}
              className="flex-row items-center gap-1"
            >
              {markingAll ? (
                <ActivityIndicator size="small" color="#A7CC48" />
              ) : (
                <>
                  <CheckCheck size={14} color="#A7CC48" />
                  <Text className="text-[12px] font-[600] text-[#A7CC48]">
                    Mark all read
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="small"
          color="#A7CC48"
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <TouchableOpacity
          style={{ alignItems: "center", marginTop: 40 }}
          onPress={fetchNotifications}
          activeOpacity={0.7}
        >
          <Text className="text-[13px] text-red-400">{error}</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={() => !item.read && markAsRead(item._id)}
            />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3">
                <Bell size={28} color="#D1D5DB" />
              </View>
              <Text className="text-[14px] font-[600] text-gray-400">
                No notifications yet
              </Text>
              <Text className="text-[12px] text-gray-400 mt-1">
                We'll notify you when something happens
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;
