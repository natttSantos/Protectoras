import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  Button,
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
    descripcion:"",
    fotoModificada:""
  };

  const initialStatee = {
    imageFirebase:"a",
    staet :""
    
  };

  const [cosas, setState] = useState(initialStatee);

  const [protectora, setProtectora] = useState(initialState);

  const getProtectoraById = async (id) => {
    const dbRef = firebase.db.collection("protectoras").doc(id);
    const doc = await dbRef.get();
    const protectora = doc.data();
    setProtectora({ ...protectora, id: doc.id });

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
    getProtectoraById(props.route.params.userId);
  }, []);
//<Image source={require(' /images/Greenpeace.jpg')} style={styles.image}/>
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
        <Button title="Modificar" onPress={() => {
                      props.navigation.navigate('ModificarProtectora', {userId: props.route.params.userId}),
                      console.log(props.route.params.userId)
                    }} />
        <TouchableOpacity 
                    onPress={() => {
                      props.navigation.navigate('ModificarProtectora', {userId: props.route.params.userId}) 
                    }}
                    style={styles.button}>
                        <Text style={styles.buttonText}>
                            Dar de alta protectora
                        </Text>
        </TouchableOpacity>
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
  boton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
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