import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Text, View, ScrollView, StyleSheet, Image } from 'react-native';
import { colors } from '../../components/Color'
import firebase from '../../database/firebase';

const Notificaciones = (props) => {
    const [notificaciones, setNotificaciones] = useState(props.route.params.notificaciones)
    const [notificacionesUnico, setNotificacionesUnico] = useState([]) 
    const [animales, setAnimales] = useState([]) 
    const [loading, setLoading] = useState(true) 
    const navigation = props.navigation

    useEffect(() => {
        const animalesAux = []
        const notificacionesUnico = []
        notificaciones.map(noti => {
            if(notificacionesUnico.findIndex(notifi => notifi.id_animal == noti.id_animal) === -1) 
                notificacionesUnico.push(noti)
        })
        setNotificacionesUnico(notificacionesUnico)
        let i = notificacionesUnico.length

        notificacionesUnico.map(async (noti, index) => {
            i--
            const animal = await firebase.db.collection('animales').doc(noti.id_animal).get()
            const {nombre} = animal.data()
            firebase.st.ref(`images/${nombre}`).getDownloadURL().then(url => {
                animalesAux.push({
                    id: noti.id_animal,
                    url: url
                })
                if (index == notificacionesUnico.length - 1){ setAnimales(animalesAux); setLoading(false)}
            })
        })
    }, [])
    useEffect(() => {
        props.route.params.alVolver()
    },[navigation])

    if(loading || animales.length != notificacionesUnico.length) {
        return(
        <View>
            <ActivityIndicator/>
        </View>
        )
    }
    else {
        return(
            <ScrollView >
                <View style={{marginTop: 54, padding: 20}}>
                    <Text style={styles.titulo}>
                        Notificaciones
                    </Text>
                </View>
                {notificaciones.map((noti, index) => {
                    const aceptada = noti.mensaje.includes('aceptada')
                    return(
                        <View bottomDivider 
                        style={styles.notiContainer} key={index}>
                            <View style={styles.imagenesContainer}>
                                <Image source={{uri: animales.find(animal => animal.id == noti.id_animal).url}} style={{height: 70, width: 70, borderRadius: 35}}/>
                                <View style={aceptada ? styles.tickContainer : styles.cruzContainer}>
                                    <Image source={aceptada ? require('../../images/Tick.png') : require('../../images/Cruz.png')}/>
                                </View>
                            </View>
                            <View style={styles.textoContainer}>
                                <Text style={styles.texto}>{noti.mensaje}</Text>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 35,
    },
    notiContainer: {
        flex: 1,
        width: 320,
        height: 111,
        borderColor: colors.moradoPrincipal,
        borderWidth: 2,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        flexDirection: 'row'
    },
    imagenesContainer: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    tickContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        bottom: 25,
        right: 20,
        backgroundColor: colors.amarillo,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cruzContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        bottom: 25,
        right: 20,
        backgroundColor: colors.moradoPrincipal,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoContainer: {
        flex: 7,
        justifyContent: 'center',
    },
    texto: {
        fontFamily: 'InterRegular',
        fontSize: 16
    },
    titulo: {
        padding: 10,
        color: colors.moradoPrincipal,
        fontSize: 32,
        fontFamily: 'DMSans',
        textAlign: "left"
    },
})
export default Notificaciones;