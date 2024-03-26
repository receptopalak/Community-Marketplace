import { View, Text, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";

export default function Header() {
  const { user } = useUser();

  return (
    <View>
      {/* User Info Section */}
      <View className="flex flex-row items-center gap-2">
        <Image
          source={{ uri: user?.imageUrl }}
          className="rounded-full w-12 h-12"
        />

        <View>
          <Text className="text-[16px]">Welcome</Text>
          <Text className="text-[20px] font-bold">{user?.fullName}</Text>
        </View>
      </View>

      {/* Search Bar Section */}

      <View
        className="p-2 px-5 flex flex-row items-center
        mt-5 rounded-full border-[1px] bg-blue-50 border-blue-200"
      >
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          placeholder="Search"
          className="ml-2 text-[18px]"
          onChangeText={(value) => console.log(value)}
        ></TextInput>
      </View>
    </View>
  );
}
