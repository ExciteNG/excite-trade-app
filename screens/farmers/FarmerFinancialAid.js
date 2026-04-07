/** @format */
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react-native";

const TENURE_OPTIONS = [1, 2, 3, 4, 5];
const INTEREST_RATE = 12; // fixed % per annum

const formatNaira = (num) => {
  if (!num) return "₦0";
  return "₦" + Number(num).toLocaleString("en-NG");
};

const FarmerFinancialAid = ({ navigation }) => {
  const [loanAmount, setLoanAmount] = useState("500000");
  const [tenure, setTenure] = useState(2);
  const [eligibilityOpen, setEligibilityOpen] = useState(false);
  const [applyModal, setApplyModal] = useState(false);

  const emi = useMemo(() => {
    const P = parseFloat(loanAmount) || 0;
    const r = INTEREST_RATE / 12 / 100;
    const n = tenure * 12;
    if (P === 0 || n === 0)
      return { monthly: 0, totalInterest: 0, totalPayable: 0 };
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = monthly * n;
    const totalInterest = totalPayable - P;
    return { monthly, totalInterest, totalPayable };
  }, [loanAmount, tenure]);

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
          <View>
            <Text className='text-[19px] font-[700] text-gray-800'>
              Financial Aid
            </Text>
            <Text className='text-[13px] text-gray-400'>
              EMI loan calculator
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero banner */}
        <View className='mx-4 mt-4 bg-gray-800 rounded-2xl p-5 overflow-hidden'>
          <View className='absolute right-0 top-0 w-24 h-24 rounded-full bg-white opacity-5 -mr-6 -mt-6' />
          <TrendingUp size={28} color='#A7CC48' />
          <Text className='text-[18px] font-[700] text-white mt-2'>
            Agricultural Loan
          </Text>
          <Text className='text-[12px] text-gray-400 mt-1 leading-4'>
            Get funding to scale your produce. Competitive rates starting at 12%
            per annum.
          </Text>
        </View>

        {/* Calculator Card */}
        <View
          className='mx-4 mt-4 bg-white rounded-2xl p-5'
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          }}
        >
          <Text className='text-[15px] font-[700] text-gray-800 mb-4'>
            EMI Calculator
          </Text>

          {/* Loan Amount */}
          <View className='mb-5'>
            <Text className='text-[12px] font-[600] text-gray-500 uppercase tracking-wide mb-2'>
              Loan Amount (₦)
            </Text>
            <TextInput
              className='bg-gray-50 border border-gray-200 rounded-xl px-4 h-[50px] text-[16px] font-[600] text-gray-800'
              keyboardType='numeric'
              value={loanAmount}
              onChangeText={(v) => setLoanAmount(v.replace(/[^0-9]/g, ""))}
              placeholder='Enter amount'
              placeholderTextColor='#9CA3AF'
            />
            <Text className='text-[11px] text-gray-400 mt-1'>
              Range: ₦20,000 — ₦10,000,000
            </Text>
          </View>

          {/* Tenure */}
          <View className='mb-5'>
            <Text className='text-[12px] font-[600] text-gray-500 uppercase tracking-wide mb-2'>
              Tenure (Years)
            </Text>
            <View className='flex-row gap-2'>
              {TENURE_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t}
                  className='flex-1 h-[44px] rounded-xl items-center justify-center'
                  style={{
                    backgroundColor: tenure === t ? "#A7CC48" : "#F3F4F6",
                  }}
                  activeOpacity={0.8}
                  onPress={() => setTenure(t)}
                >
                  <Text
                    className='text-[13px] font-[700]'
                    style={{ color: tenure === t ? "#fff" : "#6B7280" }}
                  >
                    {t}yr
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Interest rate (read-only) */}
          <View className='flex-row items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5'>
            <View className='flex-row items-center gap-2'>
              <Info size={14} color='#3B82F6' />
              <Text className='text-[12px] font-[600] text-blue-600'>
                Interest Rate
              </Text>
            </View>
            <Text className='text-[14px] font-[700] text-blue-700'>
              {INTEREST_RATE}% p.a.
            </Text>
          </View>

          {/* Results */}
          <View className='bg-gray-800 rounded-2xl p-4 gap-3'>
            <View className='flex-row items-center justify-between'>
              <Text className='text-[12px] text-gray-400'>Monthly EMI</Text>
              <Text className='text-[16px] font-[700] text-[#A7CC48]'>
                {formatNaira(Math.round(emi.monthly))}
              </Text>
            </View>
            <View className='h-px bg-gray-700' />
            <View className='flex-row items-center justify-between'>
              <Text className='text-[12px] text-gray-400'>Total Interest</Text>
              <Text className='text-[13px] font-[600] text-gray-300'>
                {formatNaira(Math.round(emi.totalInterest))}
              </Text>
            </View>
            <View className='flex-row items-center justify-between'>
              <Text className='text-[12px] text-gray-400'>Total Payable</Text>
              <Text className='text-[13px] font-[600] text-gray-300'>
                {formatNaira(Math.round(emi.totalPayable))}
              </Text>
            </View>
          </View>
        </View>

        {/* Eligibility */}
        <View className='mx-4 mt-4'>
          <TouchableOpacity
            className='flex-row items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-4'
            activeOpacity={0.8}
            onPress={() => setEligibilityOpen((v) => !v)}
          >
            <Text className='text-[14px] font-[700] text-gray-800'>
              Eligibility Requirements
            </Text>
            {eligibilityOpen ? (
              <ChevronUp size={18} color='#6B7280' />
            ) : (
              <ChevronDown size={18} color='#6B7280' />
            )}
          </TouchableOpacity>

          {eligibilityOpen && (
            <View className='bg-white border border-gray-100 rounded-2xl px-4 pb-4 -mt-2 pt-2'>
              {[
                "Must be an active ExciteTrade farmer for at least 6 months",
                "Minimum of 2 completed commodity deliveries",
                "Active cluster membership required",
                "Valid bank account linked to your wallet",
              ].map((req, i) => (
                <View
                  key={i}
                  className='flex-row items-start gap-3 py-2.5 border-b border-gray-50'
                >
                  <View className='w-5 h-5 rounded-full bg-[#F0FDF4] items-center justify-center mt-0.5'>
                    <CheckCircle size={12} color='#22C55E' />
                  </View>
                  <Text className='text-[12px] text-gray-600 flex-1 leading-4'>
                    {req}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Apply button */}
        <View className='px-4 mt-5 mb-10'>
          <TouchableOpacity
            className='bg-[#A7CC48] rounded-2xl h-[52px] items-center justify-center'
            activeOpacity={0.85}
            onPress={() => setApplyModal(true)}
          >
            <Text className='font-[700] text-[14px] text-white'>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Apply Modal */}
      <Modal visible={applyModal} transparent animationType='fade'>
        <View
          className='flex-1 items-center justify-center px-6'
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <View className='bg-white rounded-3xl p-6 w-full'>
            <View className='items-center mb-4'>
              <View className='w-14 h-14 rounded-full bg-amber-50 items-center justify-center mb-3'>
                <AlertCircle size={28} color='#F59E0B' />
              </View>
              <Text className='text-[17px] font-[700] text-gray-800'>
                Coming Soon
              </Text>
              <Text className='text-[13px] text-gray-400 text-center mt-2 leading-5'>
                MFB integration for loan applications is currently in
                development. We'll notify you when it's ready.
              </Text>
            </View>
            <TouchableOpacity
              className='bg-[#A7CC48] rounded-2xl py-4 items-center mt-2'
              activeOpacity={0.85}
              onPress={() => setApplyModal(false)}
            >
              <Text className='font-[700] text-[14px] text-white'>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FarmerFinancialAid;
