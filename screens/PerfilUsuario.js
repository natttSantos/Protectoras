
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
        usuario: "",
        email: "" , 
        telefono: "", 
    }
    const [usuario, setUsario] = useState(initialState);
    const [loading, setLoading] = useState(true);
  
    const handleTextChange = (value, prop) => {
      setUsario({ ...usuario, [prop]: value });
    };
  
    const getUsuarioById = async (id) => {
      const dbRef = firebase.db.collection("users").doc(id);
      const doc = await dbRef.get();
      const usuario = doc.data();
      console.log(usuario)
      setUsario({ ...usuario, id: doc.id });
      setLoading(false);
    };
  
    useEffect(() => { 
      getUsuarioById(props.route.params.userId); 
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
      <View>
         <Image source={require('../images/perfilUsuario.jpg')} style={styles.image}/>
      </View>
      <View style={styles.inputGroup}>
        <TextInput style={styles.inputText}
          placeholder="Usuario: "
          value={"Nombre: " + usuario.usuario}
          onChangeText={(value) => handleTextChange(value, "usuario")}
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput style={styles.inputText}
          placeholder="Email: "
          value={"Email: " + usuario.email}
          onChangeText={(value) => handleTextChange(value, "email")}
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput style={styles.inputText}
          placeholder="Telefono: "
          value={"Telefono: " + usuario.telefono}
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
    padding: 6,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#cccccc",
  },inputText: {
    fontSize: 17
  },
  btn: {
    marginBottom: 7,
  },
  image : {
    height : 250, 
    width : 250, 
    padding: 6, 
    alignItems: "center",
    justifyContent: "center",
}
});


export default PerfilUsuario; 