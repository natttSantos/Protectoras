import React, {useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from '../database/firebase';


const PerfilAdoptar = (props) => {
    const initialState = {
      nombre:"",
      apellidos:"",
      localizacion:"",
      dni:"",
      n_animales:"",
      
    };
    const drop = DropDownPicker.setListMode("SCROLLVIEW");

    useEffect(() => {
        getUsuarioById(props.route.params.userId);
      }, []);

      const getUsuarioById = async (id) => {
        const dbRef = firebase.db.collection("users").doc(id);
        const doc = await dbRef.get();
        const usuario = doc.data();
        setUsuario({ ...usuario, id: doc.id });
        setLoading(false);
      };

    const [usuario, setUsuario] = useState(initialState);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([{label: 'Comunidad Valenciana', value: 'Comunidad Valenciana'},
                        {label: 'Alicante', value: 'Alicante'},
                        {label: 'Cuenca', value: 'Cuenca'}])

    const handleChangeText = (nombre, value) => {
        setUsuario({...usuario, [nombre]: value});
    }


    return(
        <ScrollView style={styles.container}> 
            <Text style={styles.title}>Perfil Adoptar </Text>
            <View 
            style={styles.inputGroup}> 
                        <Text style = {styles.texto} >
          {"Nombre: " + usuario.nombre}
        </Text>
        <Text style = {styles.texto} >
          {"Apellidos: " + usuario.apellidos}
        </Text>
        <Text style = {styles.texto} >
          {"Localización: " + usuario.localizacion}
        </Text>
        <Text style = {styles.texto} >
          {"DNI: " + usuario.dni}
        </Text>    
        <Text style = {styles.texto} >
          {"Número de animales: " + usuario.n_animales.toString()}
        </Text> 
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
        padding: 0,
        marginBottom: 10,
        marginTop: 10, 
        borderBottomWidth: 2, 
        borderBottomColor: '#cccccc'
    }, 
    inputText: {
        fontSize: 17
    },
    title : {
        fontSize: 40,
        fontWeight: "bold"
    },
    descripcion : {
        height: 100,
        borderWidth: 2,
        borderColor: '#cccccc'
    },
    texto: {
        fontSize : 16,
        padding : 5,
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc",
        marginBottom: 10
      }
})
export default PerfilAdoptar;