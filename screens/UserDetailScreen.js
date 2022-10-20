import firebase from '../database/firebase.js';
import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {   
    View,
    ActivityIndicator,
    StyleSheet} from "react-native";

import ListaAnimalesProtectora from './Listas/ListaAnimalesProtectora';
import PerfilProtectora from './Perfiles/PerfilProtectora';


const UserDetailScreen = (props) => {
    const Tab = createBottomTabNavigator(); 
    const [protectoraActual, setProtectora] = useState({
        id: "",
        nombre: ""
    })

    const [animales, setAnimales] = useState([])
    const [loading, setLoading] = useState(true);

    const getProtectoraPorId = async (id) => {
        const dbRef = firebase.db.collection('protectoras').doc(id)
        const doc = await dbRef.get()
        const protectora = doc.data()
        setProtectora({
            ...protectoraActual,
            id: protectora.id
        })
    }

    const getAllAnimalesDeProtectora = async (id) => {
        const animales = []

        const dbRef = firebase.db.collection('animales').where("id_protectora", "==", id)
        const docs = await dbRef.get()
        docs.forEach(doc => {
            const {nombre, sexo, edad, raza} = doc.data()
            animales.push({
                id: doc.id,
                id_protectora: id,
                nombre,
                raza,
                edad,
                sexo

            })
        })

        setAnimales(animales)
        setLoading(false)
        //const animales = doc.data()
    }

    useEffect(() => {
        getProtectoraPorId(props.route.params.userId)
        getAllAnimalesDeProtectora(props.route.params.userId)
    }, [])


    if (loading) {
         return (
            <View>
                <ActivityIndicator />
            </View>
         )       
    }
    return (
        <>
        <Tab.Navigator>
            <Tab.Screen name='Home' component={ListaAnimalesProtectora}
            options={{
                headerShown: false,
                tabBarIcon: () => (
                    <Icon name="home-outline" size={35} color={'blue'} />
                )
            }} 
            initialParams={{animales: animales}}/>
            <Tab.Screen name='Perfil' component={PerfilProtectora}
            options={{
                headerShown: false,
                tabBarIcon: () => (
                    <Icon name="person-circle-outline" size={35} color={'blue'} />
                )
            }}
            initialParams={{protectoraId: props.route.params.userId}}
            />
        </Tab.Navigator>
        </>
    
    );
}

const styles = StyleSheet.create({
        bottom: {
          backgroundColor: 'aquamarine',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        fab: {
          position: 'absolute',
          right: 20,
        },
        input: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
          },
          titulo: {
              margin: 12,
              padding: 10,
              fontSize: 40,
              fontWeight: 'bold',
              textAlign: "left"
          }
      });


export default UserDetailScreen; 