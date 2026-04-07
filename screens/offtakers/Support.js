/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";
import { ArrowLeft } from "lucide-react-native";

const Support = ({ navigation }) => {
  const helpResources = [
    { label: "User Guide", url: "https://yourdomain.com/user-guide" },
    { label: "Shipping Policy", url: "https://yourdomain.com/shipping-policy" },
    { label: "Return Policy", url: "https://yourdomain.com/return-policy" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>Support</Text> */}
      {/* header */}
      <View className="flex-row items-center w-full mt-2 mb-2 ">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation?.goBack && navigation.goBack()}
          className="p-1 rounded-full"
        >
          <ArrowLeft size={24} color={"black"} />
        </TouchableOpacity>
        <Text className="text-[16px] font-[600] ml-3">My Account</Text>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Ionicons
            name="help-circle-outline"
            size={24}
            color="#222"
            style={styles.icon}
          />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Frequently Asked Questions</Text>
            <Text style={styles.itemSubtitle}>
              Find answers to common questions
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.item, styles.liveChat]}>
          <MaterialIcons
            name="chat"
            size={24}
            color="#222"
            style={styles.icon}
          />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Live Chat</Text>
            <Text style={styles.itemSubtitle}>Chat with our support team</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Ionicons
            name="call-outline"
            size={24}
            color="#222"
            style={styles.icon}
          />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Contact us</Text>
            <Text style={styles.itemSubtitle}>
              Email or call our support team
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <MaterialIcons
            name="report-problem"
            size={24}
            color="#222"
            style={styles.icon}
          />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Report an Issue</Text>
            <Text style={styles.itemSubtitle}>
              Let us know about any problems
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.helpHeader}>Help Resources</Text>
      <View style={styles.helpSection}>
        {helpResources.map((resource, idx) => (
          <TouchableOpacity
            key={resource.label}
            style={styles.helpItem}
            onPress={() => Linking.openURL(resource.url)}
          >
            <MaterialIcons
              name="description"
              size={22}
              color="#222"
              style={styles.helpIcon}
            />
            <Text style={styles.helpText}>{resource.label}</Text>
            <MaterialIcons
              name="open-in-new"
              size={18}
              color="#888"
              style={styles.externalIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#222",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 24,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  liveChat: {
    backgroundColor: "#B7D86F",
    borderRadius: 8,
    marginVertical: 4,
  },
  icon: {
    marginRight: 14,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  helpHeader: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  helpSection: {
    marginBottom: 32,
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  helpIcon: {
    marginRight: 10,
  },
  helpText: {
    fontSize: 15,
    color: "#222",
    flex: 1,
  },
  externalIcon: {
    marginLeft: 8,
  },
});

export default Support;
