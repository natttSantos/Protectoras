import { style } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import React, {useEffect, useState} from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Modal } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from "../../database/firebase";
import * as ImagePicker from 'expo-image-picker';
import {colors} from '../../components/Color';
import { color } from "react-native-elements/dist/helpers";

const ModificarProtectora = (props) => {
    DropDownPicker.setListMode("SCROLLVIEW");

    const [protectora, setProtectora] = useState({
        descripcion: "",
        email: "",
        nombre: "",
        contraseña: "",
        localizacion: "",
        direccion: "",
        telefono: "",
        url: "",
        fotoModificada:""
    })

    const initialStatee = {
        imageFirebase:"a",
        staet :""

      };

    const [cosas, setState] = useState(initialStatee);

    const [foto, setFoto] = useState({
        existe:"",

      });

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([{label: 'Comunidad Valenciana', value: 'Comunidad Valenciana'},
                        {label: 'Alicante', value: 'Alicante'},
                        {label: 'Cuenca', value: 'Cuenca'}])

    const handleChangeText = (nombre, value) => {
        setProtectora({...protectora, [nombre]: value});
    }

    const saveNewProtectora = async () => {
        if (protectora.nombre == '' || protectora.email == ''|| protectora.email == '' || protectora.provincia == '' || protectora.telefono == ""|| protectora.url == ''|| protectora.direccion == ''|| protectora.descripcion == '') {
            validateFields();
        } else  {

            const protectoraRef = firebase.db.collection("protectoras").doc(protectora.id);
            await protectoraRef.set({
                    nombre: protectora.nombre,
                    email: protectora.email,
                    contraseña: protectora.contraseña,
                    direccion: protectora.direccion,
                    localizacion: protectora.localizacion,
                    url: protectora.url,
                    descripcion: protectora.descripcion,
                    telefono: protectora.telefono,
                    fotoModificada : protectora.fotoModificada
                })
                setTextoChikita("Datos cambiado correctamente");
                setModalChikita({...modalChikita, visible: !modalChikita.visible});
                props.navigation.goBack()
            }
            
        }


    const uploadImage = uri => {
        return new Promise((resolve, reject) => {
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

        const resultPermission =true; 
        if (resultPermission) {
          const resultImagePicker = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
          });

          if (resultImagePicker.cancelled === false) {
            let textoAlerta = '';
            const imageUri = resultImagePicker.uri;
            uploadImage(imageUri)
              .then(resolve => {
                let ref = firebase
                .st
                .ref()
                .child(`imagesProtectora/${protectora.fotoModificada}`);
                ref
                  .put(resolve)
                  .then(resolve => {
                    setFoto({
                        existe: "Si"
                     });
                     textoAlerta = 'Image subida correctamente'
                  })
                  .catch(error => {
                    console.log(error);
                    console.log(error);
                    textoAlerta = 'Error al subir la imagen';
                  });
              })
              .catch(error => {
                console.log(error);
              });
              setTextoChikita(textoAlerta);
              setModalChikita({...modalChikita, visible: !modalChikita.visible});
          }
        }
      };

      const getProtectoraById = async (id) => {
        const dbRef = firebase.db.collection("protectoras").doc(id);
        const doc = await dbRef.get();
        const protectora = doc.data();
        setProtectora({ ...protectora, id: doc.id });
        firebase
        .st
        .ref(`imagesProtectora/${protectora.fotoModificada}`)
        .getDownloadURL().then(function(url) {
        setState({
         imageFirebase: url,
         staet: "Existe"

      });
    });
      };

    const [textoChikita, setTextoChikita] = useState();
    const [modalChikita, setModalChikita] = useState({ visible: false});
    const [modalValidateFields, setModalValidateFields] = useState({ visible: false});
    const [textoAlerta, setTextoAlerta] = useState();

      const checkImage = () => {
        const { imageFirebase } = cosas;
        if (cosas != "") {
          return (
            <Image
              style={{ width: 300, height: 300, borderColor: colors.moradoPrincipal, borderWidth: 2, borderRadius: 20, alignSelf: "center" }}
              source={{ uri: imageFirebase }}
            />
          );
        }
        return null;
      }

      useEffect(() => {
        getProtectoraById(props.route.params.userId);
      }, []);


    const validateFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (protectora.nombre == ''){
            textoAlerta += "\n - Nombre de protectora"; 
        } if (protectora.contraseña.length < 4 || protectora.contraseña.length > 8){
            textoAlerta += "\n - La contraseña debe tener entre 4-8 caracteres ";  
        } if (protectora.email == ''){
            textoAlerta += "\n - Mail "; 
        } if (protectora.localizacion == ''){
            textoAlerta += "\n - Localización "; 
        } if (protectora.direccion == ''){
            textoAlerta += "\n - Direccion ";  
        } if (protectora.existe == ''){
            textoAlerta += "\n - Foto "; 
        } if (protectora.url == ''){
            textoAlerta += "\n - URL de tu web ";  
        } if (protectora.telefono == ''){
            textoAlerta += "\n - Teléfono ";  
        }else if (protectora.telefono.length != 9 || isNaN(protectora.telefono)){
            textoAlerta += "\n - El teléfono debe contener 9 números ";  
        }
        setTextoAlerta(textoAlerta);
        setModalValidateFields({...modalValidateFields, visible: !modalValidateFields.visible});
    }

    return(


        <ScrollView style={styles.container}>
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
        <View style={{ justifyContent: 'center', }}>
        {checkImage()}
        <TouchableOpacity 
                            onPress={() => 
                                openGallery()
                            }
                            style={[styles.botonPropiedades, {marginBottom: 20}, {borderColor: colors.moradoPrincipal}]}>
                                <Text style={[styles.botonTexto, {color: colors.moradoPrincipal}]}>
                                    Actualizar imagen de perfil
                                </Text>
                        </TouchableOpacity>
            <Text style={{marginTop: 15, color: 'darkred'}}> * Campo obligatorio </Text>
            <View 
            style={styles.inputGroup}> 

                <TextInput 
                style={styles.inputText}
                placeholder="* Nombre"
                placeholderTextColor={colors.moradoSecundario}
                value = {protectora.nombre}
                onChangeText={(value) => handleChangeText('nombre', value)}
                />
            </View>
            <View 
            style={styles.inputGroup}> 
                <TextInput 
                style={styles.inputText}
                secureTextEntry={true}
                placeholder="* Contraseña"
                placeholderTextColor={colors.moradoSecundario}
                value = {protectora.contraseña}
                onChangeText={(value) => handleChangeText('contraseña', value)}
                />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Email"
                    placeholderTextColor={colors.moradoSecundario}
                    value = {protectora.email}
                    onChangeText={(value) => handleChangeText('email', value)}
                    />
            </View>
            <View>
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
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Dirección"
                    placeholderTextColor={colors.moradoSecundario}
                    value = {protectora.direccion}
                    onChangeText={(value) => handleChangeText('direccion', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* URL de la página web"
                    placeholderTextColor={colors.moradoSecundario}
                    value = {protectora.url}
                    onChangeText={(value) => handleChangeText('url', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Teléfono"
                    placeholderTextColor={colors.moradoSecundario}
                    value = {protectora.telefono}
                    onChangeText={(value) => handleChangeText('telefono', value)}
                    />
            </View>
            <View>
                <TextInput                     
                    style={styles.descripcion}
                    placeholder="Descripción (max. 200 caracteres)"
                    placeholderTextColor={colors.moradoSecundario}
                    maxLength = {200}
                    multiline = {true}
                    value = {protectora.descripcion}
                    onChangeText={(value) => {
                        if (value.length == 180)  {
                            setTextoChikita("¡Cuidado! Su descripción ya contiene 180 caracteres (max. 200)");
                            setModalChikita({...modalChikita, visible: !modalChikita.visible})
                          };
                        if (value.length == 200)  {
                            setTextoChikita("¡Su descripción ya contiene los 200 caracteres permitidos!");
                            setModalChikita({...modalChikita, visible: !modalChikita.visible})
                          };
                        handleChangeText('descripcion', value)
                    }}
                    />
            </View>
            <View style={{marginTop: 15, marginBottom: 80}}>

            <TouchableOpacity 
                            onPress={() => 
                                saveNewProtectora()
                            }
                            style={[styles.botonPropiedades, {backgroundColor: colors.amarillo}, {borderColor: colors.amarillo}]}>
                                <Text style={[styles.botonTexto, {color: colors.blanco}, {fontWeight: 'bold'}]}>
                                    Actualizar
                                </Text>
                        </TouchableOpacity>
            </View>
        </View>
        </ScrollView>

    )
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
    title : {
        fontSize: 40,
        fontWeight: "bold"
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
    botonPropiedades : {
      borderWidth: 2,
      width:260,
      height:50,
      borderRadius: 25,
      alignSelf: "center",
      marginTop: 30
    }, 
  botonTexto : {
      fontSize: 17,
      alignSelf: "center",
      marginTop: 5
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
export default ModificarProtectora;