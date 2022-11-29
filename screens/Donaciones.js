import React, {useState, useEffect} from "react";
import { View, Button, TextInput, StyleSheet, ScrollView, Text, Alert, TouchableOpacity, Image} from "react-native";
import firebase from '.././database/firebase.js';

//Bibliotecas colores CSS
import {colors} from '../components/Color';
const Donaciones = (props) => {
    
    const [state, setState] = useState({ //STATE ES UN OBJETO CON NOMBRE, EMAIL Y TLF
        nombre: "", 
        apellidos: "",
        numeroTarjeta: "",
        cvv: "",
        fechaExpiracion:"",
        dineroDonado:"",
    }); 


    const [protectora, setProtectora] = useState();
    const [cambios, setcambios] = useState(false);
    const [usuario, setUsario] = useState();


    useEffect(() => {
        getProtectoraById(props.route.params.protectoraId);
        getUsuarioById(props.route.params.userId);
      }, []);



      const getUsuarioById = async (id) => {
        const dbRef = firebase.db.collection("users").doc(id);
        const doc = await dbRef.get();
        const usuario = doc.data();
        console.log(usuario)
        setUsario({ ...usuario, id: doc.id });
        setLoading(false);
        if (usuario.alta == "Si"){
          setPerfilAdoptar({ ...usuario, id: doc.id });
        }
      };

      const getProtectoraById = async (id) => {
        const dbRef = firebase.db.collection("protectoras").doc(id);
        const doc = await dbRef.get();
        const protectora = doc.data();
        setProtectora({ ...protectora, id: doc.id });
        setLoading(false);
      }

    const handleChangeText = (nombre, value) => {
        setState({...state, [nombre]: value}); 
    }; 
    const saveDonacion =  async () => {
        if (state.nombre == '' || state.apellidos == '' || state.cvv == '' || props.route.params.valueFecha == undefined||state.dineroDonado==''||state.numeroTarjeta){
            validateNullFields(); 
        }
            await firebase.db.collection('donaciones').add({
                nombre: state.nombre, 
                apellidos: state.apellidos,
                numeroTarjeta: state.numeroTarjeta,
                cvv: state.cvv,
                dineroDonado: state.dineroDonado,
                fechaExpiracion: props.route.params.valueFecha,
                protectora : protectora.id,
            })
            alert ("Donación completada"); 
        
    } 

    const validateNullFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (state.nombre == ''){
            textoAlerta += "\n - Nombre"; 
        } if (state.apellidos == ''){
            textoAlerta += "\n - Apellidos "; 
        } if (state.numeroTarjeta == ''||isNaN(state.numeroTarjeta) || state.cvv.length > 12|| state.cvv.length < 19){
            textoAlerta += "\n - Número de tarjera (entre 13 y 18 dígitos)"; 
        }
        if (props.route.params.valueFecha == undefined){
            textoAlerta += "\n - Fecha de expiración "; 
        }
        if (state.cvv == '' && isNaN(state.cvv) || state.cvv.length == 3){
            textoAlerta += "\n - CVV (son 3 dígitos)"; 
        }
        if (state.dineroDonado == '' && isNaN(state.dineroDonado)){
            textoAlerta += "\n - Debe poner una cantidad de dinero con dígitos "; 
        }
        if (props.route.params.valueFecha == undefined){
          textoAlerta += "\n - Fecha Nacimiento "; 
      }
        alert (textoAlerta); 
    }


    return (
            <View style={styles.container}>
                <Text style={styles.titulo}> Registro </Text>
                <TextInput 
                    style={styles.textFieldCircular}
                    placeholder="Nombre" 
                    onChangeText={(value) => handleChangeText('nombre', value)}
                />
                <TextInput 
                    style={styles.textFieldCircular}
                    placeholder="Apellidos" 
                    onChangeText={(value) => handleChangeText('apellidos', value)}
                />
                <TextInput 
                    style={styles.textFieldCircular}
                    placeholder="Número de tarjeta" 
                    onChangeText={(value) => handleChangeText('numeroTarjeta', value)}
                />
                <TextInput 
                    style={styles.textFieldCircular}
                    placeholder="CVV" 
                    onChangeText={(value) => handleChangeText('cvv', value)}
                />
                <TouchableOpacity 
                     onPress={() => props.navigation.navigate('FechaExpiracion', {userId: props.route.params.userId, esProtectora: "No"})}
                     style={styles.fechaNacimiento}>
                     <View style={styles.botonFechaNacimiento}>
                        <Text style={styles.texto}> Fecha de expiración </Text>
                        <Image
                        source={require('.././images/Calendario.png')}
                        style={styles.image}
                        />
                    </View>
                </TouchableOpacity>
                <TextInput 
                    style={styles.textFieldCircular}
                    placeholder="Cantidad a donar en €" 
                    onChangeText={(value) => handleChangeText('dineroDonado', value)}
                />
                
                <View style= {{  position: 'absolute', bottom: 0, alignSelf: 'center'}}>                    
                    <TouchableOpacity 
                        onPress={() => saveDonacion()}
                        style={styles.botonCircularAmarillo}>
                            <Text style={styles.botonTexto}>
                                Donar
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
    botonFechaNacimiento: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 5,
        marginRight: 15
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
        marginBottom: 100
      },
      botonTexto: {
        fontSize: 20,
        color: colors.blanco,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 5
      }
})


export default Donaciones; 