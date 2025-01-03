import Colors from "@/constants/Colors";
import { UserInactivityProvider } from "@/context/UserInactivity";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Link, Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

const queryClient = new QueryClient();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const interval = setTimeout(() => {
      if (!isLoaded) return;
      console.log("isSignedIn :>> ", isSignedIn);
      const inAuthGroup = segments[0] === "(authenticated)";

      if (isSignedIn && !inAuthGroup) {
        router.replace("/(authenticated)/(tabs)/home");
      } else if (!isSignedIn) {
        router.replace("/");
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isSignedIn]);

  if (!loaded || !isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack>
      {/* home */}
      <Stack.Screen name="index" options={{ headerShown: false }}></Stack.Screen>
      {/* signup */}
      <Stack.Screen
        name="signup"
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
      {/* login */}
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link asChild href={"/help"}>
              <TouchableOpacity>
                <Ionicons name="help-circle-outline" size={34} color={Colors.dark} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      ></Stack.Screen>
      {/* help */}
      <Stack.Screen name="help" options={{ title: "Help", presentation: "modal" }}></Stack.Screen>
      {/* verify */}
      <Stack.Screen
        name="verify/[phone]"
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
      {/* tabs */}
      <Stack.Screen name="(authenticated)/(tabs)" options={{ headerShown: false }}></Stack.Screen>
      {/* crypto/id */}
      <Stack.Screen
        name="(authenticated)/crypto/[id]"
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerLargeTitle: true,
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" color={Colors.dark} size={30} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="star-outline" color={Colors.dark} size={30} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      {/* lock */}
      <Stack.Screen name="(authenticated)/(modals)/lock" options={{ headerShown: false, animation: "none" }} />
      {/* account */}
      <Stack.Screen
        name="(authenticated)/(modals)/account"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          title: "",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="close-outline" size={34} color={"#fff"} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <QueryClientProvider client={queryClient}>
          <ClerkLoaded>
            <UserInactivityProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar style="dark" />
                <InitialLayout />
              </GestureHandlerRootView>
            </UserInactivityProvider>
            {/* <Slot /> */}
          </ClerkLoaded>
        </QueryClientProvider>
      </ClerkProvider>
    </>
  );
};

export default RootLayoutNav;
