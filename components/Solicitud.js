import firebase from '../database/firebase.js'
import React, { useState, useEffect } from 'react';
import {Image, View, StyleSheet, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

export default function Solicitud(props) {

    const [imagen, setImagen] = useState("")
    const [loading, setLoading] = useState(true)
    const [animal, setAnimal] = useState({
        nombre: ""
    })
    const [usuario, setUsuario] = useState({
        usuario: ""
    })
    
    const getNombreDeAnimal = async (id_animal) => {
        const animalDado = await firebase.db.collection('animales').doc(id_animal).get()
        const {nombre} = animalDado.data()
        
        await firebase
              .st
              .ref(`images/${nombre}`)
              .getDownloadURL().then(function(url) {setImagen(url); setLoading(false)})
              
        setAnimal({nombre: nombre})
    }

    const getNombreDeUsuario = async (id_usuario) => {
        const usuarioDado = await firebase.db.collection('users').doc(id_usuario).get()
        const {usuario} = usuarioDado.data()
        
        setUsuario({usuario: usuario})
    }

    useEffect(() => {
        getNombreDeAnimal(props.solicitud.id_animal)
        getNombreDeUsuario(props.solicitud.id_usuario)
    }, [])

    if(loading) {
        return(
            <View></View>
        )
    }
    return (
        <View
        style={styles.container}>
            <View style={styles.imagenContainer}>
                <Image style={styles.imagen} source={{uri: imagen}} />
            </View>
            <View style= {styles.soliContainer}>
                <Text style={styles.solicitud}
                onPress ={() => props.verInformacion()}> 
                    {usuario.usuario} quiere adoptar a {animal.nombre} 
                </Text>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                    onPress={() => props.aceptar()}>
                        <Icon name="checkmark-circle"
                        size={30}
                        style={[styles.button, {color: 'green'}]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => props.declinar()}>
                        <Icon name="close-circle"
                        size={30}
                        style={[styles.button, {color: 'red'}]} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 80,
        marginTop: 10,
        flex: 1
    },
    imagenContainer: {
        backgroundColor: '#33FFEC',
        borderRadius: 80/2,
        marginRight: 10,
        alignItems: 'center',
        width: 80,
        height: 80,
    },
    soliContainer: {
        backgroundColor: '#33FFEC',
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        minHeight: 30,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flex: 1,
    },
    button: {
        marginRight: 10,
    },
    solicitud: {
        width: '70%',
        fontSize: 16,
        textAlign: 'center' 
    },
    imagen: {
        width: 80,
        height: 80,
        borderRadius: 80/2
    }
});