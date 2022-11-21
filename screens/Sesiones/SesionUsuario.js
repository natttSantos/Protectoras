import firebase from '../../database/firebase.js';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import PerfilUsuario from '../Perfiles/PerfilUsuario.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AltaGlobal from '../Altas/AltaGlobal.js';
import ListaProtectoras from '../Listas/ListaProtectoras.js';
import ListaAnimales from '../Listas/ListaAnimales.js';
import MapaAnimalEncontrado from '../Mapa/MapaAnimalEncontrado.js';
import { TouchableOpacity } from 'react-native';

const SesionUsuario = (props) => {
  const navigation = props.navigation

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
const [nombreUsuario, setNombreUsuario] = useState([])
const [loading, setLoading] = useState(true);
const [protectoras, setProtectoras] = useState([]);
const [animales, setAnimales] = useState([]);
const [notificaciones, setNotificaciones] = useState([])

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

const getAllNotificaciones = async (id_usuario) => {
  const notiAux = []

  const notis = await firebase.db.collection('notificaciones').where("id_usuario", "==", id_usuario).get()
  notis.docs.map(doc => {
    const nose = {
      id: doc.id,
      id_usuario: doc.data().id_usuario,
      mensaje: doc.data().mensaje,
      leido: doc.data().leido,
    }
    notiAux.push(nose)
  })
  console.log(notiAux)
  setNotificaciones(notiAux)
  setLoading(false)
}

const alVolver = () => {
  notificaciones.map(async (noti) => {
    noti.leido = true
    await firebase.db.collection('notificaciones').doc(noti.id).set({leido: true}, {merge: true})
  });
}

const getUsuarioById = async (id) => {
  const dbRef = firebase.db.collection("users").doc(id);
  const doc = await dbRef.get();
  const usuario = doc.data();
  setUsuario({ ...usuario, id: doc.id });
  setNombreUsuario(usuario.usuario)
  console.log(usuario.usuario)
  //setLoading(false);
};

useEffect(() => { 
  getUsuarioById(props.route.params.userId); 
  getAllNotificaciones(props.route.params.userId)
  getProtectoras(); 
  getAnimales(); 
}, []);

useEffect(() => { 
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('Notificaciones', 
        { alVolver: () => alVolver(), notificaciones: notificaciones })} style={styles.notiContainer}>
        <Icon name="notifications" size={25}/>
        {notificaciones.filter(noti => noti.leido == false) != 0 ?
          <View style={styles.numNotisContainer}>
            <Text style={styles.numNotis}>{notificaciones.filter(noti => noti.leido == false).length}</Text>
          </View>
        : null}
      </TouchableOpacity>
    )
  })
}, [navigation, loading]);


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
        initialParams={{userId: props.route.params.userId, userName: nombreUsuario, isUsuario:true, animales:animales}}
      />
      <Tab.Screen name = 'Search' component = {ListaProtectoras} 
         options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "search" : "search-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{ userId: props.route.params.userId, isUsuario:true, protectoras:protectoras}}
      />
      <Tab.Screen name = 'Animal' component = {MapaAnimalEncontrado} 
         options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "paw" : "paw-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{ userId: props.route.params.userId, isUsuario:true}}
      />

      <Tab.Screen name = 'Add' component = {AltaGlobal} 
         options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "add-circle" : "add-circle-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{ userId: props.route.params.userId, isUsuario:true}}
      />
      <Tab.Screen name = 'Perfil' component = {PerfilUsuario} 
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "person-circle" : "person-circle-outline";

            return <Icon name={iconName} size={35} color={'blue'} />
          }
        }}
        initialParams={{ userId: props.route.params.userId, canEdit: true }}/>
    </Tab.Navigator>  
  );
};

const styles = StyleSheet.create({
    notiContainer: {
      flexDirection: 'row',
    },
    numNotis: {
      color: 'white',
      bottom: 2
    },
    numNotisContainer: {
      backgroundColor: 'red',
      bottom: 3,
      height: 17,
      width: 17,
      borderRadius: 17/2,
      alignItems: 'center',
      right: 12
    }
})
export default SesionUsuario;