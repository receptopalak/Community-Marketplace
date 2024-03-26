import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import LoginScreen from "./Apps/Screens/LoginScreen";
import { NativeWindStyleSheet } from "nativewind";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./Apps/Navigations/TabNavigation";
import { RootSiblingParent } from 'react-native-root-siblings';

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <ClerkProvider publishableKey="pk_test_ZnJhbmstbWVlcmthdC05OS5jbGVyay5hY2NvdW50cy5kZXYk">
      <View className="flex-1 bg-white ">
        <StatusBar style="auto" />

        <SignedIn>
          <NavigationContainer>
            <TabNavigation />
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
          <LoginScreen />
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}
