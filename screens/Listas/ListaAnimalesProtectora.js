import React, {useState, useEffect, useContext} from "react"
import {ScrollView, View, StyleSheet, Text}  from 'react-native'
import {Avatar, ListItem} from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../../database/firebase";
import { CredentialsContext } from "../../components/CredentialsContext";
import {colors} from '../../components/Color';

const ListaAnimalesProtectora = (props) => {
    //const urlImagen = 'https://statics.memondo.com/p/s1/ccs/2022/10/CC_2795378_7e45a8644f28403f99ef1c5df2008edf_meme_otros_este_es_mierdon_thumb_fb.jpg?cb=7121585'
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [titulo, setTitulo] = useState("Animales en");

    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

    let imagenesAux = []
    const animales = props.route.params.animales

    const cargarImagenes = async () => {
        let i = animales.length

        if(i > 0){
            await animales.map(async (animal, index) => {
                await firebase
                .st
                .ref(`images/${animal.nombre}`)
                .getDownloadURL().then(function(url) {
                    i--
                    imagenesAux[index] = url
                    setImagenes(...imagenes, imagenesAux)
                    if(i == 0) setLoading(false)
                });
            })
        }
        else {
            setLoading(false)
        }
    }

    const getProtectoraById = async (id) => {
        const dbRef = firebase.db.collection("protectoras").doc(id);
        const doc = await dbRef.get();
        const protectora = doc.data();
        setTitulo("Animales en " + protectora.nombre);
        setLoading(false);
        
    }

    useEffect(() => {
        cargarImagenes(),
        getProtectoraById(storedCredentials)
    }, [])
    
    if(loading) {
        return(
            <View>
                <ActivityIndicator />
            </View>
        )
    }

    if(animales.length > 0) {
        return(
            <ScrollView>
                <Text style={styles.titulo}>
                    {titulo}
                </Text>
                    {animales.map((animal, index) => {
                        return (
                            <ListItem key={animal.id}
                                bottomDivider
                                onPress={() => {props.navigation.navigate('PerfilAnimal', {animalId: animal.id, userId: props.route.params.userId, esUsuario: false})}}>
                                <Avatar 
                                style = {styles.imagen}
                                source={{uri: imagenes[index]}}
                                />
                                <ListItem.Content 
                                style = {styles.lista}
                                >
                                    <ListItem.Title> {animal.nombre} </ListItem.Title>
                                    <ListItem.Subtitle> {animal.raza} </ListItem.Subtitle>
                                    <ListItem.Subtitle> {animal.sexo} </ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>);
                    })}
                </ScrollView>
        )
    } else {
        return (
            <View>
                <Text style={styles.titulo}>
                    No hay animales
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imagen: {
        height: 60,
        width: 60
    },
    lista: {
        margin: 12,
        padding: 10
    }, 
    titulo: {
        fontFamily: 'DMSans',
        fontSize: 32,
        marginBottom: 30,
        marginTop: 40,
        marginLeft: 30,
        color: colors.moradoPrincipal,
    }
})
export default ListaAnimalesProtectora;