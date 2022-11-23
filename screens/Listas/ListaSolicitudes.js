import firebase from '../../database/firebase.js';
import React, { useState, useEffect, useContext } from 'react';
import {ScrollView, View, StyleSheet, Alert, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Solicitud from '../../components/Solicitud.js';
import InformacionSolicitud from '../InformacionSolicitud.js';
import { onPress } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes.js';
import { CredentialsContext } from '../../components/CredentialsContext';

const ListaSolicitudes = (props) => {

    const [solicitudes, setSolicitudes] = useState([])
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const getAllSolicitudes = (storedCredentials) => {
        firebase.db.collection('solicitudes').where("id_protectora", "==", storedCredentials).
        where("solucionada", "==", false).onSnapshot(querySnapshot => {
            const solicitudesAux = []

            querySnapshot.docs.forEach(doc => {
                const {id_usuario, storedCredentials, id_animal} = doc.data()
                solicitudesAux.push({
                    id: doc.id,
                    id_usuario: id_usuario,
                    id_protectora: storedCredentials,
                    id_animal: id_animal
                })
            })
            setSolicitudes(solicitudesAux)
            console.log(solicitudesAux.length)
        })
    }

    const aceptarSolicitud = async(solicitud) => {
        await firebase.db.collection('animales').doc(solicitud.id_animal).set({
            adoptado: true,
            id_adoptante: solicitud.id_usuario
        }, {merge: true})

        await firebase.db.collection('solicitudes').doc(solicitud.id).set({
            solucionada: true
        }, {merge: true})
    }

    const aceptar = (aceptarIndex, nombreAnimal) => {
        Alert.alert("Información", "¿Está seguro que quiere aceptar la solicitud de adopción?", [
            {text: "Confirmar", 
            onPress: () => {
                aceptarSolicitud(solicitudes[aceptarIndex]);
                setSolicitudes(solicitudes.filter((solicitud, index) => index != aceptarIndex))
            }}, 
            {text: "Cancelar"}
        ])

        const mensajeAdopcion = "¡Tu solicitud de adopción de " + nombreAnimal + " ha sido aceptada!"

        firebase.db.collection('notificaciones').add({
            id_usuario: solicitudes[aceptarIndex].id_usuario,
            mensaje: mensajeAdopcion,
            leido: false
        })
    }

    const declinar = (declinarIndex, nombreAnimal) => {
        Alert.alert("Información", "¿Está seguro que quiere denegar la solicitud de adopción?", [
            {text: "Confirmar", 
            onPress: async () => {
                await firebase.db.collection('solicitudes').doc(solicitudes[declinarIndex].id).delete()
                setSolicitudes(solicitudes.filter((solicitud, index) => index != declinarIndex))
            }}, 
            {text: "Cancelar"}
        ])

        const mensajeAdopcion = "Tu solicitud de adopción de " + nombreAnimal + " ha sido denegada"

        firebase.db.collection('notificaciones').add({
            id_usuario: solicitudes[declinarIndex].id_usuario,
            mensaje: mensajeAdopcion,
            leido: false
        })
    }

    const verInformacion = (index) => {
        props.navigation.navigate('InformacionSolicitud', {id_animal: solicitudes[index].id_animal, id_usuario: solicitudes[index].id_usuario})
    }
    useEffect(() => {
        console.log(storedCredentials)
        getAllSolicitudes(storedCredentials)
    }, [])

    return (
        <ScrollView>
            {solicitudes.map((solicitud, index) => {
                console.log(solicitud.id)
                return (
                    <View
                    key={solicitud.id}
                    style={styles.container}>
                        <Solicitud solicitud={solicitud} verInformacion={() => verInformacion(index)}
                        declinar={(nombreAnimal) => declinar(index, nombreAnimal)} aceptar={(nombreAnimal) => aceptar(index, nombreAnimal)}/>
                    </View>
                )
            })}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 10,
        flex: 1
    },
    imagenContainer: {
        backgroundColor: '#33FFEC',
        borderRadius: 60/2,
        marginRight: 10,
        alignItems: 'center',
        width: 60,
        height: 60,
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
        width: '50%',
        fontSize: 16,
        left: 0
    }
});


export default ListaSolicitudes;