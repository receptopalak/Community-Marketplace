import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

export default function MyProducct() {
  const db = getFirestore(app);
  const { user } = useUser();

  const [productList, setProductList] = useState([]);

  useEffect(() => {
    user && getUserPost();
  }, [user]);

  const getUserPost = async () => {
    setProductList([]);
    const q = await getDocs(
      collection(db, "UserPost"),
      where("userEmail", "==", user.primaryEmailAddress.emailAddress)
    );

    q.forEach((doc) => {
      console.log(doc.data());

      setProductList((productList) => [...productList, doc.data()]);
    });
  };

  return (
    <View>
      <LatestItemList latestItemList={productList} heading={"My Product"} />
    </View>
  );
}
