import React, {useState} from "react";
import { View, Button, TextInput, StyleSheet, ScrollView, Text, Alert, TouchableOpacity} from "react-native";
import { color } from "react-native-elements/dist/helpers/index.js";
import firebase from '../../database/firebase.js';

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
        }

        let users = firebase.db.collection('users');
        let emails = await users.where("email", "==", state.email).get();
        let telefonos = await users.where("telefono", "==", state.telefono).get();
        let noRepetidos = checkEmail(emails, telefonos);
        if (noRepetidos && validatePasswordAndPhone(state.contraseña, state.telefono)) { 
            await firebase.db.collection('users').add({
                usuario: state.usuario, 
                email: state.email,
                contraseña: state.contraseña,
                telefono: state.telefono,
                alta: "No"
            })
            alert ("Bienvenid@ " + state.usuario); 
            props.navigation.navigate('InicioSesion'); 
        }
    } 

    function checkEmail (emails) {
        if (emails.empty) {return true;}
        else {
            Alert.alert("Error", "El email introducido ya está en uso", [
                {text: "Cerrar"}
            ]);
            return false;
        }
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
            <View>
                <Text style={styles.title}> Registro </Text>
                <TextInput 
                    style={styles.inputText}
                    placeholder="Nombre de usuario" 
                    onChangeText={(value) => handleChangeText('usuario', value)}
                />
                <TextInput 
                    style={styles.inputText}
                    placeholder="Email " 
                    onChangeText={(value) => handleChangeText('email', value)}
                />
                <TextInput 
                    style={styles.inputText}
                    secureTextEntry
                    placeholder="Contraseña (entre 4-8 caracteres)" 
                    onChangeText={(value) => handleChangeText('contraseña', value)}
                />
                <TextInput
                    style={styles.inputText}
                    keyboardType="numeric"
                    placeholder="Teléfono" 
                    onChangeText={(value) => handleChangeText('telefono', value)}
                />
                <TouchableOpacity 
                    onPress={() => saveNewUser()}
                    style={styles.button}>
                        <Text style={styles.buttonText}>
                            Registrar usuario
                        </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
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
        height: 40,
        borderColor: "gray",
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        width: "100%",
        borderWidth: 1,
    },
      title: {
        fontSize: 40,
        fontWeight: 'bold',
    },button : {
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


export default RegistrarUsuario; 