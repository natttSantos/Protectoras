import React, {useEffect, useState, useContext } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, Modal, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from '../../database/firebase';
import { CredentialsContext } from "../../components/CredentialsContext";
import * as ImagePicker from 'expo-image-picker';


//Bibliotecas colores CSS
import {colors} from '../../components/Color';

const AltaAdoptar = (props) => {
    const initialState = {
      nombre:"",
      apellidos:"",
      localizacion:"",
      dni:"",
      n_animales:"",
      
    };
    const drop = DropDownPicker.setListMode("SCROLLVIEW");

    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    useEffect(() => {
        getUsuarioById(storedCredentials);
      }, []);

      const getUsuarioById = async (id) => {
        const dbRef = firebase.db.collection("users").doc(id);
        const doc = await dbRef.get();
        const usuario = doc.data();
        setUsuario({ ...usuario, id: doc.id });
        setLoading(false);
      };
    const [fotoModificada, setFoto] = useState({
        existe:"",
    });
    const [nuevosDatos, setNuevosDatos] = useState(initialState);
    const [usuario, setUsuario] = useState();
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([{label: 'Valencia', value: 'Valencia'},
                        {label: 'Alicante', value: 'Alicante'},
                        {label: 'Castellon', value: 'Castellon'}])

    const handleChangeText = (nombre, value) => {
        setNuevosDatos({...nuevosDatos, [nombre]: value});
    }

    const updateUsuario = async () => {
        if (nuevosDatos.nombre == '' || nuevosDatos.apellidos == ''|| fotoModificada.existe == '' || nuevosDatos.localizacion == '' || nuevosDatos.dni == ''|| nuevosDatos.n_animales == '') {
            console.log(nuevosDatos.apellidos);
            validateFields();
        } else if (nuevosDatos.nombre != '' && nuevosDatos.apellidos != '' && nuevosDatos.localizacion != '' && nuevosDatos.dni != ''&& nuevosDatos.n_animales != ''){
        const usuarioRef = firebase.db.collection("users").doc(usuario.id);
        console.log(usuario.id);
        await usuarioRef.set({
          alta : "Si",  
          nombre : nuevosDatos.nombre,
          apellidos : nuevosDatos.apellidos,
          dni : nuevosDatos.dni,
          localizacion : nuevosDatos.localizacion,
          n_animales : nuevosDatos.n_animales,
          email : usuario.email,
          contraseña: usuario.contraseña,
          usuario: usuario.usuario,
          telefono: usuario.telefono,
        });
        setUsuario(initialState);
        setTextoAlertaRegistro("Perfil de adopción creado");
        setModalRegistro({...modalRegistro, visible: !modalRegistro.visible, correct: true});
        }
      };

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
                .child(`imagesUsuario/${props.route.params.userId}`);
                ref
                  .put(resolve)
                  .then(resolve => {
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
      };
    const validateFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (nuevosDatos.nombre == ''){
            textoAlerta += "\n - Nombre "; 
        } if (nuevosDatos.apellidos == ''){
            textoAlerta += "\n - Apellidos ";  
        } if (nuevosDatos.dni == ''){
            textoAlerta += "\n - DNI "; 
        }else if(nuevosDatos.dni.length != 9){
            textoAlerta += "\n - El DNI está compuesto por 8 números y una letra"; 
        }  if (nuevosDatos.localizacion == ''){
            textoAlerta += "\n - Localización ";  
        } if (nuevosDatos.n_animales == ''){
            textoAlerta += "\n - Número de animales ";  
        }if (fotoModificada.existe == ''){
            textoAlerta += "\n - Foto ";  
        }
        setTextoAlerta(textoAlerta);
        setModalValidateFields({...modalValidateFields, visible: !modalValidateFields.visible});
    }

    const [modalChikita, setModalChikita] = useState({ visible: false});  
    const [textoChikita, setTextoChikita] = useState();
    const [modalValidateFields, setModalValidateFields] = useState({ visible: false});  
    const [textoAlerta, setTextoAlerta] = useState();
    const [modalRegistro, setModalRegistro] = useState({ visible: false, correct: false });
    const [textoRegistro, setTextoAlertaRegistro] = useState();

    const cerrarAlerta = () => {
      setModalRegistro({...modalRegistro, visible: !modalRegistro.visible})
      props.navigation.navigate('SesionUsuario', {userId: usuario.id})  
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
                  <View style={[styles.modalView, {height: '45%'}]}>
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
          <Text style={styles.titulo}> Crear Perfil Adoptar </Text>
          
          <TextInput 
            style={styles.inputText}
            placeholder="Nombre"
            placeholderTextColor={colors.moradoSecundario}
            onChangeText={(value) => handleChangeText('nombre', value)}                
          />
          <TextInput                 
            style={styles.inputText}
            placeholder="Apellidos"
            placeholderTextColor={colors.moradoSecundario}
            onChangeText={(value) => handleChangeText('apellidos', value)}
          />
          <View>
          <DropDownPicker
              style={styles.dropDownPicker}
              placeholder="Seleccione una localidad"
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
              <TextInput 
                  style={styles.inputText}
                  placeholder="DNI"
                  placeholderTextColor={colors.moradoSecundario}
                  onChangeText={(value) => handleChangeText('dni', value)}
                  />
              <TextInput 
                  style={styles.inputText}
                  placeholder="Número de mascotas actuales"
                  placeholderTextColor={colors.moradoSecundario}
                  onChangeText={(value) => handleChangeText('n_animales', value)}
                  />
                  
          <View style={{marginTop: 15}}>
            <TouchableOpacity 
                  onPress={() => 
                      openGallery()
                  }
                  style={[styles.botonPropiedades, {marginBottom: 10}, {borderColor: colors.moradoPrincipal}]}>
                      <Text style={[styles.botonTexto, {color: colors.moradoPrincipal}]}>
                          Añadir imagen de perfil
                      </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => 
                  updateUsuario()
                }
                style={[styles.botonPropiedades, {backgroundColor: colors.amarillo}, {borderColor: colors.amarillo}]}>
                    <Text style={[styles.botonTexto, {color: colors.blanco}, {fontWeight: 'bold'}]}>
                        Dar de alta
                    </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35,
        height: 350,
        backgroundColor: colors.blanco
    },
    inputText: {
      fontSize: 16,
      color: colors.moradoPrincipal,
      borderBottomWidth: 1,
      borderBottomColor: colors.moradoPrincipal,
      marginTop: 20      
  },
  dropDownPicker : {
    marginTop: 25,
    borderRadius: 25,
    borderColor: colors.moradoPrincipal,
    borderWidth: 2,
    fontStyle : {
        color: colors.amarillo
    }
},
    titulo : {
      fontSize: 32,
      fontWeight: 'bold',
      marginTop: 30,
      color: colors.moradoPrincipal,
      fontFamily: 'DMSans'
  },
    descripcion : {
        height: 100,
        borderWidth: 2,
        borderColor: '#cccccc'
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
    botonPropiedades : {
      borderWidth: 2,
      width:260,
      height:50,
      borderRadius: 25,
      alignSelf: "center",
      marginTop: 20
    }, 
     
    botonTexto : {
      fontSize: 20,
      alignSelf: "center",
      marginTop: 5
  },
})
export default AltaAdoptar;