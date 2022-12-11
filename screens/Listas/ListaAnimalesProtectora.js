import React, {useState, useEffect, useContext} from "react"
import {ScrollView, View, StyleSheet, Text, TouchableOpacity}  from 'react-native'
import {Avatar, ListItem} from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../../database/firebase";
import { CredentialsContext } from "../../components/CredentialsContext";
import {colors} from '../../components/Color';

const ListaAnimalesProtectora = (props) => {
    //const urlImagen = 'https://statics.memondo.com/p/s1/ccs/2022/10/CC_2795378_7e45a8644f28403f99ef1c5df2008edf_meme_otros_este_es_mierdon_thumb_fb.jpg?cb=7121585'
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [titulo, setTitulo] = useState("Animales en");

    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

    let imagenesAux = []
    const animales = props.route.params.animales

    const cargarImagenes = async () => {
        let i = animales.length

        if(i > 0){
            await animales.map(async (animal, index) => {
                await firebase
                .st
                .ref(`images/${animal.nombre}`)
                .getDownloadURL().then(function(url) {
                    i--
                    imagenesAux[index] = url
                    setImagenes(...imagenes, imagenesAux)
                    if(i == 0) setLoading(false)
                });
            })
        }
        else {
            setLoading(false)
        }
    }

    const getProtectoraById = async (id) => {
        const dbRef = firebase.db.collection("protectoras").doc(id);
        const doc = await dbRef.get();
        const protectora = doc.data();
        setTitulo("Animales en " + protectora.nombre);
        setLoading(false);
        
    }

    const [estado, setEstado] = useState({
        perroPressed: false,
        gatoPressed: false,
    })

    const cargarFiltros = () => {
        var animalesFiltrado = []; 
        var noHayAnimalesFiltrado = "";
        setTimeout(() => {
            if (estado.gatoPressed){ 
                animalesFiltrado = animales.filter(animal => animal.tipo === 'Gato');   
            }
            if(estado.perroPressed){
                animalesFiltrado = animales.filter(animal => animal.tipo === 'Perro');
            } 
        }, 1000)
        if(animalesFiltrado.length == 0){
            noHayAnimalesFiltrado = "No hay animales para los filtros seleccionados :("; 
        }
    }

    const handleColorChange = (animal) => {
        if(animal == 'perro'){
          if(estado.gatoPressed && !estado.perroPressed)
            setEstado({ ...estado, ['perroPressed']: !estado.perroPressed, ['gatoPressed']: !estado.gatoPressed});
          else
            setEstado({ ...estado, ['perroPressed']: !estado.perroPressed});}
        else { 
          if(estado.perroPressed && !estado.gatoPressed)
            setEstado({ ...estado, ['gatoPressed']: !estado.gatoPressed, ['perroPressed']: !estado.perroPressed});
          else
            setEstado({ ...estado, ['gatoPressed']: !estado.gatoPressed});}
        cargarFiltros();
    };

    useEffect(() => {
        cargarImagenes(),
        getProtectoraById(storedCredentials)
    }, [])
    
    if(loading) {
        return(
            <View>
                <ActivityIndicator />
            </View>
        )
    }

    if(animales.length > 0) {
        return(
            <ScrollView>
                <Text style={styles.titulo}> {titulo} </Text>
                <View style={{flexDirection: 'row', alignContent:'flex-start', paddingLeft: 20}}>
                <TouchableOpacity
                    style={styles.button}>
                    <Text style={styles.buttonText}> perros </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}>
                    <Text style={styles.buttonText}> gatos </Text>
                </TouchableOpacity>
                </View>
                
                    {animales.map((animal, index) => {
                        return (
                            <ListItem key={animal.id}
                                bottomDivider
                                onPress={() => {props.navigation.navigate('PerfilAnimal', {animalId: animal.id, userId: props.route.params.userId, esUsuario: false})}}>
                                <Avatar 
                                style = {styles.imagen}
                                source={{uri: imagenes[index]}}
                                />
                                <ListItem.Content 
                                style = {styles.lista}
                                >
                                    <ListItem.Title> {animal.nombre} </ListItem.Title>
                                    <ListItem.Subtitle> {animal.raza} </ListItem.Subtitle>
                                    <ListItem.Subtitle> {animal.sexo} </ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>);
                    })}
                </ScrollView>
        )
    } else {
        return (
            <View>
                <Text style={styles.titulo}>
                    No hay animales
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imagen: {
        height: 60,
        width: 60
    },
    lista: {
        margin: 12,
        padding: 10
    }, 
    titulo: {
        fontFamily: 'DMSans',
        fontSize: 32,
        marginBottom: 30,
        marginTop: 40,
        marginLeft: 30,
        color: colors.moradoPrincipal,
    },
    button : {
        elevation: 3,
        backgroundColor: colors.amarillo,
        padding: 10,
        borderRadius: 20,
        marginBottom: 20,
        marginRight: 20
    },
    buttonText: {
        fontSize: 16,
        color: colors.blanco,
        fontFamily: 'DMSans',
       alignSelf: "center", 
     },
})
export default ListaAnimalesProtectora;