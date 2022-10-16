import firebase from '../database/firebase.js';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState } from "react";
import {Avatar, ListItem} from "react-native-elements";
import {   
    ScrollView,
    Button,
    Text,
    View,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Image,
    TextInput
} from "react-native";
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes.js';

const BOTTOM_APPBAR_HEIGHT = 80;
const MEDIUM_FAB_HEIGHT = 56;

const UserDetailScreen = (props) => {

    const [protectoraActual, setProtectora] = useState({
        id: "",
        nombre: ""
    })

    const [animales, setAnimales] = useState([])

    const getProtectoraPorId = async (id) => {
        const dbRef = firebase.db.collection('protectoras').doc(id)
        const doc = await dbRef.get()
        const protectoraActual = doc.data()
        setProtectora({
            ...protectoraActual,
            id: protectoraActual.id
        })
    }

    const getAllAnimalesDeProtectora = async (id) => {
        const animales = []

        const dbRef = firebase.db.collection('animales').where("id_protectora", "==", id)
        const docs = await dbRef.get()
        docs.forEach(doc => {
            const {nombre} = doc.data()
            animales.push({
                id: doc.id,
                id_protectora: id,
                nombre
            })
        })

        setAnimales(animales)
        //const animales = doc.data()
    }

    useEffect(() => {
        getProtectoraPorId(props.route.params.protectoraId)
        getAllAnimalesDeProtectora(props.route.params.protectoraId)
    }, [])


        return (
            <><ScrollView>
                {animales.map(animal => {
                    return (
                        <ListItem key={animal.id}
                            bottomDivider>
                            <Avatar 
                            style = {styles.imagen}
                            source = {{uri: 'https://statics.memondo.com/p/s1/ccs/2022/10/CC_2795378_7e45a8644f28403f99ef1c5df2008edf_meme_otros_este_es_mierdon_thumb_fb.jpg?cb=7121585'}}/>
                            <ListItem.Content 
                            style = {styles.lista}>
                                <ListItem.Title> {animal.nombre} </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>);
                })}
                </ScrollView>
                <Appbar style = {styles.bottom}>

                    <Appbar.Content title={protectoraActual.nombre} />
                    <Appbar.Action icon="home" onPress={() => { } } />
                    <Appbar.Action icon="plus-circle" onPress={() => { } } />
                    <Appbar.Action icon="chat" onPress={() => { } } />
                    <Appbar.Action icon="account" onPress={() => { } } />
                </Appbar>
                    
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
          },
          lista: {
              margin: 12,
              padding: 10
          },
          imagen: {
              height: 60,
              width: 60
          }
      });
export default UserDetailScreen; 