/** @format */

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from "react-native";
import {
  Heart,
  CheckCircle,
  ChevronDown,
  Search,
  Bell,
} from "lucide-react-native";
import { TextInput } from "react-native-gesture-handler";

const data = [
  {
    id: "1",
    name: "Cassava",
    image: require("../assets/cassava.png"),
    price: "₦35,000.99/tonne",
    cluster: "Cluster name",
    available: true,
  },
  {
    id: "2",
    name: "Cocoa",
    image: require("../assets/cocoa.png"),
    price: "₦35,000.99/tonne",
    cluster: "Cluster name",
    available: true,
  },
  {
    id: "3",
    name: "Sorghum",
    image: require("../assets/full.png"),
    price: "₦35,000.99/tonne",
    cluster: "Cluster name",
    available: true,
  },
  {
    id: "4",
    name: "Diamond",
    image: require("../assets/icon.png"),
    price: "₦35,000.99/tonne",
    cluster: "Cluster name",
    available: true,
  },
  {
    id: "5",
    name: "Groundnut",
    image: require("../assets/groundnut.png"),
    price: "₦35,000.99/tonne",
    cluster: "Cluster name",
    available: true,
  },
  {
    id: "6",
    name: "Cashew",
    image: require("../assets/cashew.png"),
    price: "₦35,000.99/tonne",
    cluster: "Cluster name",
    available: true,
  },
];

const Card = ({ item }) => {
  return (
    <TouchableOpacity className="w-[48%] mb-4" activeOpacity={0.9}>
      <View className="rounded-lg overflow-hidden bg-white shadow-sm">
        <ImageBackground
          source={item.image}
          resizeMode="cover"
          className="h-40 w-full"
        >
          <View className="flex-row justify-end p-2">
            <View className="bg-white/70 rounded-full p-1">
              <Heart size={18} color="#111827" />
            </View>
          </View>
        </ImageBackground>

        <View className="p-3">
          <Text className="text-white absolute top-3 left-3 text-sm font-[600]">
            {item.name}
          </Text>
          <Text className="font-[600] text-[14px] text-gray-900">
            {item.name}
          </Text>
          <Text className="text-[#111827] font-[600]">{item.price}</Text>
          <Text className="text-[#10B981] mt-1">
            {item.available ? "Available" : "Unavailable"}
          </Text>
          <Text className="text-[12px] text-gray-500 mt-1">{item.cluster}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Explore = () => {
  const [filters, setFilters] = useState({
    all: true,
    location: null,
    cluster: null,
    type: null,
  });

  const [openModal, setOpenModal] = useState(null); // 'location' | 'cluster' | 'type' | null

  const locations = ["All locations", "Lagos", "Kano", "Benue"];
  const clusters = ["All clusters", "Cluster name", "Cluster B"];
  const types = ["All types", "Commodity", "Gem", "Mineral"];

  const filteredData = useMemo(() => {
    // start with data
    let items = [...data];

    if (!filters.all) {
      if (filters.location && filters.location !== "All locations") {
        // for example purpose, filter by name includes location (no real mapping)
        items = items.filter((i) => i.name.includes(filters.location[0] || ""));
      }

      if (filters.cluster && filters.cluster !== "All clusters") {
        items = items.filter((i) => i.cluster === filters.cluster);
      }

      if (filters.type && filters.type !== "All types") {
        // mock: filter 'Diamond' as Mineral etc.
        if (filters.type === "Commodity") {
          items = items.filter((i) => i.name !== "Diamond");
        } else if (filters.type === "Mineral") {
          items = items.filter((i) => i.name === "Diamond");
        }
      }
    }

    return items;
  }, [filters]);

  const selectFilter = (key, value) => {
    if (key === "all") {
      setFilters({ all: true, location: null, cluster: null, type: null });
      return;
    }

    setFilters((prev) => ({ ...prev, all: false, [key]: value }));
    setOpenModal(null);
  };

  return (
    <View className="flex-1 bg-white px-2 pt-2">
      <View className="flex-row items-center py-2 px-2 border-b border-gray-300 mb-3  m justify-between">
        <Image
          source={require("../assets/app-icon.png")}
          className="h-[34px] w-[42px]"
        />
        <View className="flex-row items-center p-[6px] border border-gray-400 rounded">
          <Search size={20} className="text-gray-400" />
          <TextInput
            className="text-[13px] p-1 w-[220px]"
            placeholder="Search Products..."
          />
        </View>
        <TouchableOpacity>
          <Bell size={21} />
        </TouchableOpacity>
      </View>
      {/* Filter bar */}
      <View className="flex-row items-center mb-4 space-x-2 px-4">
        <TouchableOpacity
          onPress={() => selectFilter("all", null)}
          className={`px-3 py-2 rounded-md border ${
            filters.all ? "border-[#D1FAE5] bg-[#ECFDF5]" : "border-gray-300"
          }`}
          activeOpacity={0.8}
        >
          <Text
            className={`font-[600] ${
              filters.all ? "text-[#059669]" : "text-gray-700"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-3 py-2 rounded-md border border-gray-300 flex-row items-center"
          onPress={() => setOpenModal("location")}
          activeOpacity={0.8}
        >
          <Text className="text-gray-700">Location</Text>
          <ChevronDown size={16} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          className="px-3 py-2 rounded-md border border-gray-300 flex-row items-center"
          onPress={() => setOpenModal("cluster")}
          activeOpacity={0.8}
        >
          <Text className="text-gray-700">Cluster</Text>
          <ChevronDown size={16} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          className="px-3 py-2 rounded-md border border-gray-300 flex-row items-center"
          onPress={() => setOpenModal("type")}
          activeOpacity={0.8}
        >
          <Text className="text-gray-700">Type</Text>
          <ChevronDown size={16} color="#374151" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Card item={item} />}
      />

      {/* Modals for pickers */}
      <Modal
        visible={openModal === "location"}
        transparent
        animationType="fade"
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setOpenModal(null)}
        >
          <View className="bg-white p-4 rounded-t-xl">
            {locations.map((loc) => (
              <TouchableOpacity
                key={loc}
                onPress={() => selectFilter("location", loc)}
                className="py-3"
              >
                <Text className="text-gray-800">{loc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={openModal === "cluster"} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setOpenModal(null)}
        >
          <View className="bg-white p-4 rounded-t-xl">
            {clusters.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => selectFilter("cluster", c)}
                className="py-3"
              >
                <Text className="text-gray-800">{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={openModal === "type"} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setOpenModal(null)}
        >
          <View className="bg-white p-4 rounded-t-xl">
            {types.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => selectFilter("type", t)}
                className="py-3"
              >
                <Text className="text-gray-800">{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Explore;
