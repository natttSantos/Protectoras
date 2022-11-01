import React, {useEffect, useState} from "react";
import {Linking, View, Button, TextInput, Text, StyleSheet, ActivityIndicator, ScrollView, ProgressViewIOSComponent} from "react-native";
import firebase from '../../database/firebase';
import {Avatar, ListItem} from "react-native-elements";
import { style } from "deprecated-react-native-prop-types/DeprecatedTextInputPropTypes";

const ListaProtectoras = (props) => {

    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const initialState = {
        nombre: ""  
    }
    const [usuario, setUsario] = useState(initialState);

    let imagenesAux = []
    const protectoras = props.route.params.protectoras

    const getUsuarioById = async (id) => {
        let dbRef = null; 
        if (props.route.params.isUsuario == false){
          dbRef = firebase.db.collection("protectoras").doc(id);
        } else{
          dbRef = firebase.db.collection("users").doc(id);  
        }
        const doc = await dbRef.get();
        const usuario = doc.data();
        setUsario({ ...usuario, id: doc.id });
        setLoading(false);
      };

    const cargarImagenes = async () => {
        let i = protectoras.length

        if(i > 0){
            await protectoras.map(async (protectora, index) => {
                await firebase
                .st
                .ref(`imagesProtectora/${protectora.nombre}`)
                .getDownloadURL().then(function(url) {
                    i--
                    imagenesAux[index] = url
                    setImagenes(...imagenes, imagenesAux)
                    if(i == 0) setLoading(false)
                });
                console.log("si entro")
            })
        }
        else {
            console.log("no entro")
            setLoading(false)
        }
    }
    
    useEffect(() => {
        cargarImagenes()
    }, [])

    if(loading) {
        return(
            <View>
                <ActivityIndicator />
            </View>
        )
    }
    if(protectoras.length > 0) {
        return(
            <ScrollView style={styles.container}>
 
                <Text style={styles.titulo}>
                    Lista Protectoras
                </Text>
                    {protectoras.map((protectora, index) => {
                        return (
                            <ListItem key={protectora.id}
                                bottomDivider
                                onPress={() => {props.navigation.navigate('PerfilProtectora', {protectoraId: protectora.id})}}>
                                <Avatar 
                                style = {styles.imagen}
                                source={{uri: imagenes[index]}}
                                />
                                <ListItem.Content 
                                style = {styles.lista}
                                >
                                    <ListItem.Title> {protectora.nombre} </ListItem.Title>
                                    <ListItem.Subtitle> {protectora.localizacion} </ListItem.Subtitle>
                                    <ListItem.Subtitle> {protectora.direccion} </ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>);
                    })}
                </ScrollView>
        )
    } else {
        return (
            <View>
                <Text>
                    NO HAY PROTECTORAS
                </Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },container: {
        flex: 1,
        padding: 35,
      },
    titulo: {
        margin: 12,
        padding: 10,
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: "left"
    },texto: {
        fontSize : 20,
        padding : 5,
        color: 'blue',
        fontWeight: "bold", 
        textAlign: 'right'
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

export default ListaProtectoras;