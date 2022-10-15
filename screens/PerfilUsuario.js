
import React from "react";
import firebase from '../database/firebase.js';
import {View, Text, StyleSheet, ScrollView} from "react-native";

let nombreUsuario, email, telefono; 


const PerfilUsuario = () => (
    <ScrollView style={styles.container}>
        <View style={styles.ViewGroup}>
            <Text  style={styles.viewText}> 
            Nombre de usuario: {nombreUsuario}
            {'\n'}
            </Text>
        </View>
        <View style={styles.ViewGroup}>
            <Text style={styles.viewText}> 
            Email: {nombreUsuario}
            {'\n'}
            </Text>
        </View>
        <View style={styles.ViewGroup}>
            <Text style={styles.viewText}> 
            Teléfono: {nombreUsuario}
            {'\n'}
            </Text>
        </View>
    </ScrollView>
    
);

function perfilUserData (user, mail, phone) {
    
  }

  const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 40, 
        
    },
    title : {
        fontSize: 50,
        fontWeight: "bold", 
    },
    image : {
        height : 250, 
        width : 250
    }, 
    fixToText: {
        justifyContent: 'space-between'
    }, ViewGroup: {
        fontSize: 20, 
        flex: 1,
        padding: 0,
        marginBottom: 20, 

    }, viewText: {
        fontSize: 20
      }
})


export default PerfilUsuario; 