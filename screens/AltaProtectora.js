import React, {useEffect, useState} from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from '../database/firebase';

const AltaProtectora = () => {
    DropDownPicker.setListMode("SCROLLVIEW");

    const [mails, setMails] = useState([]);

    useEffect(() => {
        firebase.db.collection('protectoras').onSnapshot((querySnapshot) => {
            const mails = []

            querySnapshot.docs.forEach((doc) => {
                const {mail} = doc.data()
                mails.push({
                    mail
                })
            });
            setMails(mails)
        });
    }, []);

    const [protectora, setProtectora] = useState({
        descripcion: "",
        mail: "",
        nombre: "",
        localidad: "",
        direccion: "",
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
            const dbRef = await firebase.db.collection('protectoras')
            console.log(mails)
            let validation = true;
            mails.forEach(obj => {
                if(obj.mail == protectora.mail)
                    validation = false;
            })

            if(!validation)
                console.log("Repe");
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
        } if (protectora.urlweb == ''){
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
                    placeholder="Mail"
                    onChangeText={(value) => handleChangeText('mail', value)}
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
                                    handleChangeText('localidad', value);
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
        </ScrollView>
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