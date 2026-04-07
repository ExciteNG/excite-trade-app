/** @format */

import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useMemo } from "react";
import { ArrowLeft, Globe } from "lucide-react-native";
import { url } from "../../url";
import AsyncStorage from "@react-native-async-storage/async-storage";

const countries = [
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
];

// a flat list of states/provinces with a countryCode field so we can use filter()
const allStates = [
  { id: "lagos", name: "Lagos", countryCode: "NG" },
  { id: "abuja", name: "FCT - Abuja", countryCode: "NG" },
  { id: "rivers", name: "Rivers", countryCode: "NG" },
  { id: "greater-accra", name: "Greater Accra", countryCode: "GH" },
  { id: "ashanti", name: "Ashanti", countryCode: "GH" },
  { id: "nairobi", name: "Nairobi", countryCode: "KE" },
  { id: "mombasa", name: "Mombasa", countryCode: "KE" },
  { id: "california", name: "California", countryCode: "US" },
  { id: "new-york", name: "New York", countryCode: "US" },
];

// simple cities list tied to a state id
const allCities = [
  { id: "ikorodu", name: "Ikorodu", stateId: "lagos" },
  { id: "vi", name: "Victoria Island", stateId: "lagos" },
  { id: "garki", name: "Garki", stateId: "abuja" },
  { id: "portharcourt", name: "Port Harcourt", stateId: "rivers" },
  { id: "accra-city", name: "Accra", stateId: "greater-accra" },
  { id: "kumasi", name: "Kumasi", stateId: "ashanti" },
  { id: "nairobi-city", name: "Nairobi", stateId: "nairobi" },
  { id: "mombasa-city", name: "Mombasa", stateId: "mombasa" },
  { id: "la", name: "Los Angeles", stateId: "california" },
  { id: "sf", name: "San Francisco", stateId: "california" },
  { id: "nyc", name: "New York City", stateId: "new-york" },
];

const Dropdown = ({ label, options, selected, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false);
  return (
    <View className="w-full">
      <Text className=" text-gray-800 text-[12px] font-[500]">{label}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen((s) => !s)}
        className="w-full h-[44px] rounded p-2 border border-gray-400  flex-row items-center justify-between"
      >
        <Text className={`${selected ? "text-black" : "text-gray-400"}`}>
          {selected ? selected.name || selected : placeholder}
        </Text>
        <Text>▾</Text>
      </TouchableOpacity>
      {open && (
        <View className="border border-gray-300 rounded mt-1 max-h-40 bg-white">
          <ScrollView>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.id || opt.code || opt}
                className="p-3 border-b border-gray-100"
                onPress={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
              >
                <Text>{opt.name ? `${opt.name}` : opt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const OrganizationOnboard = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [employees, setEmployees] = useState("");

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [preferredProducts, setPreferredProducts] = useState([]);
  const [preferredUnitsOfMeasurement, setPreferredUnitsOfMeasurement] =
    useState("tonne");
  const [preferredCurrency, setPreferredCurrency] = useState("USD");

  // filter states by selected country using Array.filter
  const filteredStates = useMemo(() => {
    if (!selectedCountry) return [];
    return allStates.filter((s) => s.countryCode === selectedCountry.code);
  }, [selectedCountry]);

  // filter cities by selected state
  const filteredCities = useMemo(() => {
    if (!selectedState) return [];
    return allCities.filter(
      (c) => c.stateId === (selectedState.id || selectedState)
    );
  }, [selectedState]);

  const handleOnboard = async () => {
    // basic validation
    if (!firstName || !lastName || !phoneNumber || !companyName) {
      Alert.alert(
        "Missing fields",
        "Please fill first name, last name, phone and company name."
      );
      return;
    }

    const payload = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: `${selectedCountry?.dial || ""}${phoneNumber}`,
      companyName: companyName,
      companyCountry: selectedCountry?.name || "",
      companyPosition: position,
      companyEmployeeCount: employees,
      companyAddress: address,
      companyState: selectedState?.name || selectedState || "",
      companyCity: selectedCity?.name || selectedCity || "",
      companyZipCode: zipcode,
      companyWebsite: website,
      preferredProducts: preferredProducts,
      preferredUnitsOfMeasurement: preferredUnitsOfMeasurement,
      preferredCurrency: preferredCurrency,
    };

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${url}/offtaker/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const message =
          data?.message || data?.error || "Failed to submit onboarding.";
        Alert.alert("Error", message);
      } else {
        console.log(res.data);
        // success - navigate to next step or show success
        Alert.alert("Success", "Onboarding submitted successfully.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("CommoditiesOnboard"),
          },
        ]);
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      <View className=" mt-4 flex-row items-center justify-center space-x-1 border-b border-gray-300 pb-1">
        <Globe size={12} color={"black"} />
        <Text>excitetrade.com</Text>
      </View>
      {/* header */}
      {/* <View className="flex-row items-center h-[60px] px-4 w-full mt-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          className="p-1 rounded-full"
        >
          <ArrowLeft size={24} color={"black"} />
        </TouchableOpacity>
        <Image
          source={require("../../assets/app-icon.png")}
          className="h-[40px] w-[50px] ml-[33%]"
        />
      </View> */}
      <View className="p-5">
        <Text className="text-lg font-semibold">
          About you & your organization
        </Text>
      </View>
      {/* inputs scroll view below */}
      <ScrollView showsVerticalScrollIndicator={false} className="px-5">
        <View className="flex-row items-center justify-between w-full">
          <View className="max-w-[160px] w-full">
            <Text className=" text-gray-800 text-[12px] font-[500]">
              First Name
            </Text>
            <TextInput
              className=" w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
              placeholder="First Name"
              value={firstName}
              onChangeText={(val) => setFirstName(val)}
            />
          </View>
          <View className="max-w-[160px] w-full">
            <Text className=" text-gray-800 text-[12px] font-[500]">
              Last Name
            </Text>
            <TextInput
              className="w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
              placeholder="Last Name"
              value={lastName}
              onChangeText={(val) => setLastName(val)}
            />
          </View>
        </View>

        <Text className="mt-4 text-gray-800 text-[12px] font-[500]">
          Company Name
        </Text>
        <TextInput
          className="w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
          placeholder="Company Name"
          value={companyName}
          onChangeText={(val) => setCompanyName(val)}
        />

        <Text className="mt-4 text-gray-800 text-[12px] font-[500]">
          Your Position
        </Text>
        <TextInput
          className="w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
          placeholder="Your Position"
          value={position}
          onChangeText={(val) => setPosition(val)}
        />

        <Text className="mt-4 text-gray-800 text-[12px] font-[500]">
          Number of Employees
        </Text>
        <TextInput
          className="w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
          placeholder=""
          keyboardType="numeric"
          value={employees}
          onChangeText={(val) => setEmployees(val)}
        />

        {/* Phone row with country picker */}
        <Text className="mt-4 text-gray-800 text-[12px] font-[500] -mb-3">
          Phone No.
        </Text>
        <View className="flex-row items-center space-x-2">
          <View className="w-[120px]">
            <Dropdown
              label={""}
              options={countries}
              selected={{
                name: `${selectedCountry.flag} ${selectedCountry.dial}`,
              }}
              onSelect={(opt) => {
                setSelectedCountry(opt);
                // reset state & city when country changes
                setSelectedState(null);
                setSelectedCity(null);
              }}
              placeholder={`${selectedCountry.flag} ${selectedCountry.dial}`}
            />
          </View>
          <View className="flex-1 mt-4">
            <TextInput
              className="w-full h-[44px] rounded p-2 border border-gray-400"
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(val) => setPhoneNumber(val)}
            />
          </View>
        </View>

        {/* State and City dropdowns side by side */}
        <View className="flex-row items-start justify-between mt-4">
          <View className="max-w-[160px] w-full mr-2">
            <Dropdown
              label={"State/Province"}
              options={filteredStates}
              selected={selectedState}
              onSelect={(opt) => {
                setSelectedState(opt);
                setSelectedCity(null);
              }}
              placeholder={"Choose"}
            />
          </View>
          <View className="max-w-[160px] w-full ml-2">
            <Dropdown
              label={"City"}
              options={filteredCities}
              selected={selectedCity}
              onSelect={(opt) => setSelectedCity(opt)}
              placeholder={"Choose"}
            />
          </View>
        </View>

        <Text className="mt-4 text-gray-800 text-[12px] font-[500]">
          Address
        </Text>
        <TextInput
          className="w-full h-[64px] rounded p-2 border border-gray-400 mt-1"
          placeholder=""
          multiline
          value={address}
          onChangeText={(val) => setAddress(val)}
        />

        <View className="flex-row items-start justify-between mt-4">
          <View className="max-w-[160px] w-full mr-2">
            <Text className=" text-gray-800 text-[12px] font-[500]">
              Zipcode/Postal code
            </Text>
            <TextInput
              className="w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
              placeholder=""
              value={zipcode}
              onChangeText={(val) => setZipcode(val)}
            />
          </View>
          <View className="max-w-[160px] w-full ml-2">
            <Text className=" text-gray-800 text-[12px] font-[500]">
              Company Website
            </Text>
            <TextInput
              className="w-full h-[44px] rounded p-2 border border-gray-400 mt-1"
              placeholder="Enter website URL"
              value={website}
              onChangeText={(val) => setWebsite(val)}
            />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOnboard}
          disabled={loading}
          className={`h-[44px] rounded flex justify-center items-center mt-8 mb-10 ${
            loading ? "bg-gray-300" : "bg-[#A7CC48]"
          }`}
        >
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#fff" />
              <Text className="ml-2 text-white font-[500]">Submitting...</Text>
            </View>
          ) : (
            <Text className="font-[500]">Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default OrganizationOnboard;
