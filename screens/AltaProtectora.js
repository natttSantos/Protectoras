import { style } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import React, {useEffect, useState} from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from '../database/firebase';

const AltaProtectora = (props) => {
    DropDownPicker.setListMode("SCROLLVIEW");

    const [mails, setMails] = useState([]);
    const [colore, setColor] = useState('black');

    useEffect(() => {
        firebase.db.collection('protectoras').onSnapshot((querySnapshot) => {
            const emails = []

            querySnapshot.docs.forEach((doc) => {
                const {email} = doc.data()
                emails.push({
                    email
                })
            });
            setMails(emails)
        });
    }, []);

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

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([{label: 'Comunidad Valenciana', value: 'Comunidad Valenciana'},
                        {label: 'Alicante', value: 'Alicante'},
                        {label: 'Cuenca', value: 'Cuenca'}])

    const handleChangeText = (nombre, value) => {
        setProtectora({...protectora, [nombre]: value});
    }

    const handleChangeTextDescripcion = (nombre, value) => {
        if(value.length == 15) {
            alert("¡Su descripción ya contiene los 200 caracteres permitidos!")
        } else {
            setProtectora({...protectora, [nombre]: value});
            if (value.length == 10)
                alert("¡Cuidado! Su descripción ya contiene 180 caracteres (max. 200)")
        }
    }

    const saveNewProtectora = async () => {
        if (protectora.nombre == '' || protectora.mail == '' || protectora.provincia == '' || protectora.url == '') {
            validateFields();
        } else if (validatePasswordAndPhone(protectora.contraseña, protectora.telefono)){
            let validation = true;
            mails.forEach(obj => {
                if(obj.email == protectora.email)
                    validation = false;
            })
            if(!validation)
                alert("El email introducido ya ha sido registrado, pruebe con otro");
            else {
                await firebase.db.collection('protectoras').add({
                    nombre: protectora.nombre,
                    email: protectora.email,
                    contraseña: protectora.contraseña,
                    direccion: protectora.direccion,
                    localizacion: protectora.localizacion,
                    url: protectora.url,
                    descripcion: protectora.descripcion,
                    telefono: protectora.telefono
                })
                alert("Bienvenido " + protectora.nombre)
            }
        }
    }

    const validateFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (protectora.nombre == ''){
            textoAlerta += "\n - Nombre de protectora"; 
        } if (protectora.email == ''){
            textoAlerta += "\n - Mail "; 
        } if (protectora.provincia == ''){
            textoAlerta += "\n - Provincia "; 
        } if (protectora.url == ''){
            textoAlerta += "\n - URL de tu web ";  
        } if (protectora.direcion == ''){
            textoAlerta += "\n - Direccion ";  
        }
        alert (textoAlerta); 
    }

    return(
        <ScrollView style={styles.container}> 
            <Text style={styles.title}> Protectora </Text>
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
                placeholder="Contraseña"
                onChangeText={(value) => handleChangeText('contraseña', value)}
                />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="Email"
                    onChangeText={(value) => handleChangeText('email', value)}
                    />
            </View>
            <View>
                <DropDownPicker
                                style={{marginTop: 15, marginBottom: 15}}
                                placeholder="Seleccione una localizacion"
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
                    placeholder="Dirección"
                    onChangeText={(value) => handleChangeText('direccion', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="URL de la página web"
                    onChangeText={(value) => handleChangeText('url', value)}
                    />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="Telefono"
                    onChangeText={(value) => handleChangeText('telefono', value)}
                    />
            </View>
            <View 
            style={styles.descripcion}>
                <TextInput                     
                    style={{fontSize: 17, color: colore}}
                    placeholder="Descripcion (max. 200 caracteres)"
                    onChangeText={(value) => handleChangeTextDescripcion('descripcion', value)}
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
export default AltaProtectora;