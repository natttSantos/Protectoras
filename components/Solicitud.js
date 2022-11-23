import firebase from '../database/firebase.js'
import React, { useState, useEffect } from 'react';
import {Image, View, StyleSheet, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

export default function Solicitud(props) {
    const defaultFoto = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fobjetivoligar.com%2Fperfil-sin-foto%2F&psig=AOvVaw0Sij3Yu__NpHdO4z-cOSD1&ust=1669302737538000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLDFt7fLxPsCFQAAAAAdAAAAABAE"

    const [imagenAnimal, setImagenAnimal] = useState("")
    const [imagenUsuario, setImagenUsuario] = useState("")
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
              .getDownloadURL().then(function(url) {setImagenAnimal(url); setLoading(false)})
              
        setAnimal({nombre: nombre})
    }

    const getNombreDeUsuario = async (id_usuario) => {
        const usuarioDado = await firebase.db.collection('users').doc(id_usuario).get()
        const {usuario} = usuarioDado.data()

        await firebase
              .st
              .ref(`imagesUsuario/${id_usuario}`)
              .getDownloadURL().then(function(url) {setImagenUsuario(url); setLoading(false)})
        
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
                <Image style={styles.imagen} source={{uri: imagenAnimal}} />
                <Image style={styles.imagenPeque} source={imagenUsuario != "" ? {uri: imagenUsuario} : {uri: defaultFoto}} />
            </View>
            <View style= {styles.soliContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.solicitud}
                    onPress ={() => props.verInformacion()}> 
                        {usuario.usuario} quiere adoptar a {animal.nombre} 
                    </Text>
                </View>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                    onPress={() => props.declinar(animal.nombre)}>
                        <View
                        style={styles.botonDeclinar}>
                            <Image source={require('../images/Cruz.png')}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => props.aceptar(animal.nombre)}>
                        <View
                        style={styles.botonAceptar}>
                            <Image source={require('../images/Tick.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        borderColor: '#5B1D66',
        borderWidth: 2,
        borderRadius: 20,
        flexDirection: 'row',
        height: 140,
        width: 320,
        marginTop: 10,
        flex: 1
    },
    imagenContainer: {
        marginHorizontal: 10,
        width: 110,
        alignItems: 'center',
        flexDirection: 'row',
    },
    soliContainer: {
        borderRadius: 25,
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        minHeight: 30,
    },
    textContainer: {
        height: '50%',
        width: '100%',
        justifyContent: 'center',
        flex: 1,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flex: 1,
        width: '100%',
    },
    botonDeclinar: {
        marginRight: 10,
        height: 40,
        width: 50,
        borderRadius: 10,
        backgroundColor: '#5B1D66',
        alignItems: 'center',
        justifyContent: 'center'
    },
    botonAceptar: {
        marginRight: 10,
        height: 40,
        width: 80,
        borderRadius: 10,
        backgroundColor: '#FFB743',
        alignItems: 'center',
        justifyContent: 'center'
    },
    solicitud: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        textAlignVertical: 'bottom'
    },
    imagen: {
        width: 90,
        height: 90,
        borderRadius: 90/2
    },
    imagenPeque: {
        width: 50,
        height: 50,
        borderRadius: 50/2,
        bottom: 25,
        right: 30,
        borderColor:'#FFFFFF',
        borderWidth: 2
    }
});