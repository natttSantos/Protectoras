import firebase from '../../database/firebase.js';
import React, { useState, useEffect, useContext } from 'react';
import {ScrollView, View, StyleSheet, Alert, Modal, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Solicitud from '../../components/Solicitud.js';
import { CredentialsContext } from '../../components/CredentialsContext';
import { ImageBackground } from 'react-native';

const ListaSolicitudes = (props) => {

    const [solicitudes, setSolicitudes] = useState([])
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const [modalVisible, setModalVisible] = useState(false);

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
        })
    }

    const aceptarSolicitud = async (solicitud, nombreAnimal) => {
        await firebase.db.collection('animales').doc(solicitud.id_animal).set({
            adoptado: true,
            id_adoptante: solicitud.id_usuario
        }, {merge: true})

        const solicitudesASolucionar = await firebase.db.collection('solicitudes').where("id_animal", "==", solicitud.id_animal).get()
        solicitudesASolucionar.docs.map(doc => {
            if(doc.ref.id != solicitud.id) {
                firebase.db.collection('notificaciones').add({
                    id_usuario: doc.data().id_usuario,
                    mensaje: "Tu solicitud de adopción de " + nombreAnimal + " ha sido rechazada ",
                    leido: false
                })
            }
            doc.ref.set({
                solucionada: true
            }, {merge: true})
        })
    }

    const aceptar = (aceptarIndex, nombreAnimal) => {
        Alert.alert("Información", "¿Está seguro que quiere aceptar la solicitud de adopción?", [
            {text: "Confirmar", 
            onPress: () => {
                aceptarSolicitud(solicitudes[aceptarIndex], nombreAnimal);
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

    const verInformacionUsuario = (index) => {
        props.navigation.navigate('PerfilUsuario', {userId: solicitudes[index].id_usuario})
    }

    const verInformacionAnimal = (index) => {
        props.navigation.navigate('PerfilAnimal', {animalId: solicitudes[index].id_animal})
    }

    useEffect(() => {
        getAllSolicitudes(storedCredentials)
    }, [])

    return (
        <ScrollView>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={() => setModalVisible(!modalVisible)}
                        >
                        <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal>
            </View>
            {solicitudes.map((solicitud, index) => {
                return (
                    <View
                    key={solicitud.id}
                    style={styles.container}>
                        <Solicitud solicitud={solicitud} verInformacionUsuario={() => verInformacionUsuario(index)}
                        verInformacionAnimal={() => verInformacionAnimal(index)}
                        declinar={(nombreAnimal) => declinar(index, nombreAnimal)} aceptar={(nombreAnimal) => aceptar(index, nombreAnimal)}/>
                    </View>
                )
            })}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        width: '100%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
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