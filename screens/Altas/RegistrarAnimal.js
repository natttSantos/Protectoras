import React, {useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput,TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, CheckBox } from "react-native-elements";
import firebase from '../../database/firebase';
import DatePicker from 'react-native-modern-datepicker';
import * as ImagePicker from 'expo-image-picker';




const RegistrarAnimal = (props) => {

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
      id_protectora: "", 
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

    const [nivelOpen, setNivelOpen] = useState(false);
    const [nivelValue, setNivelValue] = useState(null);
    const [nivel, setNivel] = useState([
      { label: "Activo", value: "Activo" },
      { label: "Medio", value: "Medio" },
      { label: "Curioso", value: "Curioso" },
    ]);                

    const [vacunado, setVacunado] = useState(false)
    const [microChip, setMicroChip] = useState(false)

    const handleChangeText = (nombre, value) => {
        setState({...state, [nombre]: value}); 
    }; 
   
    const saveNewUser =  async () => {
      
        if (state.nombre == '' || state.raza == '' ||state.peso == ''|| state.edad == ''||state.descripcion == '' || foto.existe == ''|| state.tipo == '' || state.sexo =='' ||state.nivelActividad =='' || props.route.params.valueFecha == undefined){
            validateNullFields();  
        } else{ 
            click(); 
            await firebase.db.collection('animales').add({
                nombre: state.nombre, 
                tipo: state.tipo,
                raza: state.raza,
                sexo: state.sexo, 
                descripcion: state.descripcion,
                fecha_nacimiento: props.route.params.valueFecha,
                id_protectora: props.route.params.userId, 
                adoptado: false, 
                peso: state.peso, 
                edad: state.edad, 
                nivelActividad: state.nivelActividad, 
                vacunado: vacunado, 
                microchip: microChip
            })
            mensajeExito(); 
            props.navigation.navigate('SesionProtectora', {userId: props.route.params.userId}); 
        }
    } 
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
            textoAlerta += "\n - Nombre"; 
        } if (props.route.params.valueFecha == undefined){
          textoAlerta += "\n - Fecha Nacimiento "; 
        }
        if (state.raza == ''){
            textoAlerta += "\n - Raza "; 
        } 
        if (state.edad == ''){
          textoAlerta += "\n - Edad "; 
        }
        if (state.peso == ''){
          textoAlerta += "\n - Peso "; 
        }
        if (state.tipo == ''){
            textoAlerta += "\n - Tipo "; 
        }
        if (state.sexo == ''){
            textoAlerta += "\n - Sexo "; 
        }
        if (state.nivelActividad == ''){
          textoAlerta += "\n - Nivel Actividad "; 
      }
      if (state.descripcion == ''){
        textoAlerta += "\n - Descripción "; 
    }
        if (foto.existe == ''){
            textoAlerta += "\n - Foto "; 
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
  
    return(
        <ScrollView style={styles.container}> 
            <Text style={styles.title}> Registrar Animal</Text>
            <View style={styles.container}> 
                <TextInput 
                style={styles.inputGroup}
                placeholder="Nombre"
                onChangeText={(value) => handleChangeText('nombre', value)}
                />
            
              <Text style={{fontSize: 18, marginBottom: 10}}> {props.route.params.valueFecha}</Text>   
              <Button title="Seleccione una fecha Nacimiento" onPress={() => props.navigation.navigate('FechaNacimientoAnimal', {userId: props.route.params.userId})} />      
              <TextInput 
                    style={styles.inputGroup}
                    placeholder="Edad (en años)"
                    keyboardType="numeric"
                    onChangeText={(value) => handleChangeText('edad', value)}
                    />
              <TextInput 
                    style={styles.inputGroup}
                    placeholder="Peso (en kg)"
                    keyboardType="numeric"
                    onChangeText={(value) => handleChangeText('peso', value)}
                    />
              
              <TextInput 
                style={styles.inputGroup}
                placeholder="Raza"
                onChangeText={(value) => handleChangeText('raza', value)}
                />
                <DropDownPicker
                                style={{marginTop: 20, marginBottom: 25}}
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
            
            
            <DropDownPicker
                                style={{marginTop: 35, marginBottom: 20}}
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
                <TextInput 
                    style={styles.descripcion}
                    placeholder="Descripción (max 200 caracteres)"
                    onChangeText={(value) => handleChangeText('descripcion', value)}
                    />

                    
        <Button title="Selecciona una imagen" onPress={() =>  openGallery()} />      

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
      height: 3000
  },
   
  inputGroup: {
    height: 40,
    borderColor: "gray",
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 18,
    width: "100%",
    borderWidth: 1.5,
  },
  inputText: {
      fontSize: 15
  },
  title : {
      fontSize: 40,
      marginBottom: 15,
      fontWeight: "bold"
  },
  descripcion : {
      height: 100,
      borderColor: "gray",
      fontSize: 18,
      paddingLeft: 10,
      paddingRight: 10,
      borderWidth: 1.5,
      marginBottom: 20,
      marginTop: 10
  },button : {
    elevation: 8,
    backgroundColor: "#6c91c2",
    padding: 10,
    marginTop: 20,
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