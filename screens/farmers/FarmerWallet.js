/** @format */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  ChevronDown,
  CheckCircle,
  X,
  Shield,
} from "lucide-react-native";
import api from "../../services/api";

const BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank",
  "Guaranty Trust Bank",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "Union Bank",
  "United Bank for Africa",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

const FarmerWallet = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [bankPickerVisible, setBankPickerVisible] = useState(false);
  const [bank, setBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [country] = useState("Nigeria");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(true);

  useEffect(() => {
    const prefill = async () => {
      try {
        const response = await api.get("/farmer/wallet");
        const wallet = response.data.data;
        if (wallet?.bankName) {
          setBank(wallet.bankName);
          setAccountName(wallet.accountName ?? "");
          setAccountNumber(wallet.accountNumber ?? "");
          setSelectedType("personal");
        }
      } catch {
        // No wallet saved yet — leave form empty
      } finally {
        setPrefilling(false);
      }
    };
    prefill();
  }, []);

  const isFormValid = bank && accountName && accountNumber.length === 10;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);
    try {
      await api.post("/farmer/wallet", {
        bankName: bank,
        accountName,
        accountNumber,
      });
      setSubmitted(true);
    } catch (err) {
      alert(
        err?.response?.data?.message ?? "Failed to save wallet. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (prefilling) {
    return (
      <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50 items-center justify-center'>
        <ActivityIndicator size='small' color='#A7CC48' />
      </SafeAreaView>
    );
  }

  if (submitted) {
    return (
      <SafeAreaView
        edges={["top"]}
        className='flex-1 bg-white items-center justify-center px-8'
      >
        <View className='w-20 h-20 rounded-full bg-[#F0FDF4] items-center justify-center mb-5'>
          <CheckCircle size={40} color='#22C55E' />
        </View>
        <Text className='text-[20px] font-[700] text-gray-800 text-center'>
          Account Registered!
        </Text>
        <Text className='text-[13px] text-gray-400 text-center mt-2 leading-5'>
          Your bank account has been linked. Payments will be processed to this
          account.
        </Text>
        <TouchableOpacity
          className='bg-[#A7CC48] rounded-2xl px-8 py-4 mt-8 w-full items-center'
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text className='font-[700] text-[14px] text-white'>Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      {/* Header */}
      <View className='px-4 pt-2 pb-4 bg-white border-b border-gray-100'>
        <View className='flex-row items-center gap-3'>
          <TouchableOpacity
            className='w-9 h-9 rounded-full bg-gray-100 items-center justify-center'
            activeOpacity={0.7}
            onPress={() =>
              selectedType ? setSelectedType(null) : navigation.goBack()
            }
          >
            <ArrowLeft size={18} color='#374151' />
          </TouchableOpacity>
          <View>
            <Text className='text-[19px] font-[700] text-gray-800'>
              My Wallet
            </Text>
            <Text className='text-[13px] text-gray-400'>
              Register your payout account
            </Text>
          </View>
        </View>
      </View>

      {!selectedType ? (
        /* Type selection */
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='px-4 pt-6 pb-10'>
            <Text className='text-[14px] text-gray-500 mb-6 leading-5'>
              Choose how you'd like to receive your payments from commodity
              sales.
            </Text>

            {/* Personal Account */}
            <TouchableOpacity
              className='bg-white border-2 rounded-2xl p-5 mb-4'
              style={{ borderColor: "#A7CC48" }}
              activeOpacity={0.85}
              onPress={() => setSelectedType("personal")}
            >
              <View className='flex-row items-center mb-3'>
                <View className='w-12 h-12 rounded-2xl bg-[#F0FDF4] items-center justify-center mr-3'>
                  <CreditCard size={22} color='#A7CC48' />
                </View>
                <View className='flex-1'>
                  <Text className='text-[15px] font-[700] text-gray-800'>
                    Personal Account
                  </Text>
                  <Text className='text-[12px] text-gray-400 mt-0.5'>
                    Direct bank account registration
                  </Text>
                </View>
              </View>
              <Text className='text-[12px] text-gray-500 leading-4'>
                Register your personal bank account to receive direct payments
                when your commodities are sold.
              </Text>
            </TouchableOpacity>

            {/* Mutual Benefit */}
            <View className='bg-white border border-gray-200 rounded-2xl p-5 opacity-60'>
              <View className='flex-row items-center mb-3'>
                <View className='w-12 h-12 rounded-2xl bg-gray-100 items-center justify-center mr-3'>
                  <Building2 size={22} color='#9CA3AF' />
                </View>
                <View className='flex-1'>
                  <Text className='text-[15px] font-[700] text-gray-700'>
                    Mutual Benefit Assurance
                  </Text>
                  <View className='flex-row items-center gap-1 mt-0.5'>
                    <Text className='text-[11px] text-gray-400'>
                      Coming soon
                    </Text>
                    <View className='bg-purple-100 px-2 py-0.5 rounded-full'>
                      <Text className='text-[10px] font-[600] text-purple-600'>
                        Beta
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text className='text-[12px] text-gray-400 leading-4'>
                MFB integration for cooperative-based payments. Available soon.
              </Text>
            </View>

            {/* Security note */}
            <View className='flex-row items-start mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4'>
              <Shield size={16} color='#3B82F6' style={{ marginTop: 1 }} />
              <Text className='text-[12px] text-blue-600 ml-2 flex-1 leading-4'>
                Your banking details are encrypted and secure. We comply with
                CBN financial data protection guidelines.
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        /* Personal account form */
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='px-4 pt-5 pb-10'>
            {/* Bank Name */}
            <View className='mb-4'>
              <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
                Bank Name
              </Text>
              <TouchableOpacity
                className='flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-[50px]'
                activeOpacity={0.8}
                onPress={() => setBankPickerVisible(true)}
              >
                <Text
                  className={`text-[13px] ${bank ? "text-gray-800 font-[500]" : "text-gray-400"}`}
                >
                  {bank || "Select your bank"}
                </Text>
                <ChevronDown size={16} color='#9CA3AF' />
              </TouchableOpacity>
            </View>

            {/* Account Name */}
            <View className='mb-4'>
              <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
                Account Name
              </Text>
              <TextInput
                className='bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800'
                placeholder='Enter account name'
                placeholderTextColor='#9CA3AF'
                value={accountName}
                onChangeText={setAccountName}
                autoCapitalize='words'
              />
            </View>

            {/* Account Number */}
            <View className='mb-4'>
              <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
                Account Number
              </Text>
              <TextInput
                className='bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800'
                placeholder='10-digit account number'
                placeholderTextColor='#9CA3AF'
                keyboardType='numeric'
                maxLength={10}
                value={accountNumber}
                onChangeText={setAccountNumber}
              />
              {accountNumber.length > 0 && accountNumber.length < 10 && (
                <Text className='text-[11px] text-red-400 mt-1 ml-1'>
                  Account number must be 10 digits
                </Text>
              )}
            </View>

            {/* Country */}
            <View className='mb-6'>
              <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
                Country
              </Text>
              <View className='bg-gray-100 border border-gray-200 rounded-xl px-4 h-[50px] justify-center'>
                <Text className='text-[13px] text-gray-500'>{country}</Text>
              </View>
            </View>

            <TouchableOpacity
              className='rounded-2xl h-[52px] items-center justify-center'
              style={{ backgroundColor: isFormValid ? "#A7CC48" : "#E5E7EB" }}
              activeOpacity={isFormValid ? 0.85 : 1}
              onPress={handleSubmit}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Text
                  className='font-[700] text-[14px]'
                  style={{ color: isFormValid ? "#fff" : "#9CA3AF" }}
                >
                  Register Account
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Bank Picker Modal */}
      <Modal visible={bankPickerVisible} transparent animationType='slide'>
        <View
          className='flex-1 justify-end'
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View className='bg-white rounded-t-3xl px-4 pt-4 pb-8'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-[17px] font-[700] text-gray-800'>
                Select Bank
              </Text>
              <TouchableOpacity
                onPress={() => setBankPickerVisible(false)}
                activeOpacity={0.7}
              >
                <X size={20} color='#6B7280' />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ maxHeight: 360 }}
              showsVerticalScrollIndicator={false}
            >
              {BANKS.map((b) => (
                <TouchableOpacity
                  key={b}
                  className='flex-row items-center justify-between py-4 border-b border-gray-50'
                  activeOpacity={0.7}
                  onPress={() => {
                    setBank(b);
                    setBankPickerVisible(false);
                  }}
                >
                  <Text className='text-[14px] text-gray-700 font-[500]'>
                    {b}
                  </Text>
                  {bank === b && <CheckCircle size={16} color='#A7CC48' />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FarmerWallet;
