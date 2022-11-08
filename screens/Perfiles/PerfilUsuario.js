
import firebase from '../../database/firebase.js';
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


const PerfilUsuario = (props) => {
    const initialState = {
        usuario: "",
        email: "" , 
        telefono: "", 
        nombre: "",
        contraseña: "",
        alta:""
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

    //<Image source={require('../images/perfilUsuario.jpg')} style={styles.image}/>
 return (
  <ScrollView style={styles.container}>
  <View>
    <Image source={require('../../images/perfilUsuario.jpg')} style={styles.image}/>
    <Text style = {styles.texto} >
      {"Nombre de usuario: " + usuario.usuario}
    </Text>
    <Text style = {styles.texto} >
      {"Email: " + usuario.email}
    </Text>
    <Text style = {styles.texto} >
      {"Telefono: " + usuario.telefono}
    </Text>

    <Button
          onPress={() => { if(usuario.alta == "No")props.navigation.navigate('AltaAdoptar', {userId: props.route.params.userId}); 
          else alert("Ya se ha dado de alta");
        }}
          title="Dar de alta para adoptar"
          color="#841584"
        />

<Button
          onPress={() => { if(usuario.alta == "Si")props.navigation.navigate('PerfilAdoptar', {userId: props.route.params.userId}); 
          else alert("Primero debe sarse de alta");
        }}
          title="Perfil de Adopción"
          color="#841584"
        />

<Button
          onPress={() => { props.navigation.navigate('ModificarUsuario', {userId: props.route.params.userId});
        }}
          title="Editar Perfil"
          color="#841584"
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
  image : {
    height : 250, 
    width : 250,
    marginBottom : 15
  },
  texto: {
    fontSize : 18,
    padding : 5,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginBottom: 10
  }, 
  button: {
    alignItems: "center",
    padding: 10,
    marginTop : 25,
    backgroundColor: "#6c91c2",
  },
  buttonText: {
    fontSize: 18,
    colors: "#ffffff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"    
  }

});




export default PerfilUsuario; 