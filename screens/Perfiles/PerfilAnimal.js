import React, { useEffect, useState } from "react";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';


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
import { TouchableOpacity } from "react-native";

import firebase from "../../database/firebase";
import { enableScreens } from "react-native-screens";


/*  const state = {
  imageFirebase: ""
};*/



/*const [state, SetState] = useState({
  imageFirebase: "",
})*/

const PerfilAnimal = (props) => {

const a = "https://firebasestorage.googleapis.com/v0/b/react-native-firebase-a2b50.appspot.com/o/images%2F7Ge1DcO93w0xDOzWOKXg?alt=media&token=ce324ed2-b8a8-42c2-a470-5d61b0fbe602";
  const initialStatee = {
    imageFirebase:"a",
    staet :""
    
  };
   
  const initialState = {
      nombre:"",
      tipo:"",
      raza:"",
      sexo:"",
      descripcion:"",
      foto:"",
      fecha_nacimiento: "", 
      id_protectora: "", 
      adoptado: "", 
      peso: "", 
      edad: "", 
      nivelActividad: "", 
      vacunado: "", 
      microchip: ""
  }
  var u = "aaa";

  const [animal, setAnimal] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [cosas, setState] = useState(initialStatee);

const [usuario, setUsario] = useState("");
const [esUsuario] = useState(props.route.params.esUsuario);

//Campos Opcionales
const [pesoOpcional, setPesoOpcional] = useState("");
const [edadOpcional, setEdadOpcional] = useState("");
const [nivelOpcional, setNivelOpcional] = useState("");
const [vacunadoOpcional, setVacunadoOpcional] = useState("No");
const [microChipOpcional, setMicroChipOpcional] = useState("No");




  const uploadImage = uri => {
    return new Promise((resolve, reject) => {
      console.log(resolve + " " + reject);
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };

      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
    });
  };


  
  const openGallery = async () => {
    
    const resultPermission =true; 
    if (resultPermission) {
      const resultImagePicker = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (resultImagePicker.cancelled === false) {
        const imageUri = resultImagePicker.uri;
        console.log(imageUri);
        console.log(animal.nombre);
        uploadImage(imageUri)
          .then(resolve => {
            let ref = firebase
            .st
            .ref()
            .child(`images/${animal.nombre}`);
            ref
              .put(resolve)
              .then(resolve => {
                console.log("Imagen subida correctamente");
              })
              .catch(error => {
                console.log(error);
                console.log(error);
                console.log("Error al subir la imagen");
              });
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };


/*METODO LOADIMAGE PARA PRUEBAS NO BORRAR
  const loadImage = async () => {
      firebase
      .st
      .ref(`images/${animal.nombre}`)
      .getDownloadURL().then(function(url) {
      setState({
       imageFirebase: url
    });
  });

  };
*/

const getUsuarioById = async (id) => {
  const dbRef = firebase.db.collection("users").doc(id);
  const doc = await dbRef.get();
  const usuario = doc.data();
  setUsario({...usuario, id: doc.id});
  setLoading(false);
};


  const getAnimalById = async (id) => {
    const dbRef = firebase.db.collection("animales").doc(id);
    const doc = await dbRef.get();
    const animal = doc.data();
    setAnimal({ ...animal, id: doc.id });
    setLoading(false);

    firebase
    .st
    .ref(`images/${animal.nombre}`)
    .getDownloadURL().then(function(url) {
    setState({
     imageFirebase: url
  });
});
    validateOptionalFields(animal); 
    checkMicrochip_Vacunado(animal); 
  };

  const validateOptionalFields = (value) => {
    let noInfo = "No tenemos información sobre esta característica."; 
    if(value.peso == ""){
      setPesoOpcional(noInfo); 
    } else {
      setPesoOpcional(value.peso + " Kg")
    }
    if(value.edad == ""){
      setEdadOpcional(noInfo); 
    } else {
      setEdadOpcional(value.edad + " años")
    }
    if(value.nivelActividad == ""){
      setNivelOpcional(noInfo); 
    } else {
      setNivelOpcional(value.nivelActividad); 
    }
  }
  
const checkMicrochip_Vacunado = (value) => {
  if(value.microchip === true){
    setMicroChipOpcional("Si")
  } 
  if(value.vacunado === true){
    setVacunadoOpcional("Si")
  }
}
  const updateAnimal = async () => {
    const animalRef = firebase.db.collection("animales").doc(animal.id);
    await animalRef.set({
      nombre: animal.nombre,
      edad: animal.edad.toString(),
      raza: animal.raza,
      sexo: animal.sexo,
      fecha_nacimiento: animal.fecha_nacimiento,
      descripcion: animal.descripcion,
    });
    setAnimal(initialState);
    props.navigation.navigate("ListaAnimales");
  };

  const enviarSolicitud = async () => {
    // await firebase.db.collection('solicitudes').add(
    //   id_protectora: 
    // )
  }

  useEffect(() => {
    getAnimalById(props.route.params.animalId);
    getUsuarioById(props.route.params.userId);  
  }, []);


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

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

  const adoptarAnimal = () => {
    if(usuario.alta=="Si") { 
      Alert.alert("Información", "Solicitud enviada correctamente", [
        {text: "Cerrar"}
    ]);
    } else {
      Alert.alert("Información", "Tienes que completar tu perfil para poder adoptar", [
        {text: "Cerrar"},
        {text: "Completar perfil",  onPress: () => props.navigation.navigate('AltaAdoptar', {userId: props.route.params.userId})}
    ]);
    }

  };


/*
NO BORRAR
        <TouchableOpacity  
            style={styles.boton} 
            onPress={() => openGallery()}
            >
              <Text>Selecciona una imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity  
            style={styles.boton} 
            onPress={() => loadImage()}
            >
              <Text>Cargar una imagen</Text>
        </TouchableOpacity>

*/




  return (
    
    <ScrollView style={styles.container}>
    
      <View>
       {checkImage()}
        <Text style = {styles.texto} >
          {"Nombre: " + animal.nombre}
        </Text>
        <Text style = {styles.texto} >
          {"Raza: " + animal.raza}
        </Text>
        <Text style = {styles.texto} >
          {"Sexo: " + animal.sexo}
        </Text>    
        <Text style = {styles.texto} >
          {"Fecha de nacimiento: " + animal.fecha_nacimiento}
        </Text>     
        <Text style = {styles.texto} >
          {"Edad: " + edadOpcional}
        </Text> 
        <Text style = {styles.texto} >
          {"Peso: " + pesoOpcional}
        </Text> 
        <Text style = {styles.texto} >
          {"Vacunado: " + vacunadoOpcional}
        </Text> 
        <Text style = {styles.texto} >
          {"MicroChip: " + microChipOpcional}
        </Text> 
        <Text style = {styles.texto} >
          {"Nivel Actividad: " + nivelOpcional}
        </Text>
        <Text style = {styles.texto} >
          {"Descripción: " + animal.descripcion}
        </Text>

        {esUsuario ?  
          <TouchableOpacity  
            style={styles.boton} 
            onPress={() => adoptarAnimal()}
            >
              <Text>Adoptar</Text>
        </TouchableOpacity>
        : null}
      </View> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    marginTop: 5,
    marginBottom: 5,
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
    height : 170, 
    width : 170
},
title : {
  fontSize: 50,
  fontWeight: "bold", 
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
  marginBottom: 5
}
});

export default PerfilAnimal;