import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

import firebase from "../database/firebase";

const PerfilProtectora = (props) => {

  const initialState = {
    nombre:"",
    email:"",
    localizacion:"",
    direccion:"",
    url:"",
    descripcion:""
  };

  const [protectora, setProtectora] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const handleTextChange = (value, prop) => {
    setProtectora({ ...protectora, [prop]: value });
  };

  const getProtectoraById = async (id) => {
    const dbRef = firebase.db.collection("protectoras").doc(id);
    const doc = await dbRef.get();
    const protectora = doc.data();
    setProtectora({ ...protectora, id: doc.id });
    setLoading(false);
  };

  const updateProtectora = async () => {
    const protectoraRef = firebase.db.collection("protectoras").doc(animal.id);
    await protectoraRef.set({
      nombre: protectora.nombre,
      email: protectora.email,
      localizacion: protectora.localizacion,
      direccion: protectora.direccion,
      url: protectora.url,
      descripcion: protectora.descripcion,
    });
    setProtectora(initialState);
    props.navigation.navigate("ListaProtectoras");
  };
  

  useEffect(() => {
    getProtectoraById(props.route.params.protectoraId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

<     View>
         <Image source={require('../images/Greenpeace.jpg')} style={styles.image}/>
         <Text >           
          {"Nombre: " + protectora.nombre}
          </Text>    
        <TextInput
          placeholder="Nombre"
          autoCompleteType="nombre"
          editable = {false}
          style={styles.inputGroup}
          value={"Nombre: "+protectora.nombre}
          onChangeText={(value) => handleTextChange(value, "nombre")}
        />
        <TextInput
          autoCompleteType="Email"
          placeholder="email"
          editable = {false}
          style={styles.inputGroup}
          value={"Email: "+protectora.email}
          onChangeText={(value) => handleTextChange(value, "email")}
        />
        <TextInput
          placeholder="Localización"
          autoCompleteType="localizacion"
          editable = {false}
          style={styles.inputGroup}
          value={"Localización: "+protectora.localizacion}
          onChangeText={(value) => handleTextChange(value, "localizacion")}
        />
        <TextInput
          placeholder="Dirección"
          autoCompleteType="direccion"
          editable = {false}
          style={styles.inputGroup}
          value={"Dirección: "+protectora.direccion}
          onChangeText={(value) => handleTextChange(value, "direccion")}
        />
        <TextInput
          placeholder="Pág. Web"
          autoCompleteType="pagWeb"
          editable = {false}
          style={styles.inputGroup}
          value={"Pág. Web " + protectora.url}
          onChangeText={(value) => handleTextChange(value, "pagWeb")}
        />
        <TextInput
          placeholder="Descripcion"
          autoCompleteType="descripcion"
          editable = {false}
          style={styles.inputGroup}
          value={"Descripción: "+protectora.descripcion}
          onChangeText={(value) => handleTextChange(value, "descripcion")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  btn: {
    marginBottom: 7,
  },
  image : {
    height : 250, 
    width : 250
}
});

export default PerfilProtectora;