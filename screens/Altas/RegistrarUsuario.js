import React, {useState} from "react";
import { View, Button, TextInput, StyleSheet, ScrollView, Text, Alert, TouchableOpacity} from "react-native";
import firebase from '../../database/firebase.js';

//Bibliotecas colores CSS
import {colors} from '../../components/Color';
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
        }else if (state.telefono.length != 9 || isNaN(state.telefono)){
            textoAlerta += "\n - El teléfono debe contener 9 números ";  
        }
        alert (textoAlerta); 
    }

    return (
            <View style={styles.container}>
                <Text style={styles.titulo}> Registro </Text>
                <TextInput 
                    style={styles.textFieldCircular}
                    placeholder="Nombre de usuario" 
                    onChangeText={(value) => handleChangeText('usuario', value)}
                />
                <TextInput 
                    style={styles.textFieldCircular}
                    placeholder="Email " 
                    onChangeText={(value) => handleChangeText('email', value)}
                />
                <TextInput 
                    style={styles.textFieldCircular}
                    secureTextEntry
                    placeholder="Contraseña (entre 4-8 caracteres)" 
                    onChangeText={(value) => handleChangeText('contraseña', value)}
                />
                <TextInput
                    style={styles.textFieldCircular}
                    keyboardType="numeric"
                    placeholder="Teléfono" 
                    onChangeText={(value) => handleChangeText('telefono', value)}
                />
                <View style= {{  position: 'absolute', bottom: 0, alignSelf: 'center'}}>                    
                    <TouchableOpacity 
                        onPress={() => saveNewUser()}
                        style={styles.botonCircularAmarillo}>
                            <Text style={styles.botonTexto}>
                                Registrar
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
        backgroundColor: colors.amarillo,
        marginTop: 50
    },
    titulo : {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: colors.moradoPrincipal
    },
    textFieldCircular: {
        width:320,
        height:50,
        borderRadius: 25,
        backgroundColor: colors.blanco,
        fontSize: 16,
        padding: 15,
        marginBottom: 12
      },
      botonCircularAmarillo : {
        backgroundColor: colors.amarillo,
        borderColor: colors.blanco,
        borderWidth: 2,
        width:217,
        height:47,
        borderRadius: 25,
        marginBottom: 100
      },
      botonTexto: {
        fontSize: 20,
        color: colors.blanco,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 5
      }
})


export default RegistrarUsuario; 