import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
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
    mail:"",
    provincia:"",
    telefono:"",
    urlweb:"",
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
      mail: protectora.mail,
      provincia: protectora.provincia,
      telefono: protectora.telefono.toString(),
      urlweb: protectora.urlweb,
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
      </View>
      <View>
        <TextInput
          placeholder="Nombre"
          autoCompleteType="nombre"
          style={styles.inputGroup}
          value={"Nombre: "+protectora.nombre}
          onChangeText={(value) => handleTextChange(value, "nombre")}
        />
      </View>
      <View>
        <TextInput
          autoCompleteType="Mail"
          placeholder="mail"
          style={styles.inputGroup}
          value={"Mail: "+protectora.mail}
          onChangeText={(value) => handleTextChange(value, "mail")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Provincia"
          autoCompleteType="provincia"
          style={styles.inputGroup}
          value={"Provincia: "+protectora.provincia}
          onChangeText={(value) => handleTextChange(value, "provincia")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Teléfono"
          autoCompleteType="telefono"
          style={styles.inputGroup}
          value={"Teléfono: "+protectora.telefono.toString()}
          onChangeText={(value) => handleTextChange(value, "telefono")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Pág. Web"
          autoCompleteType="pagWeb"
          style={styles.inputGroup}
          value={"Pág. Web " + protectora.urlweb}
          onChangeText={(value) => handleTextChange(value, "pagWeb")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Descripcion"
          autoCompleteType="descripcion"
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