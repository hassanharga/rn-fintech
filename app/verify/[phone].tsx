import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { isClerkAPIResponseError, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { Link, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

const MAX_CODE_LENGTH = 6;

const Verify = () => {
  const { phone, signin } = useLocalSearchParams<{ phone: string; signin?: string }>();

  const [code, setCode] = useState("");

  const ref = useBlurOnFulfill({ value: code, cellCount: MAX_CODE_LENGTH });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const { signIn } = useSignIn();
  const { setActive, signUp } = useSignUp();

  useEffect(() => {
    if (code.length !== MAX_CODE_LENGTH) return;
    // console.log("code ====>", code);
    if (signin) {
      verifySignIn();
    } else {
      verifyCode();
    }
  }, [code]);

  const verifyCode = async () => {
    try {
      await signUp?.attemptPhoneNumberVerification({ code });
      await setActive?.({ session: signUp?.createdSessionId });
    } catch (error) {
      console.error("error[verifyCode] ====>", JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        Alert.alert("Error", error.errors[0].message);
      }
    }
  };

  const verifySignIn = async () => {
    try {
      await signIn?.attemptFirstFactor({ strategy: "phone_code", code });
      await setActive?.({ session: signIn?.createdSessionId });
    } catch (error) {
      console.error("error[verifySignIn] ====>", JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        Alert.alert("Error", error.errors[0].message);
      }
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digits code</Text>
      <Text style={defaultStyles.descriptionText}>Code sent to {phone} unless you already have one</Text>

      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={code}
        onChangeText={setCode}
        cellCount={MAX_CODE_LENGTH}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        // autoComplete={Platform.select({ android: "sms-otp", default: "one-time-code" })}
        // testID="my-code-input"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
            </View>
            {index === 2 ? <View key={`separator-${index}`} style={styles.separator} /> : null}
          </Fragment>
        )}
      />

      <Link asChild replace href="/login">
        <TouchableOpacity>
          <Text style={defaultStyles.textLink}>Already have an account? Login</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: "auto",
    marginRight: "auto",
    gap: 12,
  },
  cellRoot: {
    width: 45,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    paddingBottom: 8,
  },
  separator: {
    height: 2,
    width: 10,
    backgroundColor: Colors.gray,
    alignSelf: "center",
  },
});

export default Verify;
