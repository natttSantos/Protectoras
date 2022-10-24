import React, {useEffect, useState} from "react";
import { View, Button, TextInput, Text, StyleSheet, ScrollView, ProgressViewIOSComponent} from "react-native";
import firebase from '../../database/firebase';
import {Avatar, ListItem} from "react-native-elements";

const ListaAnimales = (props) => {

  const initialStatee = {
    imageFirebase:"",
    staet :""
    
  };
  const [cosas, setState] = useState(initialStatee);

    const [animales, setProtectoras] = useState([]);
    const URLAnimal = "";
    var state = "";


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

    
    const loadImage = async uri => {
      //console.log(uri);
      await firebase
      .st
      .ref(`images/${uri}`)
      .getDownloadURL().then(function(url) {
        setState({
          imageFirebase: url
       });
  });
  const { imageFirebase } = cosas;
  return imageFirebase;

  };



      const checkImage = uri => {
        const { imageFirebase } = cosas;
        console.log(uri);
        if (true) {
          return (
            <Avatar
                style={styles.imagen}
                rounded
                source={{uri: uri}} />
          );
        }
        return null;
      };

    return(
        <ScrollView>
            <Text style={styles.titulo}>
                Lista Animales
            </Text>
            { animales.map((animal) => {
              //  uploadImage(animal.nombre);
            //  {loadImage(animal.nombre)}
                
                return(
                 // {uploadImage(animal.nombre)}
                //  {loadImage(animal.nombre)}
            <ListItem key={animal.id} 
                  
            bottomDivider
            onPress={() => {
                props.navigation.navigate("PerfilAnimal", {
                  animalId: animal.id,
                });
              }}
            >

              <Avatar
                style={styles.imagen}
                rounded
                source={{uri:  loadImage(animal.nombre)}} />
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