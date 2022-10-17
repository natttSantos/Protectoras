
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
  Text
} from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';


const Home = (props) => {
    const initialState = {
        usuario: "",
        email: "" , 
        telefono: "", 
        nombre: "",
        contraseña: "",
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
  
    
 return (
  <ScrollView style={styles.container}>
  <View>
    <Text style = {styles.texto} >
        {usuario.nombre}
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
    fontSize : 20,
    padding : 10,
    color: 'blue',
    fontWeight: "bold", 
    textAlign: 'right'
  }, 
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
});




export default Home; 

