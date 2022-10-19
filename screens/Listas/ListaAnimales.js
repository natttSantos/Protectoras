import React, {useEffect, useState} from "react";
import { View, Button, TextInput, Text, StyleSheet, ScrollView, ProgressViewIOSComponent} from "react-native";
import firebase from '../../database/firebase';
import {Avatar, ListItem} from "react-native-elements";

const ListaAnimales = (props) => {

    const [animales, setProtectoras] = useState([]);

    useEffect(() => {
        firebase.db.collection('animales').onSnapshot((querySnapshot) => {
            const listaAnimales = []

            querySnapshot.docs.forEach((doc) => {
                const {nombre, raza, sexo, edad, descripcion, fecha_nacimiento} = doc.data()
                listaAnimales.push({
                    id: doc.id,
                    nombre,
                    raza,
                    sexo,
                    edad,
                    descripcion,
                    fecha_nacimiento
                })
            });
            setProtectoras(listaAnimales)
        })
    })

    return(
        <ScrollView>
            <Text style={styles.titulo}>
                Lista Animales
            </Text>
            { animales.map((animal) => {
                return(
            <ListItem key={animal.id} 
            bottomDivider
            onPress={() => {
                props.navigation.navigate("PerfilAnimal", {
                  animalId: animal.id,
                });
              }}
            >
                <ListItem.Chevron />
                <ListItem.Content 
                style={styles.lista}>
                    <ListItem.Title 
                    style={{fontWeight: "bold"}}> 
                        {animal.nombre} 
                    </ListItem.Title>
                    <ListItem.Subtitle> {animal.descripcion} </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            )})
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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

export default ListaAnimales;