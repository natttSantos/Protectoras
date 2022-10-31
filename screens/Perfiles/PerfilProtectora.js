import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  Button,
  ActivityIndicator,
  Alert
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

import firebase from "../../database/firebase";

const PerfilProtectora = (props) => {

  const initialState = {
    nombre:"",
    email:"",
    localizacion:"",
    direccion:"",
    url:"",
    descripcion:""
  };

  const initialStatee = {
    imageFirebase:"a",
    staet :""
    
  };

  const [cosas, setState] = useState(initialStatee);
  const [loading, setLoading] = useState(true);
  const [protectora, setProtectora] = useState(initialState);

  const getProtectoraById = async (id) => {
    const dbRef = firebase.db.collection("protectoras").doc(id);
    const doc = await dbRef.get();
    const protectora = doc.data();
    setProtectora({ ...protectora, id: doc.id });
    setLoading(false);
    firebase
    .st
    .ref(`imagesProtectora/${protectora.nombre}`)
    .getDownloadURL().then(function(url) {
    setState({
     imageFirebase: url
  });
});

  };


  const checkImage = () => {
    const { imageFirebase } = cosas;
    if (cosas != "") {
      return (
        <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: imageFirebase }}
        />
      );
    }
    return null;
  }

  useEffect(() => {
    getProtectoraById(props.route.params.protectoraId);
  }, []);
//<Image source={require(' /images/Greenpeace.jpg')} style={styles.image}/>
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
      {checkImage()}
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
          {"Descripción: " + protectora.descripcion}
        </Text>
        <BotonAbrirURL url={protectora.url}>
          Página web
        </BotonAbrirURL>
      </View>
      
    </ScrollView>
  );
};

const BotonAbrirURL = ({ url }) => {
  
    const handlePress = useCallback(async () => {
    //Revisando si el link es soportado/válido
    const soportado = await Linking.canOpenURL(url);

    if (soportado) {
      // Abirendo el link con el navegador del teléfono
      await Linking.openURL(url);
    } else {
      Alert.alert(`No es posible abrir la URL: ${url}`);
    }
  }, [url]);

  return <TouchableOpacity  
            style={styles.boton} 
            onPress={handlePress} 
            >
              <Text>PÁGINA WEB</Text>
          </TouchableOpacity>
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
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  boton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    marginTop : 25,
    padding: 10
  },
  texto: {
    fontSize : 16,
    padding : 5,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginTop : 13
  }
});

export default PerfilProtectora;