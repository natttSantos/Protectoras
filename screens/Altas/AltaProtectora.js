import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TextInput,ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import firebase from '../../database/firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import KeyboardAvoidingWrapper from "../../components/KeyboardAvoiding";

//Bibliotecas colores CSS
import {colors} from '../../components/Color';

const AltaProtectora = (props) => {
    DropDownPicker.setListMode("SCROLLVIEW");
    const [loading, setLoading] = useState(true);
    const [protectora, setProtectora] = useState({
        descripcion: "",
        email: "",
        nombre: "",
        contraseña: "",
        localizacion: "",
        direccion: "",
        telefono: "",
        url: ""
    })

    

    const [foto, setFoto] = useState({
        existe:"",
        
      });

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([{label: 'Valencia', value: 'Valencia'},
                        {label: 'Alicante', value: 'Alicante'},
                        {label: 'Cuenca', value: 'Cuenca'}])

    const handleChangeText = (nombre, value) => {
        setProtectora({...protectora, [nombre]: value});
    }

    useEffect(() => {
        getLocationPermission();
      }, []);


      const getProtectoraById = async (id) => {
        const dbRef = firebase.db.collection("protectoras").doc(id);
        const doc = await dbRef.get();
        const protectora = doc.data();
        setProtectora({ ...protectora, id: doc.id });
      }

    const saveNewProtectora = async () => {
        if (protectora.nombre == '' || protectora.email == '' || protectora.provincia == '' || protectora.url == ''|| foto.existe == '') {
            validateFields();
        } else if (validatePasswordAndPhone(protectora.contraseña, protectora.telefono)){
            const dbRef = firebase.db.collection('protectoras');
            const doc = await dbRef.where("email", "==", protectora.email.trim()).get()
            const emailRepe = doc.docs.length == 1

            if(emailRepe) {
                setTextoChikita("El email introducido ya ha sido registrado, pruebe con otro");
                setModalChikita({...modalChikita, visible: !modalChikita.visible});
                
            }
            else {
                await dbRef.add({
                    nombre: protectora.nombre,
                    email: protectora.email,
                    contraseña: protectora.contraseña,
                    direccion: protectora.direccion,
                    localizacion: protectora.localizacion,
                    url: protectora.url,
                    latitud: coordenadas.latitude,
                    longitud: coordenadas.longitude,
                    descripcion: protectora.descripcion,
                    telefono: protectora.telefono,
                    fotoModificada :protectora.nombre+protectora.telefono
                })
                setTextoAlertaRegistro("Bienvenid@ " + protectora.nombre);
                setModalRegistro({...modalRegistro, visible: !modalRegistro.visible, correct: true});
            }
        }
    }

    const [coordenadas, setCoordenadas] = useState({
    });

    async function getLocationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted') {
          alert('Permission denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const current = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
        setCoordenadas({
          latitud: location.coords.latitude,
          longitud: location.coords.longitude
    
        })
        setCoordenadas(current);
        setLoading(false);
      }

    const uploadImage = uri => {
        return new Promise((resolve, reject) => {
          console.log(resolve + " " + reject);
          let xhr = new XMLHttpRequest();
          xhr.onerror = reject;
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              resolve(xhr.response);
            }
          };
          xhr.open("GET", uri);
          xhr.responseType = "blob";
          xhr.send();
        });
      };


    const openGallery = async () => {
    if(protectora.nombre != "" && protectora.telefono.length == 9 && !isNaN(protectora.telefono)){
        const resultPermission =true; 
        if (resultPermission) {
          const resultImagePicker = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
          });
        
          if (resultImagePicker.cancelled === false) {
            const imageUri = resultImagePicker.uri;
            uploadImage(imageUri)
              .then(resolve => {
                let ref = firebase
                .st
                .ref()
                .child(`imagesProtectora/${protectora.nombre+protectora.telefono}`);
                ref
                  .put(resolve)
                  .then(resolve => {
                    console.log(protectora.id);
                    console.log("Imagen subida correctamente");
                    setFoto({
                        existe: "Si"
                     });
                    setTextoChikita("Imagen subida correctamente");
                    setModalChikita({...modalChikita, visible: !modalChikita.visible});
                     
                  })
                  .catch(error => {
                    console.log(error);
                    console.log(error);
                    console.log("Error al subir la imagen");
                  });
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
    }else{
        setTextoChikita("Primero debe introducir el nombre de la protectora y el número de teléfono");
        setModalChikita({...modalChikita, visible: !modalChikita.visible});
        }
      };

    function validatePasswordAndPhone (password, phone) {
        let validation = true; 
        let textoAlerta = "Problemas con: ";
        if (password.length < 4 || password.length > 8){
            textoAlerta += "\n -La contraseña debe tener entre 4-8 caracteres"; 
            validation = false; 
        }
        if (!validation) {
            setTextoChikita(textoAlerta);
            setModalChikita({...modalChikita, visible: !modalChikita.visible});
        }        
        return validation;
      }

    const validateFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (protectora.nombre == ''){
            textoAlerta += "\n - Nombre de protectora"; 
        } if (protectora.contraseña == ''){
            textoAlerta += "\n - Contraseña ";  
        } if (protectora.email == ''){
            textoAlerta += "\n - Mail "; 
        } if (protectora.localizacion == ''){
            textoAlerta += "\n - Localización "; 
        } if (protectora.direccion == ''){
            textoAlerta += "\n - Direccion ";  
        } if (foto.existe == ''){
            textoAlerta += "\n - Foto "; 
        } if (protectora.url == ''){
            textoAlerta += "\n - URL de tu web ";  
        } if (protectora.telefono == ''){
            textoAlerta += "\n - Telefono ";  
        }else if (protectora.telefono.length != 9 || isNaN(protectora.telefono)){
            textoAlerta += "\n - El teléfono debe contener 9 números ";  
        }
        setTextoAlerta(textoAlerta);
        setModalValidateFields({...modalValidateFields, visible: !modalValidateFields.visible});
    }

    //Alertas
    const [modalValidateFields, setModalValidateFields] = useState({ visible: false});  
    const [modalChikita, setModalChikita] = useState({ visible: false});  
    const [modalRegistro, setModalRegistro] = useState({ visible: false, correct: false });
    const [textoAlerta, setTextoAlerta] = useState();
    const [textoChikita, setTextoChikita] = useState();
    const [textoRegistro, setTextoAlertaRegistro] = useState();

    const cerrarAlerta = () => {
        setModalRegistro({...modalRegistro, visible: !modalRegistro.visible})
        props.navigation.navigate('PrincipalScreen');       
    }

    if(loading) {
        return(
            <View>
                <ActivityIndicator />
            </View>
        )
    }
    if(!loading) {
    return(
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
                    <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalRegistro.visible}
                    onRequestClose={() => {
                        setModalRegistro({...modalRegistro, visible: !modalRegistro.visible});
                    }}>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, {height: 170}]}>
                            <View style={{flex: 4}}>
                                <Text style={[styles.textoAlerta, {fontSize: 22}]}> {textoRegistro} </Text>
                            </View>
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity
                                onPress={modalRegistro.correct ? () => cerrarAlerta() : () => setModalRegistro({...modalRegistro, visible: !modalRegistro.visible})}>
                                    <View style={styles.botonCerrar}>
                                        <Text style={[styles.textoAlerta, {fontSize: 20}]}>cerrar</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                    <Text style={styles.titulo}> Da de alta tu protectora </Text>  
                    <View 
                    style={styles.inputGroup}> 
                        <TextInput 
                        style={styles.inputText}
                        placeholder="* Nombre"
                        placeholderTextColor={colors.moradoSecundario}
                        onChangeText={(value) => handleChangeText('nombre', value)}
                        />
                        <TextInput 
                        style={styles.inputText}
                        secureTextEntry={true}
                        placeholder="* Contraseña"
                        placeholderTextColor={colors.moradoSecundario}
                        onChangeText={(value) => handleChangeText('contraseña', value)}
                        />
                        <TextInput 
                            style={styles.inputText}
                            placeholder="* Email"
                            placeholderTextColor={colors.moradoSecundario}
                            onChangeText={(value) => handleChangeText('email', value)}
                            />
                        <DropDownPicker
                                        style={styles.dropDownPicker}
                                        placeholder="* Seleccione una localizacion"
                                        placeholderStyle={{
                                            color: colors.moradoSecundario
                                            }}
                                        items={items}
                                        listItemLabelStyle={{
                                            color: colors.moradoSecundario
                                        }}
                                        setItems={setItems}
                                        open={open}
                                        setOpen={setOpen}
                                        value={value}
                                        setValue={setValue}
                                        onChangeValue={(value) => {
                                            handleChangeText('localizacion', value);
                                        }}
                                    />
                        <TextInput 
                            style={styles.inputText}
                            placeholder="* Dirección"
                            placeholderTextColor={colors.moradoSecundario}
                            onChangeText={(value) => handleChangeText('direccion', value)}
                            />
                        <TextInput 
                            style={styles.inputText}
                            placeholder="* URL de la página web"
                            placeholderTextColor={colors.moradoSecundario}
                            onChangeText={(value) => handleChangeText('url', value)}
                            />
                        <TextInput 
                            style={styles.inputText}
                            placeholder="* Teléfono"
                            placeholderTextColor={colors.moradoSecundario}
                            onChangeText={(value) => handleChangeText('telefono', value)}
                            />
                        <TextInput                     
                            style={styles.descripcion}
                            placeholder="Descripción (max. 200 caracteres)"
                            placeholderTextColor={colors.moradoSecundario}
                            maxLength = {200}
                            multiline = {true}
                            onChangeText={(value) => {
                                if (value.length == 180)
                                    alert("¡Cuidado! Su descripción ya contiene 180 caracteres (max. 200)")
                                if (value.length == 200)
                                    alert("¡Su descripción ya contiene los 200 caracteres permitidos!")
                                handleChangeText('descripcion', value)
                            }}
                            />
                    </View>
                    <View> 
                        <TouchableOpacity 
                            onPress={() => 
                                openGallery()
                            }
                            style={[styles.botonPropiedades, {marginBottom: 20}, {borderColor: colors.moradoPrincipal}]}>
                                <Text style={[styles.botonTexto, {color: colors.moradoPrincipal}]}>
                                    Añadir imagen de perfil
                                </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => 
                                saveNewProtectora()
                            }
                            style={[styles.botonPropiedades, {backgroundColor: colors.amarillo}, {borderColor: colors.amarillo}]}>
                                <Text style={[styles.botonTexto, {color: colors.blanco}, {fontWeight: 'bold'}]}>
                                    Enviar
                                </Text>
                        </TouchableOpacity>
                    </View> 
                </View>
            </KeyboardAvoidingWrapper>
    )
  }
}



const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35,
        backgroundColor: colors.blanco,
        marginTop: 50
    },
    inputGroup: {
        marginBottom: 10,
        marginTop: 10, 
    }, 
    inputText: {
        fontSize: 16,
        color: colors.moradoPrincipal,
        borderBottomWidth: 1,
        borderBottomColor: colors.moradoPrincipal,
        marginBottom: 10,
        marginTop: 10
        
    },
    titulo : {
        fontSize: 27,
        color: colors.moradoPrincipal,
        fontFamily: 'DMSans',
        marginBottom: 10
    },
    descripcion : {
        height: 100,
        borderWidth: 2,
        borderColor: colors.moradoPrincipal,
        borderRadius: 15,
        multiline: true,
        textAlignVertical: "top",
        color: colors.moradoPrincipal,
        fontSize: 16,
        padding: 10,
        marginBottom: 10
    },
    dropDownPicker : {
        marginBottom: 15,
        marginTop: 15,
        borderRadius: 25,
        borderColor: colors.moradoPrincipal,
        borderWidth: 2,
        fontStyle : {
            color: colors.amarillo
        }
    },
    botonPropiedades : {
        borderWidth: 2,
        width:260,
        height:50,
        borderRadius: 25,
        alignSelf: "center"
      }, 
    botonTexto : {
        fontSize: 17,
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
    textoAlerta: {
      fontFamily: 'DMSans',
      color: colors.blanco,
    },
})
export default AltaProtectora;