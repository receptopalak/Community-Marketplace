import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
 
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View className="w-full h-full">
      <Image className="w-full h-[400px] object-cover"
        source={require("./../../assets/images/login.jpeg")}
      />
      <View className="p-8 bg-white mt-[-20px] rounded-t-3xl shadow-md h-full">
        <Text className="text-[25px] font-bold">Community Marketplace</Text>
        <Text className="text-[15px] text-slate-500 font-bold mt-6">Buy Sell Marketplace where you can sell old item and make real money</Text>
        <TouchableOpacity onPress={onPress} className="p-4 bg-blue-500 rounded-full mt-28">
          <Text className="text-white text-center text-[18px]">Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
