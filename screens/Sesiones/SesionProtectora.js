import firebase from '../../database/firebase.js';
import React, { useEffect, useState, useContext } from "react";
import Icon from 'react-native-vector-icons/Ionicons'
import {View, ActivityIndicator, Image, StyleSheet} from "react-native"

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
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
        "tabBarShowLabel": false,
        "tabBarStyle": [
          {
            "display": "flex"
          },
          null
        ]
      }}>
        <Tab.Screen name = 'Home' component = {ListaAnimalesProtectora} 
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return <Image 
                style={styles.image}
                source={ focused ? require('../../images/LogoSeleccionado.png') : require('../../images/Logo.png')}
              />
            }
          }}
          initialParams={{ animales: animales, userId: storedCredentials}}
        />
        <Tab.Screen name = 'Add' component = {AltaGlobal} 
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              let colorA = focused ? "#5B1D66" : "#FFB743";
  
              return <Icon name={'add-circle-outline'} size={35} color={colorA} />
            }
          }}
          initialParams={{ userId: storedCredentials, isUsuario: false}}
        />
        <Tab.Screen name = 'Animal' component = {MapaAnimalEncontradoProtectora} 
         options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let colorA = focused ? "#5B1D66" : "#FFB743";

            return <Icon name={"location-outline"} size={35} color={colorA} />
          }
        }}
        initialParams={{ userId: storedCredentials, isUsuario:true}}
      />
        <Tab.Screen name = 'Solicitudes' component = {ListaSolicitudes} 
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              let colorA = focused ? "#5B1D66" : "#FFB743";
  
              return <Icon name={"mail-outline"} size={35} color={colorA} />
            }
          }}
          initialParams={{ userId: storedCredentials, isUsuario: false}}
        />
        <Tab.Screen name = 'Perfil' component = {PerfilProtectora} 
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              let colorA = focused ? "#5B1D66" : "#FFB743";
  
              return <Icon name={"person-circle-outline"} size={35} color={colorA} />
            }
          }}

          initialParams={{ protectoraId: storedCredentials, isUsuario: false }}/>
      </Tab.Navigator>  
    );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: 22,
    height: 22,
    resizeMode: 'contain'
  }
})

export default SesionProtectora;