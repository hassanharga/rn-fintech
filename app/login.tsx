import Colors from "@/constants/Colors";
import { COUNTRY_CODE } from "@/constants/constants";
import { defaultStyles } from "@/constants/Styles";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

enum SignInType {
  Phone,
  Email,
  Apple,
  Google,
}

const Login = () => {
  const [countryCode, setCountryCode] = useState(COUNTRY_CODE);
  const [mobileNumber, setMobileNumber] = useState("");

  const router = useRouter();
  const { signIn } = useSignIn();

  const onSignIn = async (type: SignInType) => {
    try {
      if (type === SignInType.Phone) {
        const phoneNumber = `${countryCode}${mobileNumber}`;
        const { supportedFirstFactors } = await signIn!.create({ identifier: phoneNumber });

        const firstPhoneFactor = supportedFirstFactors.find((ele) => ele.strategy === "phone_code");

        if (!firstPhoneFactor) return;

        await signIn!.prepareFirstFactor({ strategy: "phone_code", phoneNumberId: firstPhoneFactor.phoneNumberId });

        router.push({ pathname: "/verify/[phone]", params: { phone: phoneNumber, signin: "true" } });
      }
    } catch (error) {
      console.error("error[onSignIn] ====>", JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        if (error.errors[0].code === "form_identifier_not_found") {
          Alert.alert("Error", error.errors[0].message);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome Back</Text>
        <Text style={defaultStyles.descriptionText}>Enter phone number associated with your account</Text>
        {/* country code and mobile number input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Country code"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            value={countryCode}
            onChangeText={setCountryCode}
          />

          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile Number"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            onChangeText={setMobileNumber}
          />
        </View>
        {/* new user link */}
        <Link asChild replace href="/signup">
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>New User? Signup</Text>
          </TouchableOpacity>
        </Link>
        {/* Login Button */}
        <TouchableOpacity
          disabled={!mobileNumber}
          onPress={() => onSignIn(SignInType.Phone)}
          style={[defaultStyles.pillButton, mobileNumber ? styles.enabled : styles.disabled, { marginVertical: 20 }]}
        >
          <Text style={defaultStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        {/* separator */}
        <View style={{ alignItems: "center", gap: 16, flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
        </View>
        {/* social buttons */}
        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Email)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              backgroundColor: Colors.white,
              marginTop: 20,
            },
          ]}
        >
          <Ionicons name="mail" size={24} color={Colors.black} />
          <Text style={[defaultStyles.buttonText, { color: Colors.black }]}>Continue with email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Google)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              backgroundColor: Colors.white,
              marginTop: 20,
            },
          ]}
        >
          <Ionicons name="logo-google" size={24} color={Colors.black} />
          <Text style={[defaultStyles.buttonText, { color: Colors.black }]}>Continue with google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Apple)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              backgroundColor: Colors.white,
              marginTop: 20,
            },
          ]}
        >
          <Ionicons name="logo-apple" size={24} color={Colors.black} />
          <Text style={[defaultStyles.buttonText, { color: Colors.black }]}>Continue with apple</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: { marginVertical: 20, flexDirection: "row", gap: 10 },
  input: {
    marginVertical: 20,
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 20,
    fontSize: 20,
  },
  enabled: { backgroundColor: Colors.primary },
  disabled: { backgroundColor: Colors.primaryMuted },
});

export default Login;
