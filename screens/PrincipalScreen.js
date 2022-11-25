import React, {useState} from "react";
import { View, Button, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from "react-native";

import {colors} from '../components/Color';

const PrincipalScreen = (props) => {
    return (

            <View style={styles.container}>  
                <Image
                    source={require('../images/logoApp.png')}
                    style={styles.image}
                />
                <View style= {{position: 'absolute', bottom: 90, alignSelf: 'center'}}>
                <TouchableOpacity 
                   onPress={() => props.navigation.navigate('InicioSesion')}
                    style={styles.botonCircularAmarillo}>
                        <Text style={styles.botonTexto}>
                        Inicia Sesión
                        </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={() => props.navigation.navigate('RegistrarUsuario')}
                    style={styles.botonCircularAmarillo}>
                        <Text style={styles.botonTexto}>
                        Regístrate
                        </Text>
                </TouchableOpacity>
                </View>
                <View style= {{position: 'absolute', bottom: 75, alignSelf: 'center'}}>
                
                <TouchableOpacity 
                   onPress={() => props.navigation.navigate('AltaProtectora')}
                    >
                        <Text style={styles.botonTextoAltaProtectora}>
                        Dar de alta protectora
                        </Text>
                </TouchableOpacity>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35,
        backgroundColor: colors.amarillo
    },
    image : {
        width: 230,
        height: 124.98,
        alignSelf: "center", 
        top: 200
    }, 
    fixToText: {
        justifyContent: 'space-between'
    }, 
    botonCircularAmarillo : {
        backgroundColor: colors.amarillo,
        borderColor: colors.blanco,
        borderWidth: 2,
        width:217,
        height:47,
        borderRadius: 25,
        marginBottom: 140, 
        marginTop: -115
      },
      botonTexto: {
        fontSize: 20,
        color: colors.blanco,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 5
      }, 
      botonTextoAltaProtectora: {
        fontSize: 16,
        color: "#5B1D66",
        fontWeight: "bold",
        alignSelf: "center",
        borderBottomWidth: 2, 
        borderBottomColor: '#5B1D66',
        marginTop: 5
      }
})


export default PrincipalScreen; 