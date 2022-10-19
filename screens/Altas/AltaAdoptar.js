import React, {useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from '../../database/firebase';


const AltaAdoptar = (props) => {
    const initialState = {
      nombre:"",
      apellidos:"",
      localizacion:"",
      dni:"",
      n_animales:"",
      
    };
    const drop = DropDownPicker.setListMode("SCROLLVIEW");

    useEffect(() => {
        getUsuarioById(props.route.params.userId);
      }, []);

      const getUsuarioById = async (id) => {
        const dbRef = firebase.db.collection("users").doc(id);
        const doc = await dbRef.get();
        const usuario = doc.data();
        setUsuario({ ...usuario, id: doc.id });
        setLoading(false);
      };

    const [usuario, setUsuario] = useState(initialState);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([{label: 'Comunidad Valenciana', value: 'Comunidad Valenciana'},
                        {label: 'Alicante', value: 'Alicante'},
                        {label: 'Cuenca', value: 'Cuenca'}])

    const handleChangeText = (nombre, value) => {
        setUsuario({...usuario, [nombre]: value});
    }

    const updateUsuario = async () => {
        if (usuario.nombre == '' || usuario.apellidos == '' || usuario.localizacion == '' || usuario.dni == ''|| usuario.n_animales == '') {
            validateFields();
        } else{
        const usuarioRef = firebase.db.collection("users").doc(usuario.id);
        console.log(usuario.id);
        await usuarioRef.set({
          alta : "Si",  
          nombre : usuario.nombre,
          apellidos : usuario.apellidos,
          dni : usuario.dni,
          localizacion : usuario.localizacion,
          n_animales : usuario.n_animales,
          email : usuario.email,
          contraseña: usuario.contraseña,
          usuario: usuario.usuario,
          telefono: usuario.telefono,
        });
        setUsuario(initialState);}
      };

    const validateFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (usuario.nombre == ''){
            textoAlerta += "\n - Nombre "; 
        } if (usuario.apellidos == ''){
            textoAlerta += "\n - Apellidos ";  
        } if (usuario.dni == ''){
            textoAlerta += "\n - DNI "; 
        } if (usuario.localizacion == ''){
            textoAlerta += "\n - Localización ";  
        } if (usuario.n_animales == ''){
            textoAlerta += "\n - Número de animales ";  
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
            <View style={{marginTop: 15}}>
                <Button 
                title="Dar de alta" 
                onPress={() => {updateUsuario();
                    props.navigation.navigate('PerfilUsuario', {
                        userId: usuario.id,
                      }); }}/>
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