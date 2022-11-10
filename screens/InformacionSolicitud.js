import React, {useState} from "react";
import { View, TextInput, Text,StyleSheet, ScrollView, Alert, TouchableOpacity} from "react-native";
import firebase from '../database/firebase';
import Icon from 'react-native-vector-icons/Ionicons'

const InformacionSolicitud = (props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.infoContainer}
            onPress={() => props.navigation.navigate('PerfilUsuario', {userId: props.route.params.id_usuario, isUsuario: false})}>
                <Text style={styles.info}>Perfil del solicitante</Text>
                <Icon name="person-circle" size={90} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoContainer}
            onPress={() => props.navigation.navigate('PerfilAnimal', {animalId: props.route.params.id_animal, isUsuario: false})}>
                <Text style={styles.info}>Perfil del animal</Text>
                <Icon name="paw" size={90} />
            </TouchableOpacity>
        </View>
    ) 
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35
    },
    infoContainer: {
        backgroundColor: '#33FFEC',
        alignItems: 'center',
        borderRadius: 25,
        height: 150,
        marginBottom: 30,
    },
    info: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    inputGroup: {
        fontSize: 20, 
        flex: 1,
        padding: 0,
        marginBottom: 15, 
        borderBottomWidth: 2, 
        borderBottomColor: '#cccccc'
    }, 
    inputText: {
        height: 40,
        borderColor: "gray",
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        width: "100%",
        borderWidth: 1,
    },
    title : {
        fontSize: 20
    },
    button : {
        elevation: 8,
        backgroundColor: "#6c91c2",
        padding: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        colors: "#ffffff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"    
    }
})

export default InformacionSolicitud; 