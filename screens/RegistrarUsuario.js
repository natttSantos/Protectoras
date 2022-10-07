import React, {useState} from "react";
import { View, Button, TextInput, StyleSheet, ScrollView, Text} from "react-native";
import firebase from '../database/firebase.js';

const RegistrarUsuario = () => {
    
    const [state, setState] = useState({ //STATE ES UN OBJETO CON NOMBRE, EMAIL Y TLF
        usuario: "", 
        email: "",
        contraseña: "",
        telefono: ""
    }); 

    const handleChangeText = (nombre, value) => {
        setState({...state, [nombre]: value}); 
    }; 
    const saveNewUser =  async () => {
        if (state.nombre == '' || state.email == '' || state.telefono == ''){
            validateNullFields(); 
        } else { 
            await firebase.db.collection('users').add({
                usuario: state.usuario, 
                email: state.email,
                contraseña: state.contraseña,
                telefono: state.telefono
            })
            alert ("Bienvenido " + state.usuario); 
        }
    } 
    
    const validateNullFields = () => {
        let campoVacio = "Complete el campo "; 
        if (state.nombre == ''){
            alert(campoVacio + "nombre"); 
        } if (state.email == ''){
            alert(campoVacio + "email"); 
        }
        if (state.telefono == ''){
            alert(campoVacio + "telefono"); 
        }
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputGroup}>
                <TextInput 
                style={styles.inputText}
                placeholder="Nombre de usuario" 
                onChangeText={(value) => handleChangeText('usuario', value)}
                />
            </View>
            <View style={styles.inputGroup}>
                <TextInput 
                style={styles.inputText}
                placeholder="Email " 
                onChangeText={(value) => handleChangeText('email', value)}
                />
            </View>
            <View style={styles.inputGroup}>
                <TextInput 
                style={styles.inputText}
                placeholder="Contraseña (entre 4-8 caracteres)" 
                onChangeText={(value) => handleChangeText('contraseña', value)}
                />
            </View>
            <View style={styles.inputGroup}>
                <TextInput 
                style={styles.inputText}
                placeholder="Teléfono" 
                onChangeText={(value) => handleChangeText('telefono', value)}
                />
            </View>
            <View>
                <Button title="Registrar usuario"
                onPress={() => saveNewUser()}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35
    },
    inputGroup: {
        fontSize: 20, 
        flex: 1,
        padding: 0,
        marginBottom: 15, 
        borderBottomWidth: 2, 
        borderBottomColor: '#cccccc'
    }, inputText: {
        fontSize: 17
      },
      title : {
        fontSize: 20
      }
})


export default RegistrarUsuario; 