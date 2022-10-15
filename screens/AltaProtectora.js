import React, {useState} from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from '../database/firebase';

const AltaProtectora = () => {
    const [protectora, setProtectora] = useState({
        descripcion: "",
        mail: "",
        nombre: "",
        provincia: "",
        telefono: "",
        urlweb: ""
    })

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([{label: 'Comunidad Valenciana', value: 'Comunidad Valenciana'},
                        {label: 'Alicante', value: 'Alicante'},
                        {label: 'Cuenca', value: 'Cuenca'}])

    const handleChangeText = (nombre, value) => {
        setProtectora({...protectora, [nombre]: value});
    }

    const saveNewProtectora = async () => {
        if (protectora.nombre == '' || protectora.mail == '' || protectora.provincia == '' || protectora.urlweb == '') {
            validateFields();
        } else if (validatePhone(protectora.telefono)){
            await firebase.db.collection('protectoras').add({
                nombre: protectora.nombre,
                descripcion: protectora.descripcion,
                urlweb: protectora.urlweb,
                provincia: protectora.provincia,
                mail: protectora.mail,
                telefono: protectora.telefono
            })
            alert ("Bienvenid@ " + protectora.nombre); 
        }
    }

    const validateFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (protectora.nombre == ''){
            textoAlerta += "\n - Nombre de protectora"; 
        } if (protectora.mail == ''){
            textoAlerta += "\n - Mail "; 
        } if (protectora.provincia == ''){
            textoAlerta += "\n - Provincia "; 
        }
        if (protectora.urlweb == ''){
            textoAlerta += "\n - URL de tu web ";  
        }
        alert (textoAlerta); 
    }

    return(
        <View style={styles.container}> 
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
                    placeholder="Mail"
                    onChangeText={(value) => handleChangeText('mail', value)}
                    />
            </View>
            <View>
                <DropDownPicker
                                style={{marginTop: 15, marginBottom: 15}}
                                placeholder="Seleccione una provincia"
                                items={items}
                                setItems={setItems}
                                open={open}
                                setOpen={setOpen}
                                value={value}
                                setValue={setValue}
                                onChangeValue={(value) => {
                                    handleChangeText('provincia', value);
                                  }}
                            />
            </View>
            <View 
            style={styles.inputGroup}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="URL de la página web"
                    onChangeText={(value) => handleChangeText('urlweb', value)}
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
                    style={styles.inputText}
                    placeholder="Descripcion"
                    onChangeText={(value) => handleChangeText('descripcion', value)}
                    />
            </View>
            <View style={{marginTop: 15}}>
                <Button 
                title="Dar de alta" 
                onPress={() => {saveNewProtectora()}}/>
            </View>
        </View>
    )
}

function validatePhone (phone) {
    let validation = true; 
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