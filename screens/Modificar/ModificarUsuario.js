import { style } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import React, {useEffect, useState} from "react";
import { ScrollView, View, Text, StyleSheet, TextInput,Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from "../../database/firebase";
import * as ImagePicker from 'expo-image-picker';

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
        foto:""
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
        setUsuario({...usuario, [nombre]: value});
    }

    const saveNewUsuario = async () => {
        console.log(usuario.nombre);
        

        if (usuario.apellidos == '' || usuario.contraseña == ''|| usuario.dni == '' || usuario.email == '' || usuario.localizacion == ""|| usuario.n_animales == ''|| protectora.nombre == ''|| protectora.usuario == '') {
            validateFields();
        } else  {

            const usuarioRef = firebase.db.collection("usuarios").doc(usuario.id);
            console.log(usuario.id);
            await usuarioRef.set({
                    nombre: usuario.nombre,
                    email: usuario.email,
                    contraseña: usuario.contraseña,
                    telefono: usuario.telefono,

                    nombre: usuario.nombre,
                    apellidos: usuario.apellidos,
                    localizacion: usuario.localizacion,
                    dni: usuario.dni,
                    n_animales: usuario.n_animales,
                    foto : usuario.foto
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
                .child(`imagesUsuario/${protectora.foto}`);
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
        const dbRef = firebase.db.collection("usuarios").doc(id);
        const doc = await dbRef.get();
        const usuario = doc.data();
        setUsuario({ ...usuario, id: doc.id });
        firebase
        .st
        .ref(`imagesUsuario/${usuario.foto}`)
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
              style={{ width: 300, height: 300 }}
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
            textoAlerta += "\n - Nombre de protectora"; 
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
        {checkImage()}
        <Button style={{position: 'fixed',  right: 0}} title="Selecciona una imagen" onPress={() =>  openGallery()} /> 
            <Text style={{marginTop: 15, color: 'darkred'}}> * Campo obligatorio </Text>
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
            <View>
                <DropDownPicker
                                style={{marginTop: 15, marginBottom: 15}}
                                placeholder="* Seleccione una localizacion"
                                items={items}
                                setItems={setItems}
                                open={open}
                                setOpen={setOpen}
                                value = {protectora.localizacion}
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
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="* Telefono"
                    value = {usuario.telefono}
                    onChangeText={(value) => handleChangeText('telefono', value)}
                    />
            </View>
            <View 
            style={styles.descripcion}>
                <TextInput                     
                    style={{fontSize: 17}}
                    placeholder="Descripcion (max. 200 caracteres)"
                    maxLength = {200}
                    multiline = {true}
                    value = {protectora.descripcion}
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

                <Button 
                title="Dar de alta" 
                onPress={() => {saveNewProtectora()}}/>
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
    }
})
export default ModificarProtectora;