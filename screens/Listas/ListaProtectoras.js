import React, {useState, useEffect} from "react"
import {ScrollView, View, StyleSheet, Text}  from 'react-native'
import {Avatar, ListItem} from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../../database/firebase";

const ListaProtectoras = (props) => {
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true); 

    let imagenesAux = []
    const protectoras = props.route.params.protectoras

    const cargarImagenes = async () => {
        let i = protectoras.length

        if(i > 0){
            await protectoras.map(async (protectora, index) => {
                await firebase
                .st
                .ref(`imagesProtectora/${protectora.fotoModificada}`)
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