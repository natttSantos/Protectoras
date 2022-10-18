import React, {useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput,TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import firebase from '../database/firebase';


const RegistrarAnimal = (props) => {
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

    const [sexoOpen, setSexoOpen] = useState(false);
    const [sexoValue, setSexoValue] = useState(null);
    const [sexo, setSexo] = useState([
      { label: "Masculino", value: "Masculino" },
      { label: "Femenino", value: "Femenino" },
    ]);

    const [tipoOpen, setTipoOpen] = useState(false);
    const [tipoValue, setTipoValue] = useState(null);
    const [tipo, setTipo] = useState([
      { label: "Perro", value: "Perro" },
      { label: "Gato", value: "Gato" },
    ]);

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([{label: 'Perro', value: 'Perro'},
                        {label: 'Gato', value: 'Gato'}])
                     

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
            <Text style={styles.title}> Registrar Animal</Text>
            <View> 
                <TextInput 
                style={{
                    height: 40,
                    borderColor: "black",
                    marginTop: 40,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontSize: 18,
                    width: "100%",
                    borderWidth: 1,
                }}
                placeholder="Nombre"
                onChangeText={(value) => handleChangeText('nombre', value)}
                />
            
                <DropDownPicker
                                style={{marginTop: 20, marginBottom: 20}}
                                placeholder="Tipo"
                                items={tipo}
                                setItems={setTipo}
                                open={tipoOpen}
                                setOpen={setTipoOpen}
                                value={tipoValue}
                                setValue={setTipoValue}
                                onChangeValue={(value) => {
                                    handleChangeText('tipo', value);
                                  }}
                            />
            
                <TextInput 
                    style={styles.inputs}
                    placeholder="Raza"
                    onChangeText={(value) => handleChangeText('raza', value)}
                    />
            
            <DropDownPicker
                                style={{marginTop: 10, marginBottom: 15}}
                                placeholder="Sexo"
                                items={sexo}
                                setItems={setSexo}
                                open={sexoOpen}
                                setOpen={setSexoOpen}
                                value={sexoValue}
                                setValue={setSexoValue}
                                onChangeValue={(value) => {
                                    handleChangeText('sexo', value);
                                  }}
                            />
            
                <TextInput 
                    style={styles.inputs}
                    placeholder="Insertar foto"
                    onChangeText={(value) => handleChangeText('dni', value)}
                    />
            
                <TextInput 
                    style={styles.descripcion}
                    placeholder="Descripción (max 200 caracteres)"
                    onChangeText={(value) => handleChangeText('n_animales', value)}
                    />

                <TouchableOpacity 
                    onPress={() => {updateUsuario()}}
                    style={styles.button}>
                        <Text style={styles.buttonText}>
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
        padding: 35
    },
    descripcion : {
        height: 100, 
        marginBottom: 40,
        fontSize: 18,
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: 'black'
    }, title : {
        fontSize: 40,
        fontWeight: "bold"
    },
    inputs : {
        height: 40,
        borderColor: "black",
        marginTop: 10,
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,  
        width: "100%",
        borderWidth: 1
    }, 
    button : {
        elevation: 8,
        backgroundColor: "#6c91c2",
        padding: 10
      },
      buttonText: {
        fontSize: 18,
        colors: "#ffffff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"    
      }
})
export default RegistrarAnimal;