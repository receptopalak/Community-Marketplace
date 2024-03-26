import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { app } from "../../firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";

export default function AddPostScreen() {
  const db = getFirestore(app);
  const storage = getStorage();

  const { user } = useUser();

  useEffect(() => {
    getCategoryList();
  }, []);

  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setloading] = useState(false);

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("Docs", doc.data());
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmitMethod = async (value) => {
    setloading(true);

    value.image = image;
    const resp = await fetch(image);
    const blob = await resp.blob();

    const storageRef = ref(storage, "communityPost/" + Date.now() + ".jpg");
    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          console.log(downloadURL);
          value.image = downloadURL;
          value.userName = user.fullName;
          value.userEmail = user.primaryEmailAddress.emailAddress;
          value.userImage = user.imageUrl;
          const docRef = await addDoc(collection(db, "UserPost"), value);
          if (docRef.id) {
            console.log("Document Added");

            setloading(false);
            Alert.alert("Success", "Post Added Successfully");
          }
        });
      });
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView className="p-10 ">
        <Text className="text-[20px] font-bold mt-5">Add New Post</Text>
        <Text className="text-[16px] text-gray-500 mb-7">
          Create New Post and Start Selling
        </Text>

        <Formik
          initialValues={{
            name: "",
            desc: "",
            category: "",
            adress: "",
            price: "",
            image: "",
            userName: "",
            userEmail: "",
            userImage: "",
            createdAt: Date.now(),
          }}
          onSubmit={(value) => onSubmitMethod(value)}
          validate={(values) => {
            const errors = {};

            if (!values.title) {
              console.log("Title not Present");
              errors.name = "Title Must be there";
            }
            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
          }) => (
            <View>
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    className="w-24 h-24 rounded-2xl"
                  ></Image>
                ) : (
                  <Image
                    source={require("./../../assets/images/placeholder.jpg")}
                    className="w-24 h-24 rounded-2xl"
                  ></Image>
                )}
              </TouchableOpacity>

              <TextInput
                className="border-gray-400"
                style={styles.input}
                placeholder="Title"
                value={values?.title}
                onChangeText={handleChange("title")}
              ></TextInput>

              <TextInput
                className="min-h-1 border-gray-400"
                style={styles.textInput}
                placeholder="Description"
                value={values?.desc}
                onChangeText={handleChange("desc")}
              ></TextInput>
              <TextInput
                className="border-gray-400"
                style={styles.input}
                placeholder="Price"
                value={values?.price}
                onChangeText={handleChange("price")}
                keyboardType="number-pad"
              ></TextInput>
              <TextInput
                className="border-gray-400"
                style={styles.input}
                placeholder="Adress"
                value={values?.adress}
                onChangeText={handleChange("adress")}
              ></TextInput>

              <View className="border border-gray-400 rounded-xl mt-4">
                <Picker
                  selectedValue={values?.category}
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                >
                  {categoryList &&
                    categoryList.map(
                      (item, index) =>
                        item && (
                          <Picker.Item
                            key={index}
                            label={item?.name}
                            value={item?.name}
                          />
                        )
                    )}
                </Picker>
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                className="p-4 bg-blue-500 rounded-full mt-5 mb-14"
                style={{
                  backgroundColor: loading ? "#ccc" : "#007BFF",
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center text-[15px]">
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    paddingTop: 15,
    paddingHorizontal: 17,
    fontSize: 17,
    textAlignVertical: "top",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    padding: 10,
    fontSize: 17,
    height: 80, // Hem iOS hem de Android'de TextInput yüksekliğini ayarlayarak çok satırlı yapı sağlanır.
    textAlignVertical: "top", // Metin girişinin başlangıç noktasını üstten başlatır, Android için önemlidir.
  },
});
