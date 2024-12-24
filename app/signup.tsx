import Colors from "@/constants/Colors";
import { COUNTRY_CODE } from "@/constants/constants";
import { defaultStyles } from "@/constants/Styles";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
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

const Signup = () => {
  const [countryCode, setCountryCode] = useState(COUNTRY_CODE);
  const [mobileNumber, setMobileNumber] = useState("");

  const router = useRouter();
  const { signUp } = useSignUp();

  const onSignup = async () => {
    const phoneNumber = `${countryCode}${mobileNumber}`;
    try {
      await signUp!.create({ phoneNumber: phoneNumber });

      await signUp?.preparePhoneNumberVerification();

      router.push({ pathname: "/verify/[phone]", params: { phone: phoneNumber } });
    } catch (error) {
      console.error("error[onSignup] ====>", JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        Alert.alert("Error", error.errors[0].message);
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
        <Text style={defaultStyles.header}>Let's Get Started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there
        </Text>
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
        <Link asChild replace href="/login">
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>Already have an account? Login</Text>
          </TouchableOpacity>
        </Link>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          disabled={!mobileNumber}
          onPress={onSignup}
          style={[defaultStyles.pillButton, mobileNumber ? styles.enabled : styles.disabled, { marginBottom: 20 }]}
        >
          <Text style={defaultStyles.buttonText}>Signup</Text>
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

export default Signup;
