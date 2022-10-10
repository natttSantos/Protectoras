import React, {useState} from "react";
import { View, Button, TextInput, StyleSheet, ScrollView, Text} from "react-native";
import firebase from '../database/firebase.js';

const RegistrarUsuario = (props) => {
    
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
        if (state.nombre == '' || state.email == '' || state.telefono == '' || state.contraseña == ''){
            validateNullFields(); 
        } else if (validatePasswordAndPhone(state.contraseña, state.telefono)){ 
            await firebase.db.collection('users').add({
                usuario: state.usuario, 
                email: state.email,
                contraseña: state.contraseña,
                telefono: state.telefono
            })
            alert ("Bienvenid@ " + state.usuario); 
            props.navigation.navigate('InicioSesion'); 
        }
    } 
    
    const validateNullFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (state.usuario == ''){
            textoAlerta += "\n - Nombre de usuario"; 
        } if (state.email == ''){
            textoAlerta += "\n - Email "; 
        } if (state.contraseña == ''){
            textoAlerta += "\n - Contraseña "; 
        }
        if (state.telefono == ''){
            textoAlerta += "\n - Telefono ";  
        }
        alert (textoAlerta); 
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

function validatePasswordAndPhone (password, phone) {
    let validation = true; 
    if (password.length < 4 || password.length > 8){
        alert("La contraseña debe tener entre 4-8 caracteres"); 
        validation = false; 
    }
    if (phone.length  != 9){
        alert("El número de teléfono debe tener 9 dígitos"); 
        validation = false; 
    }
    return validation;
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