/** @format */
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Globe, ChevronDown, Check, CheckCircle, AlertCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { LANGUAGES, changeLanguage } from "../services/i18n";
import api from "../services/api";

const LanguagePicker = () => {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'saved' | 'local' | null

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const handleSelect = async (lang) => {
    if (lang.code === i18n.language) {
      setVisible(false);
      return;
    }
    setSaving(true);
    setVisible(false);
    setStatus(null);
    try {
      await changeLanguage(lang.code, api);
      setStatus("saved");
    } catch {
      // Language applied locally but not saved to DB
      setStatus("local");
    }
    setSaving(false);
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <View className='mb-6'>
      <Text className='text-[13px] font-[600] text-gray-700 mb-1.5'>
        {t("appLanguage")}
      </Text>

      <TouchableOpacity
        className='flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-[50px]'
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        <View className='flex-row items-center gap-2'>
          <Globe size={16} color='#A7CC48' />
          <Text className='text-[13px] text-gray-800 font-[500]'>
            {current.flag} {current.nativeLabel}
          </Text>
        </View>
        {saving ? (
          <ActivityIndicator size='small' color='#A7CC48' />
        ) : (
          <ChevronDown size={16} color='#9CA3AF' />
        )}
      </TouchableOpacity>

      {status === "saved" && (
        <View className='flex-row items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-2.5 mt-3'>
          <CheckCircle size={14} color='#22C55E' />
          <Text className='text-[12px] font-[600] text-green-700'>{t("languageSaved")}</Text>
        </View>
      )}
      {status === "local" && (
        <View className='flex-row items-center gap-2 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl px-4 py-2.5 mt-3'>
          <AlertCircle size={14} color='#F97316' />
          <Text className='text-[12px] font-[600] text-orange-700'>Language set on device. Sign in again to sync.</Text>
        </View>
      )}

      <Modal visible={visible} transparent animationType='slide'>
        <View
          className='flex-1 justify-end'
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View className='bg-white rounded-t-3xl px-4 pt-4 pb-10'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-[17px] font-[700] text-gray-800'>
                {t("chooseLanguage")}
              </Text>
              <TouchableOpacity
                className='w-8 h-8 rounded-full bg-gray-100 items-center justify-center'
                onPress={() => setVisible(false)}
                activeOpacity={0.7}
              >
                <Text className='text-gray-500 text-[14px] font-[600]'>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              style={{ maxHeight: 420 }}
              renderItem={({ item }) => {
                const isSelected = item.code === i18n.language;
                return (
                  <TouchableOpacity
                    className='flex-row items-center justify-between py-3.5 border-b border-gray-50'
                    activeOpacity={0.7}
                    onPress={() => handleSelect(item)}
                  >
                    <View className='flex-row items-center gap-3'>
                      <Text className='text-[20px]'>{item.flag}</Text>
                      <View>
                        <Text className='text-[14px] font-[600] text-gray-800'>
                          {item.nativeLabel}
                        </Text>
                        <Text className='text-[11px] text-gray-400'>
                          {item.label}
                        </Text>
                      </View>
                    </View>
                    {isSelected && <Check size={18} color='#A7CC48' />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LanguagePicker;
