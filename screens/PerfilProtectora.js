import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Text,
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

  const getProtectoraById = async (id) => {
    const dbRef = firebase.db.collection("protectoras").doc(id);
    const doc = await dbRef.get();
    const protectora = doc.data();
    setProtectora({ ...protectora, id: doc.id });
  };

  useEffect(() => {
    getProtectoraById(props.route.params.protectoraId);
  }, []);

  return (
    <ScrollView style={styles.container}>

      <View>
        <Image source={require('../images/Greenpeace.jpg')} style={styles.image}/>
        <Text style = {styles.texto} >
          {"Nombre: " + protectora.nombre}
        </Text>
        <Text style = {styles.texto} >
          {"Email: " + protectora.email}
        </Text>
        <Text style = {styles.texto} >
          {"Localización: " + protectora.localizacion}
        </Text>
        <Text style = {styles.texto} >
          {"Dirección: " + protectora.direccion}
        </Text>        
        <Text style = {styles.texto} >
          {"Página web: " + protectora.url}
        </Text>   
        <Text style = {styles.texto} >
          {"Descripción: " + protectora.descripcion}
        </Text>   
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  image : {
    height : 250, 
    width : 250,
    marginBottom : 15
  },
  texto: {
    fontSize : 16,
    padding : 5,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginBottom: 10
  }
});

export default PerfilProtectora;