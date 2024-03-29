import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import PostItem from "./PostItem";

export default function LatestItemList({ latestItemList, heading }) {
  return (
    <TouchableOpacity className="mt-4">
      <Text className="text-[20px] font-bold">{heading}</Text>
      <FlatList
        className="mt-3"
        data={latestItemList}
        numColumns={2}
        renderItem={({ item, index }) => <PostItem item={item} />}
      />
    </TouchableOpacity>
  );
}
