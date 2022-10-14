

import firebase from '../database/firebase.js';
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput
} from "react-native";


const PerfilUsuario = (props) => {
    const initialState = {
        nombre: "",
        email: "" , 
        telefono: "", 
    }
    const [usuario, setUsario] = useState(initialState);
    const [loading, setLoading] = useState(true);

    const handleChangeText = (value, prop) => {
        setUsario({...usuario, [prop]: value}); 
    }; 
    const getUserById = async (id) => {
        const dbRef = firebase.db.collection("users").doc(id);
        const doc = await dbRef.get();
        const usuario = doc.data();
        setUsuario({ ...usuario, id: doc.id });
        setLoading(false);
      };
 return (
    <ScrollView style={styles.container}>

<     View>
         <Image source={require('../images/gatitos.jpg')} style={styles.image}/>
      </View>
      <View>
        <TextInput
          placeholder="nombre"
          autoCompleteType="nombre"
          style={styles.inputGroup}
          value={"Nombre: "+usuario.nombre}
          onChangeText={(value) => handleTextChange(value, "nombre")}
        />
      </View>
      <View>
        <TextInput
          autoCompleteType="Email"
          placeholder="email"
          style={styles.inputGroup}
          value={"Email: "+ usuario.email}
          onChangeText={(value) => handleTextChange(value, "edad")}
        />
      </View>
      <View>
        <TextInput
          placeholder="telefono"
          autoCompleteType="telefono"
          style={styles.inputGroup}
          value={"Telefono: "+ usuario.telefono}
          onChangeText={(value) => handleTextChange(value, "telefono")}
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


export default PerfilUsuario; 