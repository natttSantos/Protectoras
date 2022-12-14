import React, {useEffect, useState, useContext } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from '../../database/firebase';
import { CredentialsContext } from "../../components/CredentialsContext";
import * as ImagePicker from 'expo-image-picker';


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
        props.navigation.navigate('SesionUsuario', {userId: usuario.id})
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
        alert (textoAlerta); 
    }

    return(
        <ScrollView style={styles.container}> 
        
            <Text style={styles.title}> Crear Perfil Adoptar </Text>
            <View 
            style={styles.inputGroup}> 
                <TextInput 
                style={styles.inputText}
                placeholder="Nombre"
                onChangeText={(value) => handleChangeText('nombre', value)}
                
                />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                
                    style={styles.inputText}
                    placeholder="Apellidos"
                    onChangeText={(value) => handleChangeText('apellidos', value)}
                    />
            </View>
            <View>
                <DropDownPicker
                                style={{marginTop: 15, marginBottom: 15}}
                                placeholder="Seleccione una localidad"
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
                    placeholder="DNI"
                    onChangeText={(value) => handleChangeText('dni', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="Número de animales"
                    onChangeText={(value) => handleChangeText('n_animales', value)}
                    />
            </View>
            <Button style={{position: 'fixed',  right: 0}} title="Selecciona una imagen" onPress={() =>  openGallery()} /> 
            <View style={{marginTop: 15}}>
                <Button 
                title="Dar de alta" 
                onPress={() => {updateUsuario();
                     }}/>
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
export default AltaAdoptar;