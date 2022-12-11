import React, {useState} from "react";
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity, Modal} from "react-native";
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
        else{
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
                setTextoAlerta("Bienvenid@ " + state.usuario);
                setModal({...modal, visible: !modal.visible, correct: false});
                props.navigation.navigate('InicioSesion'); 
            }
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
        let textoAlerta = "Problemas con: ";
        if (password.length < 4 || password.length > 8){
            textoAlerta += "\n -La contraseña debe tener entre 4-8 caracteres"; 
            validation = false; 
        }
        if (phone.length  != 9){
            textoAlerta += "\n -El número de teléfono debe tener 9 dígitos"; 
            validation = false; 
        }
        setTextoAlerta(textoAlerta);
        setModal({...modal, visible: !modal.visible, correct: false});
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
            textoAlerta += "\n - Teléfono ";  
        }else if (state.telefono.length != 9 || isNaN(state.telefono)){
            textoAlerta += "\n - El teléfono debe contener 9 números ";  
        }
        setTextoAlerta(textoAlerta);
        setModal({...modal, visible: !modal.visible});
    }

    //Alertas
    const [modal, setModal] = useState({ visible: false });  
    const [modalRegistro, setModalRegistro] = useState({ visible: false, correct: false });
    const [textoAlerta, setTextoAlerta] = useState();


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
                        <View style={[styles.modalView, {height: '40%'}]}>
                            <View style={{flex: 4}}>
                                <Text style={styles.texto}> {textoAlerta} </Text>
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
                <View>                    
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


export default RegistrarUsuario; 