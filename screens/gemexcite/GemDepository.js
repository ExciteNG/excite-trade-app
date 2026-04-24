/** @format */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Warehouse,
  Package,
  Calendar,
  Hash,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import api from "../../services/api";

const GemDepository = () => {
  const [clearedOpen, setClearedOpen] = useState(true);
  const [storageOpen, setStorageOpen] = useState(true);
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        "/gem-excite/cluster/uploaded-commodities",
      );
      const data = response.data.data ?? {};

      // Check if user is assigned to cluster
      if (!data.isAssignedToCluster) {
        setCommodities([]);
        setError(
          data.message || "You have not been assigned to a cluster yet.",
        );
      } else {
        setCommodities(data.commodities ?? []);
      }
    } catch (err) {
      setError("Failed to load depository. Tap to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  // Cleared = passed quality check; storage = all others
  const clearedOrders = commodities.filter(
    (c) => c.status === "passed-quality-check",
  );
  const storageEntries = commodities.filter(
    (c) => c.status !== "passed-quality-check",
  );

  const totalQuantity = commodities.reduce(
    (sum, c) => sum + (c.quantity ?? 0),
    0,
  );

  const renderClearedRow = ({ item }) => (
    <View className='flex-row items-center py-3 border-b border-gray-50'>
      <View className='flex-1'>
        <Text className='text-[13px] font-[600] text-gray-800'>
          {item.commodity}
        </Text>
        <Text className='text-[11px] text-gray-400 mt-0.5'>
          {item.quantity} {item.quantityUnits ?? "tonnes"}
        </Text>
      </View>
      <View className='items-end'>
        <Text className='text-[11px] font-[600] text-gray-600'>
          {item._id?.slice(-6)?.toUpperCase()}
        </Text>
        <View className='bg-amber-100 px-2 py-0.5 rounded-full mt-0.5'>
          <Text className='text-[10px] font-[700] text-amber-700'>Cleared</Text>
        </View>
      </View>
    </View>
  );

  const renderStorageRow = ({ item }) => {
    const dateStr = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";
    return (
      <View
        className='bg-white border border-gray-100 rounded-2xl p-4 mb-3'
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 3,
        }}
      >
        <View className='flex-row items-center mb-3'>
          <View className='w-10 h-10 rounded-xl bg-[#F0FDF4] items-center justify-center mr-3'>
            <Package size={18} color='#A7CC48' />
          </View>
          <View className='flex-1'>
            <Text className='text-[14px] font-[700] text-gray-800'>
              {item.commodity}
            </Text>
            <Text className='text-[11px] text-gray-400'>
              {item.quantity} {item.quantityUnits ?? "tonnes"}
            </Text>
          </View>
        </View>
        <View className='bg-gray-50 rounded-xl p-3 gap-1.5'>
          <View className='flex-row items-center gap-2'>
            <Hash size={11} color='#9CA3AF' />
            <Text className='text-[11px] text-gray-400 w-20'>Batch ID</Text>
            <Text className='text-[11px] font-[600] text-gray-600'>
              {item._id?.slice(-8)?.toUpperCase()}
            </Text>
          </View>
          <View className='flex-row items-center gap-2'>
            <Calendar size={11} color='#9CA3AF' />
            <Text className='text-[11px] text-gray-400 w-20'>Date Arrived</Text>
            <Text className='text-[11px] font-[600] text-gray-600'>
              {dateStr}
            </Text>
          </View>
          <View className='flex-row items-center gap-2'>
            <Warehouse size={11} color='#9CA3AF' />
            <Text className='text-[11px] text-gray-400 w-20'>Status</Text>
            <Text className='text-[11px] font-[600] text-gray-600'>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        edges={["top"]}
        className='flex-1 bg-gray-50 items-center justify-center'
      >
        <ActivityIndicator size='small' color='#A7CC48' />
      </SafeAreaView>
    );
  }

  if (error) {
    const isClusterError = error.includes("not been assigned to a cluster");
    return (
      <SafeAreaView
        edges={["top"]}
        className='flex-1 bg-gray-50 items-center justify-center px-6'
      >
        {isClusterError ? (
          <>
            <View className='w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-6'>
              <Warehouse size={32} color='#9CA3AF' />
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
              onPress={fetchData}
            >
              <Text className='text-[14px] font-[600] text-white'>
                Check Status
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={fetchData} activeOpacity={0.7}>
            <Text className='text-[13px] text-red-400'>{error}</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      {/* Header */}
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <Text className='text-[19px] font-[700] text-gray-800'>Depository</Text>
        <Text className='text-[13px] text-gray-400 mt-0.5'>
          Storage inventory overview
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Total storage hero */}
        <View className='mx-4 mt-4 bg-gray-800 rounded-2xl p-6 items-center overflow-hidden'>
          <View
            className='absolute w-40 h-40 rounded-full bg-white opacity-5'
            style={{ top: -20, right: -20 }}
          />
          <Warehouse size={32} color='#A7CC48' />
          <Text className='text-[11px] font-[600] text-gray-400 uppercase tracking-widest mt-3'>
            Total In Storage
          </Text>
          <Text className='text-[40px] font-[800] text-white mt-1'>
            {totalQuantity.toLocaleString()}
          </Text>
          <Text className='text-[14px] text-gray-400 font-[500]'>Tonnes</Text>
          <View className='flex-row gap-6 mt-4 pt-4 border-t border-gray-700 w-full justify-center'>
            <View className='items-center'>
              <Text className='text-[11px] text-gray-400'>Cleared</Text>
              <Text className='text-[16px] font-[700] text-[#A7CC48]'>
                {clearedOrders.length}
              </Text>
            </View>
            <View className='w-px bg-gray-700' />
            <View className='items-center'>
              <Text className='text-[11px] text-gray-400'>Entries</Text>
              <Text className='text-[16px] font-[700] text-[#A7CC48]'>
                {storageEntries.length}
              </Text>
            </View>
            <View className='w-px bg-gray-700' />
            <View className='items-center'>
              <Text className='text-[11px] text-gray-400'>Total</Text>
              <Text className='text-[16px] font-[700] text-[#A7CC48]'>
                {commodities.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Cleared Orders */}
        <View className='mx-4 mt-4'>
          <TouchableOpacity
            className='flex-row items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-4'
            style={
              !clearedOpen
                ? {}
                : {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    borderBottomWidth: 0,
                  }
            }
            activeOpacity={0.8}
            onPress={() => setClearedOpen((v) => !v)}
          >
            <View className='flex-row items-center gap-2'>
              <Layers size={16} color='#A7CC48' />
              <Text className='text-[14px] font-[700] text-gray-800'>
                Cleared Orders
              </Text>
              <View className='bg-[#A7CC48] w-5 h-5 rounded-full items-center justify-center'>
                <Text className='text-[10px] font-[700] text-white'>
                  {clearedOrders.length}
                </Text>
              </View>
            </View>
            {clearedOpen ? (
              <ChevronUp size={17} color='#9CA3AF' />
            ) : (
              <ChevronDown size={17} color='#9CA3AF' />
            )}
          </TouchableOpacity>

          {clearedOpen && (
            <View className='bg-white border border-gray-100 rounded-b-2xl px-4 pb-2'>
              <FlatList
                data={clearedOrders}
                keyExtractor={(item) => item._id}
                renderItem={renderClearedRow}
                scrollEnabled={false}
                ListEmptyComponent={
                  <View className='py-4 items-center'>
                    <Text className='text-[12px] text-gray-400'>
                      No cleared orders
                    </Text>
                  </View>
                }
              />
            </View>
          )}
        </View>

        {/* Storage Entries */}
        <View className='mx-4 mt-4 mb-8'>
          <TouchableOpacity
            className='flex-row items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-4 mb-3'
            activeOpacity={0.8}
            onPress={() => setStorageOpen((v) => !v)}
          >
            <View className='flex-row items-center gap-2'>
              <Package size={16} color='#A7CC48' />
              <Text className='text-[14px] font-[700] text-gray-800'>
                Storage Entries
              </Text>
              <View className='bg-[#A7CC48] w-5 h-5 rounded-full items-center justify-center'>
                <Text className='text-[10px] font-[700] text-white'>
                  {storageEntries.length}
                </Text>
              </View>
            </View>
            {storageOpen ? (
              <ChevronUp size={17} color='#9CA3AF' />
            ) : (
              <ChevronDown size={17} color='#9CA3AF' />
            )}
          </TouchableOpacity>

          {storageOpen && (
            <FlatList
              data={storageEntries}
              keyExtractor={(item) => item._id}
              renderItem={renderStorageRow}
              scrollEnabled={false}
              ListEmptyComponent={
                <View className='py-4 items-center'>
                  <Text className='text-[12px] text-gray-400'>
                    No storage entries
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GemDepository;
