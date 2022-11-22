import firebase from '../../database/firebase.js';
import React, { useEffect, useState, useContext } from "react";
import Icon from 'react-native-vector-icons/Ionicons'

import PerfilUsuario from '../Perfiles/PerfilUsuario.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AltaGlobal from '../Altas/AltaGlobal.js';
import ListaProtectoras from '../Listas/ListaProtectoras.js';
import ListaAnimales from '../Listas/ListaAnimales.js';
import MapaAnimalEncontrado from '../Mapa/MapaAnimalEncontrado.js';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../components/CredentialsContext";

const SesionUsuario = (props) => {
  const initialState = {
    usuario: "",
    email: "" , 
    telefono: "", 
    nombre: "",
    contraseña: "",
    alta:""
  }
  const Tab = createBottomTabNavigator(); 

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

  const [usuario, setUsuario] = useState(initialState);
  const [nombreUsuario, setNombreUsuario] = useState([])
  const [loading, setLoading] = useState(true);
  const [protectoras, setProtectoras] = useState([]);
  const [animales, setAnimales] = useState([]);

  const handleTextChange = (value, prop) => {
    setUsuario({ ...usuario, [prop]: value });
  };

  const getProtectoras = async () => {
    firebase.db.collection('protectoras').onSnapshot((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        const {url, nombre, localizacion, email, direccion, descripcion, fotoModificada} = doc.data()
        protectoras.push({
          id: doc.id,
          url,
          nombre,
          localizacion,
          email,
          direccion,
          descripcion, 
          fotoModificada
        })
      });
      setProtectoras(protectoras)
    });
  }
  const getAnimales = async () => {
    firebase.db.collection('animales').onSnapshot((querySnapshot) => {
      const listaAnimales = []

      querySnapshot.docs.forEach((doc) => {
          const {nombre, descripcion, tipo} = doc.data()
          listaAnimales.push({
              id: doc.id,
              nombre,
              descripcion,
              tipo
          })
      });
      setAnimales(listaAnimales)
    })
  }


  const getUsuarioById = async (id) => {
    const dbRef = firebase.db.collection("users").doc(id);
    const doc = await dbRef.get();
    const usuario = doc.data();
    setUsuario({ ...usuario, id: doc.id });
    setNombreUsuario(usuario.usuario)
    console.log(usuario.usuario)
    setLoading(false);
  };

  useEffect(() => { 
    console.log(storedCredentials)
    getUsuarioById(storedCredentials); 
    getProtectoras(); 
    getAnimales(); 
  }, []);


  return (
    <Tab.Navigator>
      <Tab.Screen name = 'Home' component = {ListaAnimales} 
         options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "home" : "home-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{userId: storedCredentials, userName: nombreUsuario, isUsuario:true, animales:animales}}
      />
      <Tab.Screen name = 'Search' component = {ListaProtectoras} 
         options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "search" : "search-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{ userId: storedCredentials, isUsuario:true, protectoras:protectoras}}
      />
      <Tab.Screen name = 'Animal' component = {MapaAnimalEncontrado} 
         options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "paw" : "paw-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{ userId: storedCredentials, isUsuario:true}}
      />

      <Tab.Screen name = 'Add' component = {AltaGlobal} 
         options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "add-circle" : "add-circle-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{ userId: storedCredentials, isUsuario:true}}
      />
      <Tab.Screen name = 'Perfil' component = {PerfilUsuario} 
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "person-circle" : "person-circle-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{ userId: storedCredentials, canEdit: true }}/>
    </Tab.Navigator>  
  );
};


export default SesionUsuario;