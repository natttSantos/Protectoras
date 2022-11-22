import React, {useState, useContext} from "react";
import { View, Button, TextInput, Text,StyleSheet, ScrollView, ProgressViewIOSComponent, Alert, TouchableOpacity} from "react-native";
import firebase from '../database/firebase';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../components/CredentialsContext";

const InicioSesion = (props) => {

    const [state, setState] = useState({ //STATE ES UN OBJETO CON NOMBRE, EMAIL Y TLF
        email: "",
        contraseña: "",
    }); 

    const handleChangeText = (nombre, value) => {
        setState({...state, [nombre]: value}); 
    }; 

    const showAlert = () => {
        Alert.alert("Error", "El usuario o la contraseña son incorrectas", [
            {text: "Cerrar"}
        ]);
    }

    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {type, setType} = useContext(CredentialsContext);

    const persistLogin = (credentials, status) => {
        AsyncStorage.setItem('getPetCredentials', credentials.id + ',' + status)
        .then(() => {
            setStoredCredentials(credentials.id)
            setType(status)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const validateUser = async () => {
        const usuarios = firebase.db.collection("users");
        const snapshot = await usuarios.where("email", "==", state.email).get();
        
        const protectoras = firebase.db.collection("protectoras");
        const snapshot2 = await protectoras.where("email", "==", state.email).get();
        if (!snapshot.empty) {
            const usuario = snapshot.docs[0]
            if (usuario.get("contraseña") == state.contraseña){
                //props.navigation.navigate('SesionUsuario', {userId: usuario.id})
                persistLogin(usuario, 'usuario');
            } else { showAlert(); }
        }
        else {
            if (!snapshot2.empty) {
                const protectora = snapshot2.docs[0]
                if(protectora.get('contraseña') == state.contraseña) {
                    //props.navigation.navigate('SesionProtectora', {userId: protectora.id})
                    persistLogin(protectora, '');
                } else { showAlert(); }
            }
        }
        if (snapshot.empty && snapshot2.empty) {
            showAlert();
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <TextInput 
                style={styles.inputText}           
                placeholder="Email"     
                onChangeText={(value) => handleChangeText('email', value)}
                />
                <TextInput 
                secureTextEntry={true}
                style={styles.inputText}
                placeholder="Contraseña"
                onChangeText={(value) => handleChangeText('contraseña', value)}
                />
                <TouchableOpacity 
                    onPress={() => {
                        validateUser(state.value)
                        handleChangeText("email", "")
                        handleChangeText("contraseña", "")
                    }}
                    style={styles.button}>
                        <Text style={styles.buttonText}>
                            Iniciar sesión
                        </Text>
                </TouchableOpacity>
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

export default InicioSesion; 