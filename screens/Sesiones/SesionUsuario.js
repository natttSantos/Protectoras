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

const handleTextChange = (value, prop) => {
  setUsuario({ ...usuario, [prop]: value });
};

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
}, []);


  return (
    <Tab.Navigator>
      <Tab.Screen name = 'Home' component = {Home} 
         options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={35} color={'blue'} />
          )
        }}
        initialParams={{ userId: props.route.params.userId, isUsuario:true }}
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