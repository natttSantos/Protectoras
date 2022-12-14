import { style } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import React, {useEffect, useState} from "react";
import { ScrollView, View, Text, StyleSheet, TextInput,Image, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from "../../database/firebase";
import * as ImagePicker from 'expo-image-picker';
import {colors} from '../../components/Color';

const ModificarUsuario = (props) => {
    DropDownPicker.setListMode("SCROLLVIEW");

    const [usuario, setUsuario] = useState({
        alta: "",
        usuario: "",
        contraseña: "",
        email: "",
        telefono : "",

        nombre: "",
        apellidos: "",
        localizacion: "",
        dni:"",
        n_animales:"",
    })

    const initialStatee = {
        imageFirebase:"a",
        staet :""

      };

    const [cosas, setState] = useState(initialStatee);

    const [fotoModificada, setFoto] = useState({
        existe:"",

      });

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([{label: 'Comunidad Valenciana', value: 'Comunidad Valenciana'},
                        {label: 'Alicante', value: 'Alicante'},
                        {label: 'Cuenca', value: 'Cuenca'}])

    const handleChangeText = (nombre, value) => {
        setUsuario({...usuario, [nombre]: value});
    }

    const saveNewUsuario = async () => {
        console.log(usuario.nombre);
        

        if (usuario.usuario == '' || usuario.contraseña.length < 4 || usuario.contraseña.length > 8 || usuario.email == '' || usuario.telefono == '' || usuario.nombre == ""|| usuario.apellidos == ''|| usuario.localizacion == ''|| usuario.dni == ''|| usuario.n_animales == '') {
            validateFields();
        } else  {

            const usuarioRef = firebase.db.collection("users").doc(usuario.id);
            console.log(usuario.id);
            await usuarioRef.set({
                    alta: usuario.alta,
                    usuario: usuario.usuario,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    contraseña: usuario.contraseña,
                    telefono: usuario.telefono,

                    nombre: usuario.nombre,
                    apellidos: usuario.apellidos,
                    localizacion: usuario.localizacion,
                    dni: usuario.dni,
                    n_animales: usuario.n_animales,
                })
                alert("Datos cambiados correctamente")
            }
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
                     alert("Imagen subida correctamente")
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

      const getUsuarioById = async (id) => {
        const dbRef = firebase.db.collection("users").doc(id);
        const doc = await dbRef.get();
        const usuario = doc.data();
        setUsuario({ ...usuario, id: doc.id });
        firebase
        .st
        .ref(`imagesUsuario/${props.route.params.userId}`)
        .getDownloadURL().then(function(url) {
        console.log(url);
        setState({
         imageFirebase: url,
         staet: "Existe"

      });
    });
      };


      const checkImage = () => {
        const { imageFirebase } = cosas;
        if (cosas != "") {
          return (
            <Image
              style={{ width: 300, height: 300, borderWidth: 2, borderColor: colors.moradoPrincipal, borderRadius: 20 }}
              source={{ uri: imageFirebase }}
            />
          );
        }
        return null;
      }

      useEffect(() => {
        getUsuarioById(props.route.params.userId);
        console.log(props.route.params.userId);
      }, []);


    const validateFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (usuario.nombre == ''){
            textoAlerta += "\n - Nombre de Usuario"; 
        } if (usuario.contraseña.length < 4 || usuario.contraseña.length > 8){
            textoAlerta += "\n - La contraseña debe tener entre 4-8 caracteres ";  
        } if (usuario.email == ''){
            textoAlerta += "\n - Mail "; 
        } if (usuario.localizacion == ''){
            textoAlerta += "\n - Localización "; 
        } if (usuario.n_animales == ''){
            textoAlerta += "\n - Número de animales ";  
        } if (usuario.existe == ''){
            textoAlerta += "\n - Foto "; 
        } if (usuario.dni == ''){
            textoAlerta += "\n - DNI ";  
        } if (usuario.telefono == ''){
            textoAlerta += "\n - Telefono ";  
        }else if (usuario.telefono.length != 9 || isNaN(usuario.telefono)){
            textoAlerta += "\n - El teléfono debe contener 9 números ";  
        }
        alert (textoAlerta); 
    }

    return(
      <ScrollView style={styles.container}> 
      <View style={{justifyContent: 'center', margintop: 50 }}>
        
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
                placeholder="* Nombre de usuario"
                value = {usuario.usuario}
                onChangeText={(value) => handleChangeText('usuario', value)}
                />
            </View>
            <View 
            style={styles.inputGroup}> 
                <TextInput 
                style={styles.inputText}
                secureTextEntry={true}
                placeholder="* Contraseña"
                value = {usuario.contraseña}
                onChangeText={(value) => handleChangeText('contraseña', value)}
                />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Email"
                    value = {usuario.email}
                    onChangeText={(value) => handleChangeText('email', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Teléfono"
                    value = {usuario.telefono}
                    onChangeText={(value) => handleChangeText('telefono', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Nombre"
                    value = {usuario.nombre}
                    onChangeText={(value) => handleChangeText('nombre', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Apellidos"
                    value = {usuario.apellidos}
                    onChangeText={(value) => handleChangeText('apellidos', value)}
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
                    placeholder="* DNI"
                    value = {usuario.dni}
                    onChangeText={(value) => handleChangeText('dni', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Número de animales"
                    value = {usuario.n_animales}
                    onChangeText={(value) => handleChangeText('n_animales', value)}
                    />
            </View>
            <View style={{marginTop: 15, marginBottom: 70}}>

                <TouchableOpacity 
                            onPress={() => 
                              saveNewUsuario()
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
  }
})
export default ModificarUsuario;