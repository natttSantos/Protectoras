import React, {useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput,TouchableOpacity, Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, CheckBox } from "react-native-elements";
import firebase from '../../database/firebase';
import DatePicker from 'react-native-modern-datepicker';
import * as ImagePicker from 'expo-image-picker';

import { colors } from '../../components/Color';
import { style } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";


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
    const [protectora, setProtectora] = useState();
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
      getProtectoraById(props.route.params.userId);
    }, [protectora]);

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
                id_protectora: props.route.params.userId, 
                adoptado: false,
                peso: state.peso, 
                edad: state.edad, 
                nivelActividad: state.nivelActividad, 
                vacunado: vacunado, 
                microchip: microChip,
                latitud: protectora.latitud,
                longitud: protectora.longitud,
            })
            mensajeExito(); 
            props.navigation.navigate('SesionProtectora', {userId: props.route.params.userId}); 
        }
    } 

    const getProtectoraById = async (id) => {
      const dbRef = firebase.db.collection("protectoras").doc(id);
      const doc = await dbRef.get();
      const protectora = doc.data();
      setProtectora({ ...protectora, id: doc.id });
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
      <ScrollView style={styles.container} contentContainerStyle={{justifyContent: 'space-evenly'}}> 
          <Text style={styles.titulo}> Registrar Animal</Text>
          <TextInput 
            style={styles.textField}
            placeholder="* Nombre"
            placeholderTextColor={colors.moradoSecundario}
            onChangeText={(value) => handleChangeText('nombre', value)}
          />
          <View style={styles.botonesHorizontales}>
            <View>
              <Text style={styles.caracteristicas}> Gato </Text>
              <TouchableOpacity style={styles.botonPropiedades}>
                  <Image
                    source={require('../../images/Gato.png')}
                    style={styles.image}
                  />
                </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.caracteristicas}> Perro </Text>
              <TouchableOpacity style={styles.botonPropiedades}>
                <Image
                  source={require('../../images/Perro.png')}
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => props.navigation.navigate('FechaNacimientoAnimal', {userId: props.route.params.userId, esProtectora: "No"})}
            style={styles.fechaNacimiento}>
            <View style={styles.botonFechaNacimiento}>
              <Text style={styles.texto}> * Fecha de nacimiento </Text>
              <Image
                source={require('../../images/Calendario.png')}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>   
          <TextInput 
            style={styles.textField}
            placeholder="Edad (en años)"
            placeholderTextColor={colors.moradoSecundario}
            onChangeText={(value) => handleChangeText('edad', value)}
          />
          <TextInput 
            style={styles.textField}
            placeholder="Peso (en kg)"
            placeholderTextColor={colors.moradoSecundario}
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
            style={styles.textField}
            placeholder="* Raza"
            placeholderTextColor={colors.moradoSecundario}
            onChangeText={(value) => handleChangeText('raza', value)}
          />
          <View style={styles.botonesHorizontales}>
            <View>
              <Text style={styles.caracteristicas}> Macho </Text>
              <TouchableOpacity style={styles.botonPropiedades}>
                  <Image
                    source={require('../../images/Macho.png')}
                    style={styles.image}
                  />
                </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.caracteristicas}> Hembra </Text>
              <TouchableOpacity style={styles.botonPropiedades}>
                <Image
                  source={require('../../images/Hembra.png')}
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
          </View>
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
      </ScrollView>
    )
}

const styles = StyleSheet.create({
    container : {
      flex: 1, 
      padding: 35,
      backgroundColor: colors.blanco
    },
    textField: {
      marginTop: 20,
      borderWidth: 1,
      borderBottomColor: colors.moradoPrincipal,
      borderRightColor: colors.blanco,
      borderLeftColor: colors.blanco,
      borderTopColor: colors.blanco,
      fontSize: 16,
      color: colors.moradoPrincipal,
      fontFamily: 'InterRegular'
    },
    texto: {
      fontFamily: 'InterRegular',
      color: colors.moradoSecundario,
      fontSize: 16
    },
    botonesHorizontales : {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    botonPropiedades: {
      width: 63,
      height: 38,
      borderRadius: 19,
      borderColor: colors.amarillo,
      backgroundColor: colors.blanco,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center'
    },
    botonFechaNacimiento: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginLeft: 5,
      marginRight: 15
    },
    fechaNacimiento: {
      marginTop: 20,
      height: 49,
      borderRadius: 24.5,
      borderColor: colors.moradoPrincipal,
      borderWidth: 1,
      justifyContent: 'center'
    },
    image: {
      width: 22,
      height: 22
    },
    caracteristicas: {
      fontFamily: 'InterRegular',
      color: colors.amarillo,
      alignSelf: 'center'
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
    }, 
    titulo : {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
        color: colors.moradoPrincipal,
        fontFamily: "DMSans"
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
export default RegistrarAnimal;