import firebase from '../../database/firebase.js';
import React, { useState, useEffect } from 'react';
import {ScrollView, View, StyleSheet, Alert, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Solicitud from '../../components/Solicitud.js';
import InformacionSolicitud from '../InformacionSolicitud.js';
import { onPress } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes.js';

const ListaSolicitudes = (props) => {

    const [solicitudes, setSolicitudes] = useState([])

    const getAllSolicitudes = (id_protectora) => {
        firebase.db.collection('solicitudes').where("id_protectora", "==", id_protectora).
        where("solucionada", "==", false).onSnapshot(querySnapshot => {
            const solicitudesAux = []

            querySnapshot.docs.forEach(doc => {
                const {id_usuario, id_protectora, id_animal} = doc.data()
                solicitudesAux.push({
                    id: doc.id,
                    id_usuario: id_usuario,
                    id_protectora: id_protectora,
                    id_animal: id_animal
                })
            })
            setSolicitudes(solicitudesAux)
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

    const aceptar = (aceptarIndex) => {
        Alert.alert("Información", "¿Está seguro que quiere aceptar la solicitud de adopción?", [
            {text: "Confirmar", 
            onPress: () => {
                aceptarSolicitud(solicitudes[aceptarIndex]);
                setSolicitudes(solicitudes.filter((solicitud, index) => index != aceptarIndex))
            }}, 
            {text: "Cancelar"}
        ])
    }

    const declinar = (declinarIndex) => {
        Alert.alert("Información", "¿Está seguro que quiere denegar la solicitud de adopción?", [
            {text: "Confirmar", 
            onPress: async () => {
                await firebase.db.collection('solicitudes').doc(solicitudes[declinarIndex].id).delete()
                setSolicitudes(solicitudes.filter((solicitud, index) => index != declinarIndex))
            }}, 
            {text: "Cancelar"}
        ])
    }

    const verInformacion = (index) => {
        props.navigation.navigate('InformacionSolicitud', {id_animal: solicitudes[index].id_animal, id_usuario: solicitudes[index].id_usuario})
    }
    useEffect(() => {
        getAllSolicitudes(props.route.params.userId)
    }, [])

    return (
        <ScrollView>
            {solicitudes.map((solicitud, index) => {
                return (
                    <View
                    key={solicitud.id}
                    style={styles.container}>
                        <Solicitud solicitud={solicitud} verInformacion={() => verInformacion(index)}
                        declinar={() => declinar(index)} aceptar={() => aceptar(index)}/>
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