import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

export default function ExploreScreen() {
  const db = getFirestore(app);
  const [productList, setProductList] = useState();

  useEffect(() => {
    getAllProducsts();
  }, []);

  const getAllProducsts = async () => {
    setProductList([]);
    const q = await getDocs(
      collection(db, "UserPost"),
      orderBy("createdAt", "desc")
    );

    q.forEach((doc) => {
      setProductList((productList) => [...productList, doc.data()]);
    });
  };

  return (
    <View className="p-5 py-8">
      <Text className="text-[30px] font-bold">ExploreScreen</Text>
      <LatestItemList latestItemList={productList} heading={""} />
    </View>
  );
}
