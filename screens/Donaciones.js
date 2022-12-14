import React, {useState, useEffect} from "react";
import { View, Button, TextInput, StyleSheet, ScrollView, Text, Alert, TouchableOpacity, Image, Modal} from "react-native";
import firebase from '.././database/firebase.js';

import KeyboardAvoidingWrapper from "../components/KeyboardAvoiding.js";

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
    const [perfil, setPerfilAdoptar] = useState(); //DAMI: AÑADÍ ESTO PARA DECLARAR EL PERFIL, NO SE SI VA BIEN PERO YA NO SALE WARNING
    const [cambios, setcambios] = useState(false);
    const [usuario, setUsario] = useState();
    const [fecha, setFecha] = useState("* Fecha de expiración");
    const [textoChikita, setTextoChikita] = useState();
    const [modalChikita, setModalChikita] = useState({ visible: false}); 
    const [modalValidateFields, setModalValidateFields] = useState({ visible: false});
    const [textoAlerta, setTextoAlerta] = useState();

    useEffect(() => {
        getProtectoraById(props.route.params.protectoraId);
        getUsuarioById(props.route.params.userId);
        handleFecha();
      }, [protectora]);

      

      let fechaActual = new Date();

      const getUsuarioById = async (id) => {
        const dbRef = firebase.db.collection("users").doc(id);
        const doc = await dbRef.get();
        const usuario = doc.data();
        setUsario({ ...usuario, id: doc.id });
        if (usuario.alta == "Si"){
          setPerfilAdoptar({ ...usuario, id: doc.id });
        }
      };

      const getProtectoraById = async (id) => {
        const dbRef = firebase.db.collection("protectoras").doc(id);
        const doc = await dbRef.get();
        const protectora = doc.data();
        setProtectora({ ...protectora, id: doc.id });
      }

    const handleChangeText = (nombre, value) => {
        setState({...state, [nombre]: value}); 
    }; 
    
    function handleFecha() {
        if (props.route.params.valueFecha != undefined) {
            setFecha(props.route.params.valueFecha);
        }
    }

    const saveDonacion =  async () => {
        if (state.nombre == '' || state.apellidos == '' || state.cvv == '' || props.route.params.valueFecha == undefined||state.dineroDonado==''||state.numeroTarjeta==""){
            validateNullFields(); 
        }else{
            await firebase.db.collection('donaciones').add({
                nombre: state.nombre, 
                apellidos: state.apellidos,
                numeroTarjeta: state.numeroTarjeta,
                cvv: state.cvv,
                dineroDonado: state.dineroDonado,
                fechaExpiracion: props.route.params.valueFecha,
                protectora : protectora.id,
                id_Usuario: props.route.params.userId,
                leida: "No",
                dia : fechaActual.getDate(),
                mes : fechaActual.getMonth(),
                año: fechaActual.getFullYear(),
            })
            setTextoChikita("Donación completada");
            setModalChikita({...modalChikita, visible: !modalChikita.visible});
        }

            
        
    } 

    const validateNullFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (state.nombre == ''){
            textoAlerta += "\n - Nombre"; 
        } if (state.apellidos == ''){
            textoAlerta += "\n - Apellidos "; 
        }if (state.numeroTarjeta == ''|| isNaN(state.numeroTarjeta) || (state.cvv.length < 12 && state.cvv.length > 19)){
            textoAlerta += "\n - Número de tarjeta (entre 13 y 18 dígitos)"; 
        }
        if (props.route.params.valueFecha == undefined){
            textoAlerta += "\n - Fecha de expiración "; 
        }
        if (state.cvv == '' || isNaN(state.cvv) || state.cvv.length != 3){
            textoAlerta += "\n - CVV (son 3 dígitos)"; 
        }
        if (state.dineroDonado == '' || isNaN(state.dineroDonado)){
            textoAlerta += "\n - Debe poner una cantidad de dinero con dígitos "; 
        }
        setTextoAlerta(textoAlerta);
        setModalValidateFields({...modalValidateFields, visible: !modalValidateFields.visible});
    }
  

    return (
        <KeyboardAvoidingWrapper>
            <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}                    
                visible={modalValidateFields.visible}
                onRequestClose={() => {
                    setModalValidateFields({...modalValidateFields, visible: !modalValidateFields.visible});
                }}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, {height: '50%'}]}>
                        <View style={{flex: 4}}>
                            <Text style={[styles.textoAlerta, {fontSize: 20}]}> {textoAlerta} </Text>
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                            onPress={() => setModalValidateFields({...modalValidateFields, visible: !modalValidateFields.visible})}>
                                <View style={styles.botonCerrar}>
                                    <Text style={[styles.textoAlerta, {fontSize: 20}]}>cerrar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}                    
                visible={modalChikita.visible}
                onRequestClose={() => {
                    setModalChikita({...modalChikita, visible: !modalChikita.visible});
                }}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, {height: '30%'}]}>
                        <View style={{flex: 4}}>
                            <Text style={[styles.textoAlerta, {fontSize: 20}]}> {textoChikita} </Text>
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                            onPress={() => setModalChikita({...modalChikita, visible: !modalChikita.visible})}>
                                <View style={styles.botonCerrar}>
                                    <Text style={[styles.textoAlerta, {fontSize: 20}]}>cerrar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
                <Text style={styles.titulo}> Donaciones </Text>
                <TextInput 
                    style={styles.textField}
                    placeholder="* Nombre"
                    placeholderTextColor={colors.moradoSecundario}
                    onChangeText={(value) => handleChangeText('nombre', value)}
                />
                <TextInput 
                    style={styles.textField}
                    placeholder="* Apellidos"
                    placeholderTextColor={colors.moradoSecundario} 
                    onChangeText={(value) => handleChangeText('apellidos', value)}
                />
                <TextInput 
                    style={styles.textField}
                    placeholder="* Número de tarjeta" 
                    placeholderTextColor={colors.moradoSecundario}
                    onChangeText={(value) => handleChangeText('numeroTarjeta', value)}
                />
                <TextInput 
                    style={styles.textField}
                    placeholder="* CVV" 
                    placeholderTextColor={colors.moradoSecundario}
                    onChangeText={(value) => handleChangeText('cvv', value)}
                />
                <TouchableOpacity 
                onPress={() => props.navigation.navigate('FechaExpiracion', {userId: props.route.params.userId, esProtectora: "No"})}
                style={styles.fechaNacimiento}>
                <View style={styles.botonFechaNacimiento}>
                    <Text style={fecha != "* Fecha de expiración" ? styles.textoFecha : styles.texto}> {fecha} </Text>
                    <Image
                    source={require('.././images/Calendario.png')}
                    style={styles.image}
                    />
                </View>
                </TouchableOpacity>
                <TextInput 
                    style={styles.textField}
                    placeholder="* Cantidad a donar en €" 
                    placeholderTextColor={colors.moradoSecundario}
                    onChangeText={(value) => handleChangeText('dineroDonado', value)}
                />                
                <View>                    
                    <TouchableOpacity 
                        onPress={() => saveDonacion()}
                        style={styles.botonCircularAmarillo}>
                            <Text style={styles.botonTextoAmarillo}>
                                Donar
                            </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingWrapper>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35,
        backgroundColor: colors.blanco,
        marginTop: 50,
        height: 750
    },
    titulo : {
        fontSize: 32,
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
    textField: {
        marginTop: 20,
        borderWidth: 1,
        borderBottomColor: colors.moradoPrincipal,
        borderRightColor: colors.blanco,
        borderLeftColor: colors.blanco,
        borderTopColor: colors.blanco,
        fontSize: 16,
        color: colors.moradoPrincipal,
        fontFamily: 'InterRegular'
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
        marginTop: 100,
        backgroundColor: colors.amarillo,
        borderColor: colors.blanco,
        borderWidth: 2,
        width:260,
        height:50,
        borderRadius: 25,
        alignSelf: "center"
      },
      botonTextoAmarillo: {
        fontSize: 20,
        color: colors.blanco,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 5
      },
      texto: {
        fontFamily: 'InterRegular',
        color: colors.moradoSecundario,
        fontSize: 16
      },
      image: {
        flex: 1,
        width: 22,
        height: 22,
        resizeMode: 'contain'
      },
      fechaNacimiento: {
        marginTop: 20,
        height: 49,
        borderRadius: 24.5,
        borderColor: colors.moradoPrincipal,
        borderWidth: 1,
        justifyContent: 'center'
      },
      textoFecha: {
        fontFamily: 'InterRegular',
        color: colors.moradoPrincipal,
        fontSize: 16,
        marginRight: 100
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
      textoAlerta: {
        fontFamily: 'DMSans',
        color: colors.blanco,
      },
})


export default Donaciones; 