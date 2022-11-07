import firebase from '../../database/firebase.js';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons'

import { Tab } from 'react-native-elements';
import PerfilUsuario from '../Perfiles/PerfilUsuario.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegistrarUsuario from '../Altas/RegistrarUsuario.js';
import UserDetailScreen from '../UserDetailScreen.js';
import Home from '../Home.js';
import RegistrarAnimal from '../Altas/RegistrarAnimal';
import AltaGlobal from '../Altas/AltaGlobal.js';
import ListaProtectoras from '../Listas/ListaProtectoras.js';
import ListaAnimales from '../Listas/ListaAnimales.js';
import MapaAnimalEncontrado from '../Mapa/MapaAnimalEncontrado.js';

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


const [usuario, setUsuario] = useState(initialState);
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
  console.log(usuario)
  setUsuario({ ...usuario, id: doc.id });
  setLoading(false);
};

useEffect(() => { 
  getUsuarioById(props.route.params.userId); 
  getProtectoras(); 
  getAnimales(); 
}, []);


  return (
    <Tab.Navigator>
      <Tab.Screen name = 'Home' component = {ListaAnimales} 
         options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={35} color={'blue'} />
          )
        }}
        initialParams={{ userId: props.route.params.userId, isUsuario:true, animales:animales}}
      />
      <Tab.Screen name = 'Search' component = {ListaProtectoras} 
         options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="search-outline" size={35} color={'blue'} />
          )
        }}
        initialParams={{ userId: props.route.params.userId, isUsuario:true, protectoras:protectoras}}
      />
      <Tab.Screen name = 'Animal' component = {MapaAnimalEncontrado} 
         options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="paw-outline" size={35} color={'blue'} />
          )
        }}
        initialParams={{ userId: props.route.params.userId, isUsuario:true}}
      />

      <Tab.Screen name = 'Add' component = {AltaGlobal} 
         options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="add-circle-outline" size={35} color={'blue'} />
          )
        }}
        initialParams={{ userId: props.route.params.userId, isUsuario:true}}
      />
      <Tab.Screen name = 'Perfil' component = {PerfilUsuario} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-circle-outline" size={35} color={'blue'} />
          )
        }}
        initialParams={{ userId: props.route.params.userId }}/>
    </Tab.Navigator>  
  );
};


export default SesionUsuario;