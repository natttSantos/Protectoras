import firebase from '../../database/firebase.js';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons'
import {View, ActivityIndicator} from "react-native"

import { Tab } from 'react-native-elements';
import PerfilProtectora from '../Perfiles/PerfilProtectora';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegistrarUsuario from '../Altas/RegistrarUsuario.js';
import ListaAnimalesProtectora from '../Listas/ListaAnimalesProtectora.js';
import RegistrarAnimal from '../Altas/RegistrarAnimal';
import AltaGlobal from '../Altas/AltaGlobal.js';

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
    console.log(usuario)
    setUsuario({ ...usuario, id: doc.id });
    console.log(id + "   a     ");
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
          initialParams={{ animales: animales}}
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