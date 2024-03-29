import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";

export default function ProductDetail({ navigation }) {
  const { params } = useRoute();
  const [product, setProduct] = useState([]);
  const { user } = useUser();
  const db = getFirestore(app);
  const nav = useNavigation();

  useEffect(() => {
    params && setProduct(params.product);
    shareButton();
  }, [params, navigation]);

  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        // <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
        <TouchableOpacity onPress={() => shareProduct()}>
          <Ionicons
            style={{ marginRight: 15 }}
            name="share"
            size={24}
            color="white"
          />
        </TouchableOpacity>
      ),
    });
  };

  const shareProduct = () => {
    const content = {
      message: product.title + "\n" + product.desc,
    };
    console.log("e");
    Share.share(content).then(
      (resp) => {
        console.log(resp);
      },
      (error) => console.log(error)
    );
  };

  const sendEmailMessage = () => {
    const subject = "Regarding " + product?.title;
    const body = "Hi " + product.userName + "\n" + "I am interested in product";
    Linking.openURL(
      "mailto:" + product?.userEmail + "?subject=" + subject + "&body=" + body
    );
  };

  const deleteUserPost = () => {
    Alert.alert("Do you want to delete?", "Are you want to Delete this Post?", [
      {
        text: "Yes",
        onPress: () => deleteFromFirestroe(),
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };

  const deleteFromFirestroe = async () => {
    console.log("deleted");
    const q = query(
      collection(db, "UserPost"),
      where("title", "==", product?.title)
    );

    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      deleteDoc(doc.ref).then((resp) => {
        console.log('Deleted the Doc...');
        nav.goBack();
      });
    });
  };

  return (
    <ScrollView>
      <Image
        source={{ uri: product.image }}
        className="h-[320px] w-full"
      ></Image>
      <View className="p-3">
        <Text className="text-[24px] font-bold">{product?.title}</Text>
        <View className="items-baseline ">
          <Text className="bg-blue-200 p-1 mt-1 px-2 rounded-full text-blue-500 overflow-hidden">
            {product?.category}
          </Text>
        </View>
        <Text className="text-[20px] font-bold">Description</Text>
        <Text className="text-[15px] text-gray-500 ">{product?.desc}</Text>
      </View>

      <View className="flex flex-row gap-2 p-3 bg-blue-50">
        <Image
          source={{ uri: product?.userImage }}
          className="w-12 h-12 rounded-full "
        ></Image>
        <View>
          <Text className="font-bold text-[18px]">{product?.userName}</Text>
          <Text className="text-gray-500">{product?.userEmail}</Text>
        </View>
      </View>

      {user.primaryEmailAddress.emailAddress == product?.userEmail ? (
        <TouchableOpacity
          onPress={() => deleteUserPost()}
          className="z-40 bg-red-500 p-3 m-2 rounded-full"
        >
          <Text className="text-center text-white">Delete Post </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => sendEmailMessage()}
          className="z-40 bg-blue-500 p-3 m-2 rounded-full"
        >
          <Text className="text-center text-white">Send Message</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
