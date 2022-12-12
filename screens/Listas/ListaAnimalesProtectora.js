import React, {useState, useEffect, useContext} from "react"
import {ScrollView, View, StyleSheet, Text, TouchableOpacity, Image}  from 'react-native'
import {Avatar, ListItem} from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../../database/firebase";
import { CredentialsContext } from "../../components/CredentialsContext";
import {colors} from '../../components/Color';
import { watchPositionAsync } from "expo-location";

const ListaAnimalesProtectora = (props) => {
    //const urlImagen = 'https://statics.memondo.com/p/s1/ccs/2022/10/CC_2795378_7e45a8644f28403f99ef1c5df2008edf_meme_otros_este_es_mierdon_thumb_fb.jpg?cb=7121585'
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [titulo, setTitulo] = useState("Animales en");
    const [animalesACargar, setAnimalesACargar] = useState([]);
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)


    const animales = props.route.params.animales

    const cargarAnimales = async (animalesMostrar) => {
        const animalesAux = []
        let i = animalesMostrar.length
        if(i > 0){
            await animalesMostrar.map(async (animal, index) => {
                await firebase
                .st
                .ref(`images/${animal.nombre}`)
                .getDownloadURL().then(url => {
                    i--
                    animalesAux.push({
                        id: animal.id,
                        nombre: animal.nombre,
                        tipo: animal.tipo,
                        raza: animal.raza,
                        sexo: animal.sexo,
                        edad: animal.edad,
                        url: url
                    })
                    if (i == 0) setAnimalesACargar(animalesAux)
                });
            })
        }
        setLoading(false)                
    }

    const getProtectoraById = async (id) => {
        const dbRef = firebase.db.collection("protectoras").doc(id);
        const doc = await dbRef.get();
        const protectora = doc.data();
        setTitulo("Animales en " + protectora.nombre);
        setLoading(false);
        
    }
    

    function cargarFiltros() {
            var animalesFiltrado = []; 
            var noHayAnimalesFiltrado = "";
            if (estado.gatoPressed){ 
                animalesFiltrado = animales.filter(animal => animal.tipo == 'Gato');
            }
            if(estado.perroPressed){
                animalesFiltrado = animales.filter(animal => animal.tipo == 'Perro');
            }
            if(!estado.perroPressed && !estado.gatoPressed) {
                animalesFiltrado = animales;
            }
        setLoading(false)
        if(animalesFiltrado.length == 0){
            noHayAnimalesFiltrado = "No hay animales para los filtros seleccionados :("; 
        }
        cargarAnimales(animalesFiltrado)
        
    }

    const [estado, setEstado] = useState({
        perroPressed: false,
        gatoPressed: false,
    })

    const handleColorChange = async (animal) => {
        if(animal == 'perro'){
            if(estado.gatoPressed && !estado.perroPressed) {
                estado.perroPressed = !estado.perroPressed;
                estado.gatoPressed = !estado.gatoPressed; 
                let newEstado = {...estado};
                setEstado(newEstado);
            } else {
                estado.perroPressed = !estado.perroPressed;
                let newEstado = {...estado};
                setEstado(newEstado);}
            }
          else { 
            if(estado.perroPressed && !estado.gatoPressed) {
                estado.gatoPressed = !estado.gatoPressed;
                estado.perroPressed = !estado.perroPressed;
                let newEstado = {...estado};
                setEstado(newEstado);
            } else {
                estado.gatoPressed = !estado.gatoPressed;
                let newEstado = {...estado}
                setEstado(newEstado);
            }
        }
            
        cargarFiltros();
    }

    useEffect(() => {
        cargarAnimales(animales),
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
            <ScrollView style={styles.container}>
                <Text style={styles.titulo}> {titulo} </Text>
                <View style={{flexDirection: 'row', paddingLeft: 20}}>
                    <TouchableOpacity
                        onPress={() => {handleColorChange('perro')}}
                        style={[styles.buttonGatoPerro, {marginRight: 6}, estado.perroPressed ? {backgroundColor: colors.amarillo} : {backgroundColor: colors.blanco}]}>
                            <Text style={[styles.buttonText, estado.perroPressed ? {color: colors.blanco} : {color: colors.amarillo}]}>
                                perro
                            </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {handleColorChange('gato')}}
                        style={[styles.buttonGatoPerro, estado.gatoPressed ? {backgroundColor: colors.amarillo} : {backgroundColor: colors.blanco}]}>
                            <Text style={[styles.buttonText, estado.gatoPressed ? {color: colors.blanco} : {color: colors.amarillo}]}>
                                gato
                            </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    onPress={() => props.navigation.navigate('RegistrarAnimal', {userId: props.route.params.userId}) }
                    style={styles.buttonAltaAnimal}>
                    <Text style={styles.textoAltaAnimal}> + Añadir nuevo animal </Text>
                </TouchableOpacity>
                    {animalesACargar.map((animal, index) => {
                        return (
                            <View key={animal.id}>
                                <TouchableOpacity
                                    style={styles.animalContainer}
                                    onPress={() => props.navigation.navigate('PerfilAnimal', { animalId: animal.id, userId: props.route.params.userId, esUsuario: true })}>
                                    <View style={styles.imagenContainer}>
                                        <Image source={{uri: animal.url}} style={{width:100, height: 100, borderRadius: 50}} />
                                    </View>
                                    <View style={styles.infoContainer}>
                                        <View style={styles.nombreContainer}>
                                        <Text style={styles.nombreTexto}>{animal.nombre}</Text>
                                    </View>
                                    <View style={styles.descripcionSexoContainer}>
                                    <View style={styles.descripcionContainer}>
                                        <Text style={styles.descripcionTexto}>{animal.edad} año(s)</Text>
                                        <Text style={styles.descripcionTexto}>{animal.raza}</Text>
                                    </View>
                                    <View style={styles.sexoContainer}>
                                        <Image source={animal.sexo == 'Masculino' ? require('../../images/Masculino.png') : require('../../images/Femenino.png')}/>
                                    </View>
                                    </View>
                                </View>
                                </TouchableOpacity>
                            </View>
                        );
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
    container: {
        flex: 1, 
        padding: 15,
        backgroundColor: 'white'
    },
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
        marginLeft: 15,
        color: colors.moradoPrincipal,
    },
    button : {
        alignSelf: 'center',
        padding: 10,
        borderRadius: 20,
        marginBottom: 20,
        width: 120
    },
    buttonText: {
        fontSize: 16,
        color: colors.blanco,
        fontFamily: 'InterRegular',
        alignSelf: "center", 
    },
    buttonGatoPerro : {
        width: 80,
        height: 40, 
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.amarillo,
        borderWidth: 2,
        padding: 6, 
        marginBottom: 20
    },
    buttonAltaAnimal: {
        width: '90%',
        height: 80,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colors.moradoSecundario,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 30,
        justifyContent: 'center',
    },
    textoAltaAnimal: {
        fontFamily: 'InterRegular',
        fontSize: 16,
        alignSelf: 'center',
        color: colors.moradoSecundario
    },
    animalContainer: {
        flex: 1,
        width: '90%',
        height: 140,
        borderColor: colors.moradoPrincipal,
        borderWidth: 2,
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row'
    },
    imagenContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
      },
      infoContainer: {
        flex: 3,
      },
      nombreContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 20,
        justifyContent: 'space-between',
      },
      nombreTexto: {
        fontFamily: 'DMSans',
        fontSize: 20,
        color: colors.negro
      },
      descripcionContainer: {
        flex: 5,
        justifyContent: 'flex-start',
        paddingLeft: 20
      },
      descripcionTexto: {
        fontFamily: 'InterRegular',
        fontSize: 16,
        color: colors.negro
      },
      sexoContainer: {
        flex: 1,
        justifyContent: 'center'
      },
      descripcionSexoContainer: {
        flex: 1,
        flexDirection: 'row',
      }
})
export default ListaAnimalesProtectora;