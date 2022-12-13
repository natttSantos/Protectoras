import firebase from '../../database/firebase.js';
import React, { useState, useEffect, useContext } from 'react';
import {ScrollView, View, StyleSheet, Alert, Modal, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { CredentialsContext } from '../../components/CredentialsContext';
import { ImageBackground } from 'react-native';
import {colors} from '../../components/Color';
import Donaciones from '../Donaciones.js';
import Donacion from '../../components/Donacion';

const ListaDonaciones = (props) => {

    const [donaciones, setDonaciones] = useState([])
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const [modal, setModal] = useState({
        visible: false,
        aceptar: false,
        nombreAnimal: "",
        indexSeleccionado: -1
    });

    const getAllDonaciones = (storedCredentials) => {
        console.log(storedCredentials);
        firebase.db.collection('donaciones').where("protectora", "==", storedCredentials).
        where("leida", "==", "No").onSnapshot(querySnapshot => {
            const donacionesAux = []

            querySnapshot.docs.forEach(doc => {
                const {apellidos, dia, mes, año, confirmada, cvv, dineroDonado, leida, fechaExpiracion, nombre, numeroTarjeta, protectora,id_Usuario} = doc.data()
                donacionesAux.push({
                    id: doc.id,
                    protectora: protectora,
                    apellidos: apellidos,
                    confirmada: confirmada,
                    cvv: cvv,
                    dineroDonado:dineroDonado,
                    fechaExpiracion:fechaExpiracion,
                    nombre: nombre,
                    numeroTarjeta: numeroTarjeta,
                    id_Usuario: id_Usuario,
                    leida: leida,
                    dia: dia,
                    mes: mes,
                    año: año,
                })
            })
            setDonaciones(donacionesAux)
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

    const aceptar = async () => {
    
        await firebase.db.collection('donaciones').doc(donaciones[modal.indexSeleccionado].id).delete()
        setDonaciones(donaciones.filter((donacion, index) => index != modal.indexSeleccionado))
        setModal({...modal, visible: !modal.visible})
    }


    useEffect(() => {
        getAllDonaciones(storedCredentials)
    }, [])

    return (
        <ScrollView style = {styles.container}>
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
                            <Text style={styles.texto}>¿Estás seguro de {modal.aceptar ? "borrar" : "rechazar"} la notificación de donación?</Text>
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                            onPress={modal.aceptar ? () => aceptar() : () => declinar()}>
                                <View style={styles.botonSi}>
                                    <Text style={styles.texto}>sí</Text>
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
                <Text style={styles.titulo}>Donaciones</Text>
            </View>
            <View style={styles.solicitudContainer}>
                {donaciones.map((donacion, index) => {
                    return (
                        <View
                        key={donacion.id}
                        style={styles.container}>
                            <Donacion donacion={donacion} 
                            aceptar={(nombreAnimal) => aceptarClick(index, nombreAnimal)}
                            />
                            </View>
                    )
                })}
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35,
        backgroundColor: colors.blanco,
        marginTop: 50
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
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
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.moradoPrincipal
    },
    tituloContainer: {
        marginHorizontal: 20,
        marginTop: 20,
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


export default ListaDonaciones;
