import React, {useState} from "react";
import { View, Button, TextInput, Text,StyleSheet, ScrollView, ProgressViewIOSComponent, Alert, TouchableOpacity} from "react-native";
import firebase from '../database/firebase';

const InicioSesion = (props) => {

    const [state, setState] = useState({ //STATE ES UN OBJETO CON NOMBRE, EMAIL Y TLF
        email: "",
        contraseña: "",
    }); 

    const handleChangeText = (nombre, value) => {
        setState({...state, [nombre]: value}); 
    }; 

    const validateUser = async () => {
        var usuarioCorrecto = false;
        const usuarios = firebase.db.collection('users').onSnapshot((querySnapchot => {
            //const users = [];

            querySnapchot.docs.forEach((doc) => {
                const {email, contraseña} = doc.data();
                /*users.push({
                    id: doc.id,
                    email,
                    contraseña
                })*/
                if (email == state.email && contraseña == state.contraseña) {
                    console.log(doc.id);
                    usuarioCorrecto = true;
                    props.navigation.navigate('SesionUsuario', {
                        userId: doc.id  
                    })
                }
            })
        }));
        const protectoras = firebase.db.collection('protectoras').onSnapshot((querySnapchot => {

            querySnapchot.docs.forEach((doc) => {
                const {email, contraseña} = doc.data();
                if (email == state.email && contraseña == state.contraseña) {
                    console.log(doc.id);
                    usuarioCorrecto = true;
                    props.navigation.navigate('UserDetailScreen', {
                        protectoraId: doc.id
                    })
                }
            })
        }));
        if (!usuarioCorrecto) { 
            Alert.alert("Error", "El usuario o la contraseña son incorrectas", [
                {text: "Cerrar"}
            ]);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.title}>
                    {"Email"}
                </Text>
                <TextInput 
                style={{
                    height: 40,
                    borderColor: "gray",
                    marginTop: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontSize: 18,
                    width: "100%",
                    borderWidth: 1,
                }}                
                onChangeText={(value) => handleChangeText('email', value)}
                />
                <Text style={{fontSize: 20, marginTop: 20,}}>
                    {"Contraseña"}
                </Text>
                <TextInput 
                secureTextEntry={true}
                style={{
                    height: 40,
                    borderColor: "gray",
                    marginTop: 10,
                    marginBottom: 20,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontSize: 18,
                    width: "100%",
                    borderWidth: 1,
                }}
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
        fontSize: 17
      },
      title : {
        fontSize: 20
      },
      button : {
        elevation: 8,
        backgroundColor: "#6c91c2",
        padding: 10
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