import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import login from "./../../assets/images/login.png";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const { isLoaded, signOut } = useAuth(); 

  const menuList = [
    {
      id: 1,
      name: "My Products",
      icon: login,
      path: "my-product",
    },
    {
      id: 2,
      name: "Explore",
      icon: login,
      path: "explore",
    },
    {
      id: 3,
      name: "Me",
      icon: login,
    },
    {
      id: 4,
      name: "Logout",
      icon: login,
    },
  ];

  const onMenuPress = (item) => {
    if (item.name == "Logout") {
      signOut();
    }

    item.path ? navigation.navigate(item.path) : null;
  };

  return (
    <View className="p-5">
      <View className="items-center mt-14">
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-[100px] h-[100px] rounded-full"
        />
        <Text className="font-bold text-[25px] mt-2"> {user?.fullName}</Text>
        <Text className=" text-[15px] mt-2 text-gray-400">
          {" "}
          {user?.primaryEmailAddress.emailAddress}
        </Text>
      </View>

      <FlatList
        className="mt-4"
        data={menuList}
        numColumns={3}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onMenuPress(item)}
            className="flex-1 p-3 border-[1px] items-center rounded-md gap-1 m-1 border-blue-200 bg-blue-50"
          >
            {item?.icon && (
              <Image
                source={item?.icon}
                className="w-[50px] h-[50px]  rounded-lg"
              />
            )}
            <Text className="text-[8px] mt-2  text-gray-500">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
