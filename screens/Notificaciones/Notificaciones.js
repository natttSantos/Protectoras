import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';

const Notificaciones = (props) => {
    const notificaciones = props.route.params.notificaciones
    const navigation = props.navigation

    useEffect(() => {
        props.route.params.alVolver()
    },[navigation])

    return(
        <ScrollView >
            {notificaciones.map((noti, index) => {
                return(
                    <View bottomDivider 
                    style={noti.leido ? styles.notiContainerLeido : styles.notiContainerNoLeido} key={index}>
                        <Text style={noti.leido ? styles.notisLeidas : styles.notisNoLeidas}>{noti.mensaje}</Text>
                    </View>
                )
            })}
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 35,
    },
    notiContainerNoLeido: {
        alignContent: 'center',
        marginVertical: 10,
        backgroundColor: '#03B3A3'
    },
    notiContainerLeido: {
        alignContent: 'center',
        marginVertical: 10,
        backgroundColor: '#04C4B2'
    },
    notisNoLeidas: {
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: 'DMSans',
        marginVertical: 10
    },
    notisLeidas: {
        fontSize: 18,
        marginVertical: 10,
        fontFamily: 'DMSans',
    }
})
export default Notificaciones;