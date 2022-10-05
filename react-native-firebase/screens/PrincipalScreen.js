import React, {useState} from "react";
import { View, Button, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from "react-native";
import ficheroImagenes from '../images/ficheroImagenes'; 


const PrincipalScreen = (props) => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}> GETPET
                {"\n"}
                 </Text>
                <Image
                    source={require('../images/gatitos.jpg')}
                    style={styles.image}
                />
            </View>
            <View style={styles.fixToText}>
                <Button 
                title="Iniciar Sesión"
                onPress={() => props.navigation.navigate('InicioSesion')}
                />
                <Button
                title="Registrar"
                onPress={() => props.navigation.navigate('RegistrarUsuario')}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35, 
        justifyContent: 'center', 
        alignItems: 'center'
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
        justifyContent: 'space-between',
    },
    button : {
        backgroundColor: 'blue', 
        padding : 7, 
        marginTop: 10
    }
})


export default PrincipalScreen; 