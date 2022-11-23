import React, { useEffect, useState, useCallback, useContext } from "react";
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../components/CredentialsContext";

const PerfilProtectora = (props) => {

  const initialState = {
    nombre:"",
    email:"",
    localizacion:"",
    direccion:"",
    url:"",
    descripcion:"",
    fotoModificada:""
  };

  const initialStatee = {
    imageFirebase:"a",
    staet :""
    
  };

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  const {type, setType} = useContext(CredentialsContext)

  const [cosas, setState] = useState(initialStatee);
  const [loading, setLoading] = useState(true);
  const [cambios, setcambios] = useState(false);
  const [protectora, setProtectora] = useState(initialState);

  const clearLogin = () => {
    console.log('presionado')
    AsyncStorage.removeItem('getPetCredentials')
    .then(() =>{
      setStoredCredentials(null);
    })
    .catch((error) =>{console.log(error)})
  }

  const getProtectoraById = async (id) => {
    const dbRef = firebase.db.collection("protectoras").doc(id);
    const doc = await dbRef.get();
    const protectora = doc.data();
    setProtectora({ ...protectora, id: doc.id });
    setLoading(false);
    firebase
    .st
    .ref(`imagesProtectora/${protectora.fotoModificada}`)
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
  }, [cambios]);
  
  if(loading) {
    return(
        <View>
            <ActivityIndicator />
        </View>
    )
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
        <View style={{marginBottom: 50}}>
        {!type ? 

          <>
          
          <TouchableOpacity
              onPress={clearLogin}
              style={styles.boton}
            >
              <Text style={styles.buttonText}>
                              Cerrar sesión
                          </Text>
          </TouchableOpacity>
            <TouchableOpacity 
                      onPress={() => {
                        props.navigation.navigate('ModificarProtectora', {userId: storedCredentials}) 
                      }}
                      style={styles.boton}>
                          <Text style={styles.buttonText}>
                              MODIFICAR
                          </Text>
          </TouchableOpacity>
          </>
        : null}
        </View>
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