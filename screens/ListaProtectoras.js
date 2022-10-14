import React, {useEffect, useState} from "react";
import { View, Button, TextInput, Text, StyleSheet, ScrollView, ProgressViewIOSComponent} from "react-native";
import firebase from '../database/firebase';
import {Avatar, ListItem} from "react-native-elements";

const ListaProtectoras = (props) => {

    const [protect, setProtectoras] = useState([]);

    useEffect(() => {
        firebase.db.collection('protectoras').onSnapshot((querySnapshot) => {
            const protectoras = []

            querySnapshot.docs.forEach((doc) => {
                const {nombre, mail, localidad, direccion, telefono, urlweb, descripcion} = doc.data()
                protectoras.push({
                    id: doc.id,
                    nombre,
                    mail,
                    localidad,
                    direccion,
                    telefono,
                    urlweb,
                    descripcion
                })
            });
            setProtectoras(protectoras)
        })
    })

    return(
        <ScrollView>
            <Text style={styles.titulo}>
                PROTECTORAS
            </Text>
            { protect.map((prot) => {
                return(
            <ListItem key={prot.id} 
            bottomDivider
            onPress={() =>  {
                props.navigation.navigate("PerfilProtectora", {
                    protectoraId: prot.id
                  })
              }}>
                <Avatar
                style={styles.imagen}
                rounded
                source={{uri: 'https://randomuser.me/api/portraits/men/36.jpg'}} />
                <ListItem.Chevron />
                <ListItem.Content 
                style={styles.lista}>
                    <ListItem.Title 
                    style={{fontWeight: "bold"}}> 
                        {prot.nombre} 
                    </ListItem.Title>
                    <ListItem.Subtitle> {prot.mail} </ListItem.Subtitle>
                    <ListItem.Subtitle> {prot.direccion} </ListItem.Subtitle>
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

export default ListaProtectoras;