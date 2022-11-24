import { style } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import React, {useEffect, useState} from "react";
import { ScrollView, View, Text, StyleSheet, TextInput,ActivityIndicator } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from '../../database/firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


//Bibliotecas colores CSS
import {colors} from '../../components/Color';
import { numberOfLines } from "deprecated-react-native-prop-types/DeprecatedTextInputPropTypes";
import { color } from "react-native-elements/dist/helpers";

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
    const [items, setItems] = useState([{label: 'Comunidad Valenciana', value: 'Comunidad Valenciana'},
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

            if(emailRepe)
                alert("El email introducido ya ha sido registrado, pruebe con otro");
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
                alert("Bienvenido " + protectora.nombre)
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
    }else{alert ("Primero debe introducir el nombre de la protectora y el número de teléfono");}
      };

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
        alert (textoAlerta); 
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
        <ScrollView style={styles.container}> 
            <Text style={styles.titulo}> Da de alta tu protectora </Text>
            <Text style={{marginTop: 15, color: 'darkred'}}> * Campo obligatorio </Text>
            <View 
            style={styles.inputGroup}> 
                <TextInput 
                style={styles.inputText}
                placeholder="* Nombre"
                placeholderTextColor={colors.moradoSecundario}
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
                onChangeText={(value) => handleChangeText('contraseña', value)}
                />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Email"
                    placeholderTextColor={colors.moradoSecundario}
                    onChangeText={(value) => handleChangeText('email', value)}
                    />
            </View>
            <View>
                <DropDownPicker
                                style={{marginTop: 15, marginBottom: 15}}
                                placeholder="* Seleccione una localizacion"
                                items={items}
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
                    onChangeText={(value) => handleChangeText('direccion', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* URL de la página web"
                    placeholderTextColor={colors.moradoSecundario}
                    onChangeText={(value) => handleChangeText('url', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Telefono"
                    placeholderTextColor={colors.moradoSecundario}
                    onChangeText={(value) => handleChangeText('telefono', value)}
                    />
            </View>
            <View 
            style={styles.descripcion}>
                <TextInput                     
                    style={{fontSize: 17}}
                    placeholder="Descripcion (max. 200 caracteres)"
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
            <View style={{marginTop: 15}}>
            <Button title="Selecciona una imagen" onPress={() =>  openGallery()} /> 
                <Button 
                title="Dar de alta" 
                onPress={() => {saveNewProtectora()}}/>
            </View>
        </ScrollView>
    )
  }
}

function validatePasswordAndPhone (password, phone) {
    let validation = true; 
    if (password.length < 4 || password.length > 8){
        alert("La contraseña debe tener entre 4-8 caracteres"); 
        validation = false; 
    }
    if (phone.length  != 9){
        alert("El número de teléfono debe tener 9 dígitos"); 
        validation = false; 
    }
    return validation;
  }

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35,
        backgroundColor: colors.blanco,
        marginTop: 50
    },
    inputGroup: {
        fontSize: 20, 
        padding: 0,
        marginBottom: 10,
        marginTop: 10, 
        borderBottomWidth: 2, 
        borderBottomColor: '#cccccc',
    }, 
    inputText: {
        fontSize: 17,
        
    },
    titulo : {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.moradoPrincipal,
        fontFamily: 'DMSans',
        marginBottom: 10,
        multiline: true

        
    },
    descripcion : {
        height: 100,
        borderWidth: 2,
        borderColor: '#cccccc'
    }
})
export default AltaProtectora;