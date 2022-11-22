import React, {useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput,TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, CheckBox } from "react-native-elements";
import firebase from '../../database/firebase';
import DatePicker from 'react-native-modern-datepicker';
import * as ImagePicker from 'expo-image-picker';




const RegistrarAnimalPropietario = (props) => {

  const [foto, setFoto] = useState({
    existe:"",
    
  });
    const [state, setState] = useState({
      nombre:"",
      tipo:"",
      raza:"",
      sexo:"",
      descripcion:"",
      foto:"",
      fecha_nacimiento: "", 
      id_propietario: "", 
      adoptado: "", 
      peso: "", 
      edad: "", 
      nivelActividad: "", 
      vacunado: "", 
      microchip: ""
      
    });
    const drop = DropDownPicker.setListMode("SCROLLVIEW");
   
    const [chosenDate, setChosenDate] = useState('');

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
    
    const [usuario, setUsuario] = useState();
    const [nivelOpen, setNivelOpen] = useState(false);
    const [nivelValue, setNivelValue] = useState(null);
    const [nivel, setNivel] = useState([
      { label: "Activo", value: "Activo" },
      { label: "Medio", value: "Medio" },
      { label: "Tranquilo", value: "Tranquilo" },
    ]);                

    const [vacunado, setVacunado] = useState(false)
    const [microChip, setMicroChip] = useState(false)
       

    const handleChangeText = (nombre, value) => {
        setState({...state, [nombre]: value}); 
    }; 
    

    useEffect(() => {
      getUsuarioById(props.route.params.userId);
    }, [usuario]);

    const saveNewUser =  async () => {
      
        if (state.nombre == '' || state.raza == '' || state.descripcion == '' || foto.existe == ''|| state.tipo == '' || state.sexo =='' || props.route.params.valueFecha == undefined){
            validateNullFields(); 
        } else{ 
            await firebase.db.collection('animales').add({
                nombre: state.nombre, 
                tipo: state.tipo,
                raza: state.raza,
                sexo: state.sexo, 
                descripcion: state.descripcion,
                fecha_nacimiento: props.route.params.valueFecha,
                id_propietario: props.route.params.userId, 
                adoptado: false,
                peso: state.peso, 
                edad: state.edad, 
                nivelActividad: state.nivelActividad, 
                vacunado: vacunado, 
                microchip: microChip,
            })
            mensajeExito(); 
            props.navigation.navigate('SesionUsuario', {userId: props.route.params.userId}); 
        }
    } 

    const getUsuarioById = async (id) => {
      const dbRef = firebase.db.collection("users").doc(id);
      const doc = await dbRef.get();
      const usuario = doc.data();
      setUsuario({ ...usuario, id: doc.id });
    };

    const mensajeExito = () =>{
        if(state.sexo == "Masculino"){
            alert (state.nombre + " ha sido registrado!");     
        } else{
            alert (state.nombre + " ha sido registrada!"); 
        }
    }
    const validateNullFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (state.nombre == ''){
            textoAlerta += "\n - Nombre de animal"; 
        } if (state.raza == ''){
            textoAlerta += "\n - Raza "; 
        } if (state.descripcion == ''){
            textoAlerta += "\n - Descripción "; 
        }
        if (state.tipo == ''){
            textoAlerta += "\n - Tipo "; 
        }
        if (state.sexo == ''){
            textoAlerta += "\n - Sexo "; 
        }
        if (foto.existe == ''){
            textoAlerta += "\n - Foto "; 
        }
        if (props.route.params.valueFecha == undefined){
          textoAlerta += "\n - Fecha Nacimiento "; 
      }
        alert (textoAlerta); 
    }


    const showPicker = () => {
      this.setState({
        isVisible: true  
      })
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
                .child(`images/${state.nombre}`);
                ref
                  .put(resolve)
                  .then(resolve => {
                    console.log("Imagen subida correctamente");
                    setFoto({
                        existe: "Si"
                     });
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
    
      const [date, setDate] = useState(new Date());
      const [fechaFormato, setFechaFormato] = useState('');
     

    return(
        <ScrollView style={styles.container}> 
            <Text style={styles.title}> Registrar Animal</Text>
            <View style={styles.container}> 
                <TextInput 
                style={styles.inputs}
                placeholder="* Nombre"
                onChangeText={(value) => handleChangeText('nombre', value)}
                />
            
              <Text style={{fontSize: 18, marginBottom: 10}}> {props.route.params.valueFecha}</Text>   
              <Button title="* Seleccione una fecha Nacimiento" onPress={() => props.navigation.navigate('FechaNacimientoAnimal', {userId: props.route.params.userId, esProtectora: "No"})} />      
              <TextInput 
                    style={styles.inputs}
                    placeholder="Edad (en años)"
                    onChangeText={(value) => handleChangeText('edad', value)}
                    />
              <TextInput 
                    style={styles.inputs}
                    placeholder="Peso (en kg)"
                    onChangeText={(value) => handleChangeText('peso', value)}
                    />
              
              <DropDownPicker
                                style={{marginTop: 20, marginBottom: 30}}
                                placeholder="* Tipo"
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
                    placeholder="* Raza"
                    onChangeText={(value) => handleChangeText('raza', value)}
                    />
            
            <DropDownPicker
                                style={{marginTop: 10, marginBottom: 15}}
                                placeholder="* Sexo"
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
                <CheckBox
                  title="Vacunado"
                  checked={vacunado}
                  checkedColor="blue"
                  onPress={() => setVacunado(!vacunado)}           
                />
                <CheckBox
                  title="MicroChip"
                  checked={microChip}
                  checkedColor="blue"
                  onPress={() => setMicroChip(!microChip)}
                />
                 <DropDownPicker
                                style={{marginTop: 35, marginBottom: 15}}
                                placeholder="Nivel Actividad"
                                items={nivel}
                                setItems={setNivel}
                                open={nivelOpen}
                                setOpen={setNivelOpen}
                                value={nivelValue}
                                setValue={setNivelValue}
                                onChangeValue={(value) => {
                                    handleChangeText('nivelActividad', value);
                                  }}
                            />
                
                <TextInput 
                    style={styles.descripcion}
                    placeholder="* Descripción (max 200 caracteres)"
                    onChangeText={(value) => handleChangeText('descripcion', value)}
                    />

        <Button title="* Selecciona una imagen" onPress={() =>  openGallery()} />      

                <TouchableOpacity 
                    onPress={() => {saveNewUser()}}
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
      flex: 2, 
      padding: 35, 
      height: 1150
    },
    descripcion : {
        height: 60, 
        marginTop: 30,
        marginBottom: 30,
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
        marginTop: 40,
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
export default RegistrarAnimalPropietario;