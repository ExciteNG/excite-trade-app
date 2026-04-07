/** @format */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  Lock,
  Globe,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react-native";
import api from "../../services/api";
import LanguagePicker from "../../components/LanguagePicker";

const TAB_PROFILE = "profile";
const TAB_PASSWORD = "password";
const TAB_LANGUAGE = "language";

const FarmerSettings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(TAB_PROFILE);

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);

  useEffect(() => {
    const prefill = async () => {
      try {
        const raw = await AsyncStorage.getItem("userInfo");
        if (raw) {
          const userInfo = JSON.parse(raw);
          setFirstName(userInfo?.name?.firstName ?? "");
          setLastName(userInfo?.name?.lastName ?? "");
          setEmail(userInfo?.email ?? "");
          setCountry(userInfo?.country ?? "");
        }
      } catch {
        // Silently ignore prefill errors
      }
    };
    prefill();
  }, []);

  const isProfileValid = firstName.trim() && lastName.trim();
  const isPwdValid = currentPwd && newPwd.length >= 8 && newPwd === confirmPwd;

  const handleSaveProfile = async () => {
    if (!isProfileValid) return;
    setProfileLoading(true);
    try {
      await api.put("/farmer/update-profile", { firstName, lastName, country });
      // Update cached userInfo
      const raw = await AsyncStorage.getItem("userInfo");
      if (raw) {
        const userInfo = JSON.parse(raw);
        userInfo.name = { ...userInfo.name, firstName, lastName };
        userInfo.country = country;
        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err) {
      alert(
        err?.response?.data?.message ?? "Failed to update profile. Try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSavePassword = () => {
    if (!isPwdValid) return;
    // Password change endpoint not available — inform user
    alert("Password change is not available in this version.");
    setPwdSaved(false);
  };

  const PasswordInput = ({ label, value, onChange, show, onToggle }) => (
    <View className='mb-4'>
      <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
        {label}
      </Text>
      <View className='flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-[50px]'>
        <TextInput
          className='flex-1 text-[13px] text-gray-800'
          placeholder='••••••••'
          placeholderTextColor='#9CA3AF'
          secureTextEntry={!show}
          value={value}
          onChangeText={onChange}
        />
        <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
          {show ? (
            <EyeOff size={18} color='#9CA3AF' />
          ) : (
            <Eye size={18} color='#9CA3AF' />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={"white"} barStyle='dark-content' />
      {/* Header + tabs — single unified white section */}
      <View className='bg-white border-b border-gray-100'>
        <View className='px-4 pt-2 pb-3'>
          <Text className='text-[19px] font-[700] text-gray-800'>{t("settingsTitle")}</Text>
          <Text className='text-[13px] text-gray-400 mt-0.5'>
            {t("settingsSubtitle")}
          </Text>
        </View>
        <View className='flex-row px-4 gap-6'>
          {[
            { key: TAB_PROFILE, label: t("profile"), Icon: User },
            { key: TAB_PASSWORD, label: t("password"), Icon: Lock },
            { key: TAB_LANGUAGE, label: t("language"), Icon: Globe },
          ].map(({ key, label, Icon }) => (
            <TouchableOpacity
              key={key}
              className='flex-row items-center gap-1.5 pb-3'
              style={{
                borderBottomWidth: activeTab === key ? 2 : 0,
                borderBottomColor: "#A7CC48",
              }}
              onPress={() => setActiveTab(key)}
              activeOpacity={0.7}
            >
              <Icon size={15} color={activeTab === key ? "#A7CC48" : "#9CA3AF"} />
              <Text
                className='text-[13px] font-[600]'
                style={{ color: activeTab === key ? "#A7CC48" : "#9CA3AF" }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='px-4 pt-5 pb-10'>
          {activeTab === TAB_PROFILE ? (
            <>
              {/* Avatar */}
              <View className='items-center mb-6'>
                <View className='relative'>
                  <View
                    className='w-24 h-24 rounded-full bg-[#F0FDF4] border-4 border-white items-center justify-center'
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                    }}
                  >
                    <User size={36} color='#A7CC48' />
                  </View>
                  <TouchableOpacity
                    className='absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#A7CC48] items-center justify-center border-2 border-white'
                    activeOpacity={0.8}
                  >
                    <Camera size={13} color='#fff' />
                  </TouchableOpacity>
                </View>
                <Text className='text-[11px] text-gray-400 mt-2'>
                  {t("tapToUpdatePhoto")}
                </Text>
              </View>

              {/* First Name */}
              <View className='mb-4'>
                <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
                  {t("firstName")}
                </Text>
                <TextInput
                  className='bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800'
                  placeholder={t("firstName")}
                  placeholderTextColor='#9CA3AF'
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize='words'
                />
              </View>

              {/* Last Name */}
              <View className='mb-4'>
                <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
                  {t("lastName")}
                </Text>
                <TextInput
                  className='bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800'
                  placeholder={t("lastName")}
                  placeholderTextColor='#9CA3AF'
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize='words'
                />
              </View>

              {/* Email (disabled) */}
              <View className='mb-4'>
                <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
                  {t("emailAddress")}
                </Text>
                <View className='bg-gray-100 border border-gray-200 rounded-xl px-4 h-[50px] justify-center'>
                  <Text className='text-[13px] text-gray-400'>{email}</Text>
                </View>
                <Text className='text-[11px] text-gray-400 mt-1 ml-1'>
                  {t("emailCannotChange")}
                </Text>
              </View>

              {/* Country */}
              <View className='mb-6'>
                <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
                  {t("country")}
                </Text>
                <TextInput
                  className='bg-white border border-gray-200 rounded-xl px-4 h-[50px] text-[13px] text-gray-800'
                  placeholder={t("country")}
                  placeholderTextColor='#9CA3AF'
                  value={country}
                  onChangeText={setCountry}
                />
              </View>

              {profileSaved && (
                <View className='flex-row items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-3 mb-4'>
                  <CheckCircle size={15} color='#22C55E' />
                  <Text className='text-[12px] font-[600] text-green-700'>
                    {t("profileUpdated")}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                className='rounded-2xl h-[52px] items-center justify-center'
                style={{
                  backgroundColor: isProfileValid ? "#A7CC48" : "#E5E7EB",
                }}
                activeOpacity={isProfileValid ? 0.85 : 1}
                onPress={handleSaveProfile}
                disabled={profileLoading}
              >
                {profileLoading ? (
                  <ActivityIndicator size='small' color='#fff' />
                ) : (
                  <Text
                    className='font-[700] text-[14px]'
                    style={{ color: isProfileValid ? "#fff" : "#9CA3AF" }}
                  >
                    {t("saveChanges")}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : activeTab === TAB_PASSWORD ? (
            <>
              <PasswordInput
                label={t("currentPassword")}
                value={currentPwd}
                onChange={setCurrentPwd}
                show={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
              />
              <PasswordInput
                label={t("newPassword")}
                value={newPwd}
                onChange={setNewPwd}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
              />
              {newPwd.length > 0 && newPwd.length < 8 && (
                <Text className='text-[11px] text-red-400 -mt-3 mb-4 ml-1'>
                  {t("minEightChars")}
                </Text>
              )}
              <PasswordInput
                label={t("confirmNewPassword")}
                value={confirmPwd}
                onChange={setConfirmPwd}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
              />
              {confirmPwd.length > 0 && confirmPwd !== newPwd && (
                <Text className='text-[11px] text-red-400 -mt-3 mb-4 ml-1'>
                  {t("passwordsNoMatch")}
                </Text>
              )}

              {pwdSaved && (
                <View className='flex-row items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-3 mb-4'>
                  <CheckCircle size={15} color='#22C55E' />
                  <Text className='text-[12px] font-[600] text-green-700'>
                    {t("passwordChanged")}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                className='rounded-2xl h-[52px] items-center justify-center mt-2'
                style={{ backgroundColor: isPwdValid ? "#A7CC48" : "#E5E7EB" }}
                activeOpacity={isPwdValid ? 0.85 : 1}
                onPress={handleSavePassword}
              >
                <Text
                  className='font-[700] text-[14px]'
                  style={{ color: isPwdValid ? "#fff" : "#9CA3AF" }}
                >
                  {t("updatePassword")}
                </Text>
              </TouchableOpacity>
            </>
          ) : activeTab === TAB_LANGUAGE ? (
            <>
              <Text className='text-[13px] text-gray-400 mb-5 leading-5'>
                Choose the language you'd like to use across the app. Your
                preference is saved to your account so it loads automatically
                when you sign in.
              </Text>
              <LanguagePicker />
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FarmerSettings;
