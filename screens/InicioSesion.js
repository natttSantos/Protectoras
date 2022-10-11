import React, {useState} from "react";
import { View, Button, TextInput, Text,StyleSheet, ScrollView, ProgressViewIOSComponent} from "react-native";
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
        const dbRef = firebase.db.collection('users').onSnapshot((querySnapchot => {
            //const users = [];

            querySnapchot.docs.forEach((doc) => {
                const {email, contraseña} = doc.data();
                /*users.push({
                    id: doc.id,
                    email,
                    contraseña
                })*/
                if (email == state.email && contraseña == state.contraseña) {
                    props.navigation.navigate('UserDetailScreen', {
                        userId: doc.id
                    })
                } 
            })
        }));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputGroup}>
                <TextInput 
                style={styles.inputText}
                placeholder="Email " 
                onChangeText={(value) => handleChangeText('email', value)}
                />
            </View>
            <View style={styles.inputGroup}>
                <TextInput 
                secureTextEntry={true}
                style={styles.inputText}
                placeholder="Contraseña (entre 4-8 caracteres)" 
                onChangeText={(value) => handleChangeText('contraseña', value)}
                />
            </View>
            <View>
                <Button title="Iniciar sesion"
                onPress={() => validateUser()}
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

export default InicioSesion; 