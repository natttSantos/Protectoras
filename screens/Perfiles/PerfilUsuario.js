
import firebase from '../../database/firebase.js';
import React, { useEffect, useState, useContext } from "react";
import { Appbar} from 'react-native-paper';
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
import { TouchableOpacity } from 'react-native';
import {colors} from '../../components/Color';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../components/CredentialsContext";
import _ from 'lodash';

const PerfilUsuario = (props) => {
  

  const initialState = {
    usuario: "",
    email: "",
    telefono: "",
    nombre: "",
    contraseña: "",
    alta: "",
  }
  const initialStatePerfilAdoptar = {
    nombre:"",
    apellidos:"",
    localizacion:"",
    dni:"",
    n_animales:"",
    
  };

  const initialStatee = {
    imageFirebase: "a",
    staet: ""
  };

  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  const {type, setType} = useContext(CredentialsContext);

  const [sinFoto, setState] = useState(initialStatee);
  const [usuario, setUsario] = useState(initialState);
  const [perfilAdoptar, setPerfilAdoptar] = useState(initialStatePerfilAdoptar);
  const [loading, setLoading] = useState(true);

  const handleTextChange = (value, prop) => {
    setUsario({ ...usuario, [prop]: value });
  };

  const getUsuarioById = async (id) => {
    const dbRef = firebase.db.collection("users").doc(id);
    const doc = await dbRef.get();
    const usuario = doc.data();
    
    setUsario({ ...usuario, id: doc.id });
    setLoading(false);
    if (usuario.alta == "Si"){
      setPerfilAdoptar({ ...usuario, id: doc.id });
      firebase
      .st
      .ref(`imagesUsuario/${id}`)
      .getDownloadURL().then(function (url) {
        console.log(url);
        setState({
          imageFirebase: url
        });
      });
    }
  };

  const checkImage = () => {
    const { imageFirebase } = sinFoto;
    if (imageFirebase != "a") {
      return (
        <Image
        style={styles.image}
        source={{ uri: imageFirebase }}
      />
      );

    }
    else {
      <Image
          style={styles.image}
          source={require('../../images/gatitos.jpg')}
        />
    }
    return null;
  }

  const checkPerfilAdopcion = () => {
    if (usuario.alta == "No") {
      return (
        <View style={styles.containerPerfilAdopcion}>
        <Text style={styles.textoSinPerfilAdopcion}>No tiene un perfil de adopción </Text>
        <View style= {styles.textContainer}>

        {props.route.params.canEdit ?
          <>
           <TouchableOpacity 
                   onPress={() => {
                      props.navigation.navigate('AltaAdoptar', { userId: storedCredentials });
                  }}
                    style={styles.botonCircularMorado}>
                        <Text style={styles.botonTexto}>
                        Dar de alta para adoptar
                        </Text>
                </TouchableOpacity>
        </>
        : null}
        </View>
        </View>
      );

    }
    else {
      return (
        <View style={styles.containerPerfilAdopcion}>
        <Text style={styles.tituloPerfilAdopcionEnunciado}>Perfil de adopción</Text>
        <Text style={styles.textoPerfilAdopcionEnunciado}>Nombre</Text>
        <Text style={styles.textoPerfilAdopcion}>{perfilAdoptar.nombre}</Text>
        <Text style={styles.textoPerfilAdopcionEnunciado}>Apellidos</Text>
        <Text style={styles.textoPerfilAdopcion}>{perfilAdoptar.apellidos}</Text>
        <Text style={styles.textoPerfilAdopcionEnunciado}>DNI</Text>
        <Text style={styles.textoPerfilAdopcion}>{perfilAdoptar.dni} </Text>
        <Text style={styles.textoPerfilAdopcionEnunciado}>Número de animales</Text>
        <Text style={styles.textoPerfilAdopcion}>{perfilAdoptar.n_animales} </Text>
        <Text style={styles.textoPerfilAdopcionEnunciado}>Localización</Text>
        <Text style={styles.textoPerfilAdopcion}>{perfilAdoptar.localizacion} </Text>
        <View style= {styles.textContainer}>
          
        {/* {props.route.params.canEdit ?
          <>
           <TouchableOpacity 
                   onPress={() => {
                    if (usuario.alta == "No")
                      props.navigation.navigate('AltaAdoptar', { userId: storedCredentials });
                    else
                      alert("Ya se ha dado de alta");
                  }}
                    style={styles.botonCircularMorado}>
                        <Text style={styles.botonTexto}>
                        Dar de alta para adoptar
                        </Text>
                </TouchableOpacity>
        </>
        : null} */}
        </View>
        </View>
      );
    }
    
  }

  useEffect(() => {
    if (_.isUndefined(props.route.params.userId)) {
      getUsuarioById(storedCredentials);
    } else {getUsuarioById(props.route.params.userId)}
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  const clearLogin = () => {
    console.log('presionado')
    AsyncStorage.removeItem('getPetCredentials')
    .then(() =>{
      setStoredCredentials(null);
    })
    .catch((error) =>{console.log(error)})
  }

  //<Image source={require('../images/perfilUsuario.jpg')} style={styles.image}/>
  return (
    <View style={styles.container}>

    {props.route.params.canEdit ? 
      <Appbar.Header style={styles.appBar}>
          <Appbar.Content title="" />
          <Appbar.Action icon="lead-pencil" size={30} onPress={() => {
                  if (usuario.alta == "Si")
                    props.navigation.navigate('ModificarUsuario', { userId: storedCredentials });
                  else
                    alert("Primero debe darse de alta!");
                }} />
          <Appbar.Action icon="logout" size={30} onPress={clearLogin} />
    </Appbar.Header>
  : null}


      <View style={styles.textContainerGmailTlf}>
        {checkImage()}
        <Text style={styles.textoNombreUsuario} >{usuario.usuario}</Text>
        <Text style={styles.textoGmailTlf}>{usuario.email}</Text>
        <Text style={styles.textoGmailTlf}>{usuario.telefono}</Text>
        </View>

        {checkPerfilAdopcion()}
      </View>
    
  );


};

const styles = StyleSheet.create({
  container: {
        flex: 1, 
        backgroundColor: colors.amarillo
  },
  image: {
        width: 100,
        height: 100,
        alignSelf: "center", 
        top: -50, 
        position: "absolute", 
        borderRadius: 75
  },
  textContainer: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    position: "absolute", 
    alignSelf: 'center', 
    bottom: -180,
    flex: 1
},
textContainerGmailTlf: {
  height: '50%',
  width: '100%',
  justifyContent: 'center',
  position: "absolute", 
  alignSelf: 'center', 
  bottom: 258, 
  flex: 1
},
  textoGmailTlf: {
    fontSize: 14,
    alignSelf: "center", 
    padding: 5,
    color: colors.blanco,
    fontWeight: 'bold', 
    marginBottom: 4
  },
  textoNombreUsuario: {
    fontSize: 24,
    alignSelf: "center", 
    color: colors.blanco,
    fontWeight: 'bold', 
    marginBottom: 4, 
    marginTop: -160
  },
  textoSinPerfilAdopcion: {
    fontSize: 18, 
    color: "#AD8EB3",
    fontWeight: 'bold', 
    padding: 40,
    marginBottom: 200
  },
  containerPerfilAdopcion: {
    height: '68%',
    width: '100%',
    justifyContent: 'center',
    position: "absolute", 
    backgroundColor: colors.blanco,
    borderRadius: 35, 
    alignSelf: 'center', 
    bottom: -26, 
    flex: 1
  },
  tituloPerfilAdopcionEnunciado: {
    fontSize: 21, 
    fontWeight: 'bold', 
    color: "#5B1D66",
    padding: 60,
    marginTop: -165, 
    marginBottom: -100
  },
  textoPerfilAdopcionEnunciado: {
    fontSize: 14, 
    color: "#AD8EB3",
    padding: 60,
    marginBottom: -110
  },
  textoPerfilAdopcion: {
    fontSize: 14, 
    padding: 60,
    marginBottom: -100
  },
  botonCircularMorado : {
        backgroundColor: colors.moradoPrincipal,
        borderColor: colors.blanco,
        borderWidth: 2,
        width:260,
        height:42,
        borderRadius: 25,
        marginBottom: -100, 
        alignSelf: "center",
        marginTop: -330
      },
      botonTexto: {
        fontSize: 18,
        color: colors.blanco,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 5
      }, 
  appBar: {
    flex: 1, 
    justifyContent: "space-between",
    elevation: 0, 
    backgroundColor: colors.amarillo,
    padding: 50,
    marginTop: 52
  },

});





export default PerfilUsuario; 