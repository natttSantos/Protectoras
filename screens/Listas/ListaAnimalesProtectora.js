import React, {useState, useEffect} from "react"
import {ScrollView, View, StyleSheet, Text}  from 'react-native'
import {Avatar, ListItem} from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../../database/firebase";

const ListaAnimalesProtectora = (props) => {
    //const urlImagen = 'https://statics.memondo.com/p/s1/ccs/2022/10/CC_2795378_7e45a8644f28403f99ef1c5df2008edf_meme_otros_este_es_mierdon_thumb_fb.jpg?cb=7121585'
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);

    const imagenesAux = []
    const animales = props.route.params.animales

    const cargarImagenes = async () => {
        let i = animales.length

        await animales.map(async (animal) => {
            await firebase
            .st
            .ref(`images/${animal.nombre}`)
            .getDownloadURL().then(function(url) {
                i--
                imagenesAux.push(url)
                setImagenes(...imagenes, imagenesAux)
                if(i == 0) setLoading(false)
            });
        })
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

    return(
        <ScrollView>
                {animales.map((animal, index) => {
                    return (
                        <ListItem key={animal.id}
                            bottomDivider
                            onPress={() => {props.navigation.navigate('PerfilAnimal', {animalId: animal.id})}}>
                            <Avatar 
                            style = {styles.imagen}
                            onPress={() => {console.log(imagenes); console.log(index)}}
                            source={{uri: imagenes[index]}}
                            />
                            <ListItem.Content 
                            style = {styles.lista}
                            >
                                <ListItem.Title> {animal.nombre} </ListItem.Title>
                                <ListItem.Subtitle> {animal.edad} años</ListItem.Subtitle>
                                <ListItem.Subtitle> {animal.raza} </ListItem.Subtitle>
                                <ListItem.Subtitle> {animal.sexo} </ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>);
                })}
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    imagen: {
        height: 60,
        width: 60
    },
    lista: {
        margin: 12,
        padding: 10
    }
})
export default ListaAnimalesProtectora;