import React from "react"
import {ScrollView, StyleSheet} from 'react-native'
import {Avatar, ListItem} from "react-native-elements";

const ListaAnimalesProtectora = (props) => {
    const urlImagen = 'https://statics.memondo.com/p/s1/ccs/2022/10/CC_2795378_7e45a8644f28403f99ef1c5df2008edf_meme_otros_este_es_mierdon_thumb_fb.jpg?cb=7121585'

    return(
        <ScrollView>
                {props.route.params.animales.map(animal => {
                    return (
                        <ListItem key={animal.id}
                            bottomDivider
                            onPress={() => {props.navigation.navigate('PerfilAnimal', {animalId: animal.id})}}>
                            <Avatar 
                            style = {styles.imagen}
                            source = {{uri: urlImagen}}
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