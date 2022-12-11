import React, {useState, useContext} from "react";
import { View, TextInput, Text,StyleSheet, TouchableOpacity, Modal} from "react-native";
import firebase from '../database/firebase';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../components/CredentialsContext";

//Bibliotecas colores CSS
import {colors} from '../components/Color';

const InicioSesion = (props) => {

    const [state, setState] = useState({ //STATE ES UN OBJETO CON NOMBRE, EMAIL Y TLF
        email: "",
        contraseña: "",
    }); 

    const handleChangeText = (nombre, value) => {
        setState({...state, [nombre]: value}); 
    }; 


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
            } else { setModal({...modal, visible: !modal.visible}) }
        }
        else {
            if (!snapshot2.empty) {
                const protectora = snapshot2.docs[0]
                if(protectora.get('contraseña') == state.contraseña) {
                    //props.navigation.navigate('SesionProtectora', {userId: protectora.id})
                    persistLogin(protectora, '');
                } else { setModal({...modal, visible: !modal.visible}) }
            }
        }
        if (snapshot.empty && snapshot2.empty) {
            setModal({...modal, visible: !modal.visible});
        }
    };

    const [modal, setModal] = useState({ visible: false });


    return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal.visible}
                    onRequestClose={() => {
                        setModal({...modal, visible: !modal.visible});
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{flex: 4}}>
                                <Text style={styles.texto}> El usuario o la contraseña son incorrectas </Text>
                            </View>
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity
                                onPress={() => setModal({...modal, visible: !modal.visible})}>
                                    <View style={styles.botonCerrar}>
                                        <Text style={styles.texto}>cerrar</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Text style={styles.titulo}> Inicia sesión </Text>
                <TextInput 
                style={styles.textFieldCircular}           
                placeholder="Email"     
                onChangeText={(value) => handleChangeText('email', value)}
                />
                <TextInput 
                secureTextEntry={true}
                style={styles.textFieldCircular}
                placeholder="Contraseña"
                onChangeText={(value) => handleChangeText('contraseña', value)}
                />
                <View> 
                <TouchableOpacity 
                    onPress={() => {
                        validateUser(state.value)
                        handleChangeText("email", "")
                        handleChangeText("contraseña", "")
                    }}
                    style={styles.botonCircularAmarillo}>
                        <Text style={styles.botonTexto}>
                            Enviar
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
        color: colors.moradoPrincipal,
        fontFamily: 'DMSans'
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
        marginBottom: 100,        
        marginTop: 30,
        alignSelf: 'center'
      },
      botonTexto: {
        fontSize: 20,
        color: colors.blanco,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 5
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 10,
        width: '90%',
        height: 190,
        backgroundColor: colors.amarillo,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.moradoPrincipal
      },
      botonCerrar: {
        marginRight: 10,
        height: 40,
        width: 120,
        borderRadius: 10,
        backgroundColor: colors.moradoPrincipal,
        alignItems: 'center',
        justifyContent: 'center'
      },
      texto: {
        fontFamily: 'DMSans',
        fontSize: 20,
        color: colors.blanco,
      },
    })

export default InicioSesion; 