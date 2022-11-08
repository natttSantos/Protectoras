import firebase from '../../database/firebase.js';
import React, { useState, useEffect } from 'react';
import {ScrollView, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Solicitud from '../../components/Solicitud.js';

const ListaSolicitudes = (props) => {

    const [solicitudes, setSolicitudes] = useState([])

    const getAllSolicitudes = (id_protectora) => {
        firebase.db.collection('solicitudes').where("id_protectora", "==", id_protectora).onSnapshot(querySnapshot => {
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

    async function getNombreDeAnimal(id_animal) {
        const animal = await firebase.db.collection('animales').doc(id_animal).get()
        console.log(animal.nombre)
        const nombre = animal.nombre
        return "nombre"
    }

    useEffect(() => {
        getAllSolicitudes(props.route.params.userId)
    }, [])

    return (
        <ScrollView>
            {solicitudes.map(solicitud => {
                return (
                    <View
                    key={solicitud.id}
                    style={styles.container}>
                        <Solicitud solicitud={solicitud} />
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