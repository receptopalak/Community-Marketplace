import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function Categories({ categoryList }) {
  const navigation = useNavigation();
  return (
    <View className="mt-4">
      <Text className="text-[20px] font-bold">Categories</Text>
      <FlatList
        className="mt-3"
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("item-list", {
                category: item.name
            })}
            className="flex-1 items-center justify-center
           p-2 border-blue-200 bg-blue-50 border-[1px] m-1 h-[80px] rounded-lg"
          >
            <Image source={{ uri: item?.icon }} className="h-[35px] w-[35px]" />
            <Text className="text-[10px] mt-1 ">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
