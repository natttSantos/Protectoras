import firebase from '../../database/firebase.js';
import React, { useEffect, useState, useContext } from "react";
import Icon from 'react-native-vector-icons/Ionicons'
import {View, ActivityIndicator, Button} from "react-native"

import PerfilProtectora from '../Perfiles/PerfilProtectora';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListaAnimalesProtectora from '../Listas/ListaAnimalesProtectora.js';
import AltaGlobal from '../Altas/AltaGlobal.js';
import ListaSolicitudes from '../Listas/ListaSolicitudes.js';
import MapaAnimalEncontradoProtectora from '../Mapa/MapaAnimalEncontradoProtectora.js';
import { useIsFocused } from '@react-navigation/native';
import { CredentialsContext } from '../../components/CredentialsContext';

const SesionProtectora = (props) => {
  const isFocused = useIsFocused()
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

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

  //const [usuario, setUsuario] = useState(initialState);
  const [animales, setAnimales] = useState([])
  const [loading, setLoading] = useState(true);

  // const getUsuarioById = async (id) => {
  //   const dbRef = firebase.db.collection("protectoras").doc(id);
  //   const doc = await dbRef.get();
  //   const usuario = doc.data();
  //   setUsuario({ ...usuario, id: doc.id });
  // };

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
  }

  // useEffect(() => { 
  //   getUsuarioById(props.route.params.userId);
  // }, []);

  useEffect(() => { 
    if(isFocused) {
      setLoading(true)
      getAllAnimalesDeProtectora(storedCredentials);
    }
  }, [isFocused]);

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
            tabBarIcon: ({ focused, color, size }) => {
              let colorA = focused ? "#5B1D66" : "#FFB743";
  
              return <Icon name="home-outline" size={35} color={colorA} />
            }
          }}
          initialParams={{ animales: animales, userId: storedCredentials}}
        />
        <Tab.Screen name = 'Add' component = {AltaGlobal} 
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = focused ? "add-circle" : "add-circle-outline";
  
              return <Icon name={iconName} size={35} color={'blue'} />
            }
          }}
          initialParams={{ userId: storedCredentials, isUsuario: false}}
        />
              <Tab.Screen name = 'Animal' component = {MapaAnimalEncontradoProtectora} 
         options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "paw" : "paw-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{ userId: storedCredentials, isUsuario:true}}
      />
        <Tab.Screen name = 'Solicitudes' component = {ListaSolicitudes} 
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = focused ? "file-tray-full" : "file-tray-full-outline";
  
              return <Icon name={iconName} size={35} color={'blue'} />
            }
          }}
          initialParams={{ userId: storedCredentials, isUsuario: false}}
        />
        <Tab.Screen name = 'Perfil' component = {PerfilProtectora} 
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = focused ? "person-circle" : "person-circle-outline";
  
              return <Icon name={iconName} size={35} color={'blue'} />
            }
          }}

          initialParams={{ protectoraId: storedCredentials, isUsuario: false }}/>
      </Tab.Navigator>  
    );
};


export default SesionProtectora;