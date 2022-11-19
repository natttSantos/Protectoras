import React, { useEffect, useState }from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";

const AltaGlobal = (props) => {
  return (
    <ScrollView  style={styles.container}>
    <View>
        <Text style={styles.title}> Selecciona el registro </Text>
         
        {props.route.params.isUsuario ? 
          <TouchableOpacity 
                      onPress={() => {
                        props.navigation.navigate('AltaProtectora', {userId: props.route.params.userId}) 
                      }}
                      style={styles.button}>
                          <Text style={styles.buttonText}>
                              Dar de alta protectora
                          </Text>
          </TouchableOpacity> 
        :
          <TouchableOpacity 
                      onPress={() => {
                        props.navigation.navigate('RegistrarAnimal', {userId: props.route.params.userId})    
                      }}
                      style={styles.button}>
                          <Text style={styles.buttonText}>
                              Dar de alta animal
                          </Text>
          </TouchableOpacity>
        }
    </View>
    </ScrollView>
  );
};

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
        marginTop: 30, 
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

export default AltaGlobal;