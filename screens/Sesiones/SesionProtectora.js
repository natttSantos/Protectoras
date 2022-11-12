import firebase from '../../database/firebase.js';
import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons'
import {View, ActivityIndicator, Button} from "react-native"

import PerfilProtectora from '../Perfiles/PerfilProtectora';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListaAnimalesProtectora from '../Listas/ListaAnimalesProtectora.js';
import AltaGlobal from '../Altas/AltaGlobal.js';
import ListaSolicitudes from '../Listas/ListaSolicitudes.js';

const SesionProtectora = (props) => {
  const initialState = {
    nombre:"",
    email:"",
    localizacion:"",
    direccion:"",
    url:"",
    descripcion:"",
    fotoModificada:""
  };
  const Tab = createBottomTabNavigator(); 

  const [usuario, setUsuario] = useState(initialState);
  const [animales, setAnimales] = useState([])
  const [loading, setLoading] = useState(true);

  const getUsuarioById = async (id) => {
    const dbRef = firebase.db.collection("protectoras").doc(id);
    const doc = await dbRef.get();
    const usuario = doc.data();
    setUsuario({ ...usuario, id: doc.id });
  };

  const getAllAnimalesDeProtectora = async (id) => {
    const animales = []

    const dbRef = firebase.db.collection('animales').where("id_protectora", "==", id)
    const docs = await dbRef.get()
    docs.forEach(doc => {
        const {nombre, sexo,descripcion, raza} = doc.data()
        animales.push({
            id: doc.id,
            id_protectora: id,
            nombre,
            raza,
            descripcion,
            sexo
        })
    })

    setAnimales(animales)
    setLoading(false)
    //const animales = doc.data()
  }

  useEffect(() => { 
    getUsuarioById(props.route.params.userId);
    getAllAnimalesDeProtectora(props.route.params.userId);
  }, []);

  if (loading) {
    return (
       <View>
           <ActivityIndicator />
       </View>
    )       
  }

    return (

      <Tab.Navigator>
        <Tab.Screen name = 'Home' component = {ListaAnimalesProtectora} 
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" size={35} color={'blue'} />
            )
          }}
          initialParams={{ animales: animales, userId: props.route.params.userId}}
        />
        <Tab.Screen name = 'Add' component = {AltaGlobal} 
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="add-circle-outline" size={35} color={'blue'} />
            )
          }}
          initialParams={{ userId: props.route.params.userId, isUsuario: false}}
        />
        <Tab.Screen name = 'Solicitudes' component = {ListaSolicitudes} 
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="briefcase-outline" size={35} color={'blue'} />
            )
          }}
          initialParams={{ userId: props.route.params.userId, isUsuario: false}}
        />
        <Tab.Screen name = 'Perfil' component = {PerfilProtectora} 
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="person-circle-outline" size={35} color={'blue'} />
            )
          }}
          initialParams={{ protectoraId: props.route.params.userId }}/>
      </Tab.Navigator>  
    );
};


export default SesionProtectora;