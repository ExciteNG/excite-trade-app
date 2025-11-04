/** @format */
import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from "react-native";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react-native";

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      status: "success",
      title: "",
      message: "",
    };
    this.translateY = new Animated.Value(-100);
  }

  show = ({ status, title, message }) => {
    this.setState({ visible: true, status, title, message }, () => {
      Animated.spring(this.translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      // Auto hide after 3 seconds
      this.hideTimeout = setTimeout(this.hide, 2300);
    });
  };

  hide = () => {
    Animated.spring(this.translateY, {
      toValue: -100,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ visible: false });
    });
  };

  componentWillUnmount() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  render() {
    if (!this.state.visible) return null;

    const { status, title, message } = this.state;
    const { bgColor, iconColor, Icon, borderColor } =
      this.getStatusStyles(status);

    return (
      <SafeAreaView style={{ zIndex: 99 }}>
        <Animated.View
          className={`absolute z-[900] top-0 left-0 right-0 mx-4 mt-4 rounded-lg ${borderColor} ${bgColor}`}
          style={{ transform: [{ translateY: this.translateY }] }}
        >
          <View className="flex-row items-center p-4">
            <Icon size={24} color={iconColor} />
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-gray-900">{title}</Text>
              <Text className="text-sm text-gray-600 mt-1">{message}</Text>
            </View>
            <TouchableOpacity onPress={this.hide} className="ml-4">
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  getStatusStyles(status) {
    switch (status) {
      case "success":
        return {
          bgColor: "bg-green-50",
          borderColor: "border border-green-300",
          iconColor: "#22c55e",
          Icon: CheckCircle,
        };
      case "error":
        return {
          bgColor: "bg-red-50",
          borderColor: "border border-red-300",
          iconColor: "#ef4444",
          Icon: XCircle,
        };
      case "warning":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border border-yellow-300",
          iconColor: "#f59e0b",
          Icon: AlertTriangle,
        };
      default:
        return {
          bgColor: "bg-green-50",
          borderColor: "border border-green-300",
          iconColor: "#22c55e",
          Icon: CheckCircle,
        };
    }
  }
}

const toast = {
  ref: null,
  show(config) {
    if (this.ref) {
      this.ref.show(config);
    }
  },
};

export { Toast, toast };
