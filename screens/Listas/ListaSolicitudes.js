import firebase from '../../database/firebase.js';
import React, { useState, useEffect, useContext } from 'react';
import {ScrollView, View, StyleSheet, Alert, Modal, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Solicitud from '../../components/Solicitud.js';
import { CredentialsContext } from '../../components/CredentialsContext';
import { ImageBackground } from 'react-native';
import {colors} from '../../components/Color';

const ListaSolicitudes = (props) => {

    const [solicitudes, setSolicitudes] = useState([])
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const [modal, setModal] = useState({
        visible: false,
        aceptar: false,
        nombreAnimal: "",
        indexSeleccionado: -1
    });

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
                    leido: false,
                    id_animal: doc.data().id_animal
                })
            }
            doc.ref.delete()
        })
    }

    const aceptarClick = (aceptarIndex, nombreAnimal) => {
        setModal({
            visible: !modal.visible,
            aceptar: true,
            nombreAnimal: nombreAnimal,
            indexSeleccionado: aceptarIndex
        });
    }

    const aceptar = () => {

        aceptarSolicitud(solicitudes[modal.indexSeleccionado], modal.nombreAnimal);

        const mensajeAdopcion = "¡Tu solicitud de adopción de " + modal.nombreAnimal + " ha sido aceptada!"

        firebase.db.collection('notificaciones').add({
            id_usuario: solicitudes[modal.indexSeleccionado].id_usuario,
            mensaje: mensajeAdopcion,
            leido: false,
            id_animal: solicitudes[modal.indexSeleccionado].id_animal
        })

        setModal({...modal, visible: !modal.visible})
    }

    const declinarClick = (declinarIndex, nombreAnimal) => {
        setModal({
            visible: !modal.visible,
            aceptar: false,
            nombreAnimal: nombreAnimal,
            indexSeleccionado: declinarIndex
        });
    }

    const declinar = async () => {
        await firebase.db.collection('solicitudes').doc(solicitudes[modal.indexSeleccionado].id).delete()
        setSolicitudes(solicitudes.filter((solicitud, index) => index != modal.indexSeleccionado))

        const mensajeAdopcion = "Tu solicitud de adopción de " + modal.nombreAnimal + " ha sido denegada"

        firebase.db.collection('notificaciones').add({
            id_usuario: solicitudes[modal.indexSeleccionado].id_usuario,
            mensaje: mensajeAdopcion,
            leido: false,
            id_animal: solicitudes[modal.indexSeleccionado].id_animal,
        })

        setModal({...modal, visible: !modal.visible})
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
            <Modal
            animationType="slide"
            transparent={true}
            visible={modal.visible}
            onRequestClose={() => {
                setModal({...modal, visible: !modal.visible});
            }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{flex: 4}}>
                            <Text style={styles.texto}>¿Estás seguro de {modal.aceptar ? "aceptar" : "rechazar"} la solicitud de adopción?</Text>
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                            onPress={modal.aceptar ? () => aceptar() : () => declinar()}>
                                <View style={styles.botonSi}>
                                    <Text style={styles.texto}>si</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => setModal({...modal, visible: !modal.visible})}>
                                <View style={styles.botonNo}>
                                    <Text style={styles.texto}>no</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.tituloContainer}>
                <Text style={styles.titulo}>Solicitudes de adopción</Text>
            </View>
            <View style={styles.solicitudContainer}>
                {solicitudes.length != 0 ? solicitudes.map((solicitud, index) => {
                    return (
                        <View
                        key={solicitud.id}
                        style={styles.container}>
                            <Solicitud solicitud={solicitud} verInformacionUsuario={() => verInformacionUsuario(index)}
                            verInformacionAnimal={() => verInformacionAnimal(index)}
                            declinar={(nombreAnimal) => declinarClick(index, nombreAnimal)} aceptar={(nombreAnimal) => aceptarClick(index, nombreAnimal)}/>
                        </View>
                    )
                })
            : <Text style ={{fontSize: 18.5, marginTop: 12, padding: 2, color: 'gray'}}>No hay más solicitudes de adopción {':('}</Text>}
            </View>
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
        width: '90%',
        height: 170,
        backgroundColor: colors.amarillo,
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
    tituloContainer: {
        marginHorizontal: 20,
        marginTop: 64,
        marginBottom: 26
    },
    solicitudContainer: {
        marginHorizontal: 20,
    },
    titulo: {
        fontFamily: 'DMSans',
        fontSize: 32,
        color: colors.moradoPrincipal
    },
    buttonGroup: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flex: 1,
        width: '100%',
    },
    botonNo: {
        marginRight: 10,
        height: 40,
        width: 120,
        borderRadius: 10,
        borderColor: colors.moradoPrincipal,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    botonSi: {
        marginRight: 10,
        height: 40,
        width: 120,
        borderRadius: 10,
        backgroundColor: colors.moradoPrincipal,
        alignItems: 'center',
        justifyContent: 'center'
    },
    texto: {
        fontFamily: 'DMSans',
        fontSize: 20,
        color: colors.blanco,
    },
    solicitud: {
        width: '50%',
        fontSize: 16,
        left: 0
    }
});


export default ListaSolicitudes;