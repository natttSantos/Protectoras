import firebase from '../database/firebase.js'
import React, { useState, useEffect } from 'react';
import {Image, View, StyleSheet, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

export default function Solicitud(props) {
    const defaultFoto = ""
    const [imagenUsuario, setImagenUsuario] = useState("")
    const [loading, setLoading] = useState(true)
    const [usuario, setUsuario] = useState({
        usuario: ""
    })
    
    const getNombreDeUsuario = async (id_usuario) => {
        const usuarioDado = await firebase.db.collection('users').doc(id_usuario).get()
        const {nombre} = usuarioDado.data()

        setUsuario({usuario: nombre})

        await firebase
            .st
            .ref(`imagesUsuario/${id_usuario}`)
            .getDownloadURL().then((function(url) {setImagenUsuario(url); setLoading(false)}), () => setImagenUsuario(""))
    }

    useEffect(() => {
        getNombreDeUsuario(props.donacion.id_Usuario)
        console.log(props.donacion.id_Usuario)
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
                <TouchableOpacity>
                    <Image style={styles.imagen} source={imagenUsuario != "" ? {uri: imagenUsuario} : require('../images/UsuarioSinFoto.jpg')} />
                </TouchableOpacity>
            </View>
            <View style= {styles.soliContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.solicitud}> 
                        {props.donacion.nombre} donó {props.donacion.dineroDonado}€ el día {props.donacion.dia}/{props.donacion.mes}/{props.donacion.año} 
                    </Text>
                </View>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                    onPress={() => props.aceptar(usuario.usuario)}>
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
        marginBottom: 20,
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