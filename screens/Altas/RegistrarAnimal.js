import React, {useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput,TouchableOpacity, Image, Modal } from "react-native";
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
      handleFecha();
    }, [protectora]);

    const saveNewUser =  async () => {
      
        if (state.nombre == '' || state.raza == '' || state.descripcion == '' || foto.existe == ''|| state.edad == '' || state.tipo == '' || state.sexo =='' || props.route.params.valueFecha == undefined){
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
            setModal({...modalFoto, visible: !modalFoto.visible, correct: true});
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
            setTextoAlerta(state.nombre + " ha sido registrado!");     
        } else{
            setTextoAlerta(state.nombre + " ha sido registrada!"); 
        }
    }

    const cerrarAlerta = () => {
      setModal({...modal, visible: !modal.visible})
      props.navigation.navigate('SesionProtectora', {userId: props.route.params.userId});
    }
    const validateNullFields = () => {
        let textoAlerta = "Complete el campo: ";
        if (state.nombre == ''){
            textoAlerta += "\n - Nombre de animal"; 
        }
        if (state.tipo == ''){
          textoAlerta += "\n - Tipo "; 
        } 
        if (props.route.params.valueFecha == undefined){
          textoAlerta += "\n - Fecha Nacimiento "; 
        }
        if (state.edad == ''){
          textoAlerta += "\n - Edad ";
        }
        if (state.raza == ''){
            textoAlerta += "\n - Raza "; 
        } if (state.descripcion == ''){
            textoAlerta += "\n - Descripción "; 
        }
        if (state.sexo == ''){
            textoAlerta += "\n - Sexo "; 
        }
        if (foto.existe == ''){
            textoAlerta += "\n - Foto "; 
        }
        
      setTextoAlerta(textoAlerta);
      setModal({...modal, visible: !modal.visible, correct: false});
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
                    setTextoAlertaFoto("Imagen subida correctamente");
                    setFoto({
                        existe: "Si"
                     });
                  })
                  .catch(error => {
                    console.log(error);
                    console.log(error);
                    console.log("Error al subir la imagen");
                    setTextoAlertaFoto("Error al subir la imagen");
                  });
              })
              .catch(error => {
                console.log(error);
              });
              setmodalFoto({...modalFoto, visible: !modalFoto.visible});
          }
        }
      };
    
      const [date, setDate] = useState(new Date());
      const [fechaFormato, setFechaFormato] = useState('');
      const [isPressGato, setIsPressGato] = useState(false);
      const [isPressPerro, setIsPressPerro] = useState(false);
      const [isPressMacho, setIsPressMacho] = useState(false);
      const [isPressHembra, setIsPressHembra] = useState(false);
      const [fecha, setFecha] = useState("* Fecha de nacimiento");
      const [modalFoto, setmodalFoto] = useState({ visible: false });
      const [modal, setModal] = useState({ visible: false, correct: false });
      const [textoAlertaFoto, setTextoAlertaFoto] = useState();
      const [textoAlerta, setTextoAlerta] = useState();

      function handleTipo(value) {
        if (value == "Gato") {
          setIsPressGato(true);
          setIsPressPerro(false);
        }
        else if (value == "Perro") {
          setIsPressGato(false);
          setIsPressPerro(true);
        }
        setState({...state, ["tipo"]: value});
      }

      function handleSexo(value) {
        if (value == "Masculino") {
          setIsPressMacho(true);
          setIsPressHembra(false);
        }
        else if (value == "Femenino") {
          setIsPressMacho(false);
          setIsPressHembra(true);
        }
        setState({...state, ["sexo"]: value});
      }

      function handleFecha() {
        if (props.route.params.valueFecha != undefined) {
          setFecha(props.route.params.valueFecha);
        }
      }

    return(
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalFoto.visible}
          onRequestClose={() => {
              setmodalFoto({...modalFoto, visible: !modalFoto.visible});
          }}>
          <View style={styles.centeredView}>
              <View style={styles.modalViewFoto}>
                  <View style={{flex: 4}}>
                      <Text style={styles.textoAlerta}> {textoAlertaFoto} </Text>
                  </View>
                  <View style={styles.buttonGroup}>
                      <TouchableOpacity
                      onPress={() => setmodalFoto({...modalFoto, visible: !modalFoto.visible})}>
                          <View style={styles.botonCerrar}>
                              <Text style={styles.textoAlerta}>cerrar</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal.visible}
          onRequestClose={() => {
              setModal({...modal, visible: !modal.visible});
          }}>
          <View style={styles.centeredView}>
              <View style={modal.correct ? styles.modalViewFoto : styles.modalView}>
                  <View style={{flex: 4}}>
                      <Text style={styles.textoAlerta}> {textoAlerta} </Text>
                  </View>
                  <View style={styles.buttonGroup}>
                      <TouchableOpacity
                      onPress={modal.correct ? () => cerrarAlerta() : () => setModal({...modal, visible: !modal.visible})}>
                          <View style={styles.botonCerrar}>
                              <Text style={styles.textoAlerta}>cerrar</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
        </Modal>
        <ScrollView contentContainerStyle={{justifyContent: 'space-around'}}> 
            <Text style={styles.titulo}> Registrar Animal</Text>
            <TextInput 
              style={styles.textField}
              placeholder="* Nombre"
              placeholderTextColor={colors.moradoSecundario}
              onChangeText={(value) => handleChangeText('nombre', value)}
            />
            <View style={styles.botonesHorizontales}>
              <View>
                <Text style={ isPressPerro ? styles.caracteristicasSeleccionada : styles.caracteristicas }> Gato </Text>
                <TouchableOpacity 
                  style={ isPressGato ? styles.botonPropiedadesSeleccionado : styles.botonPropiedades }
                  onPress={() => handleTipo("Gato")}>
                    <Image
                      source={ isPressGato ? require('../../images/GatoSeleccionado.png') : require("../../images/Gato.png")}
                      style={ isPressPerro ? styles.imageSeleccionada : styles.image }
                    />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={ isPressGato ? styles.caracteristicasSeleccionada : styles.caracteristicas }> Perro </Text>
                <TouchableOpacity
                   style={ isPressPerro ? styles.botonPropiedadesSeleccionado : styles.botonPropiedades }
                   onPress={() => handleTipo("Perro")}>
                    <Image
                      source={ isPressPerro ? require('../../images/PerroSeleccionado.png') : require("../../images/Perro.png")}
                      style={ isPressGato ? styles.imageSeleccionada : styles.image}
                    />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => props.navigation.navigate('FechaNacimientoAnimal', {userId: props.route.params.userId, esProtectora: "No"})}
              style={styles.fechaNacimiento}>
              <View style={styles.botonFechaNacimiento}>
                <Text style={fecha != "* Fecha de nacimiento" ? styles.textoFecha : styles.texto}> {fecha} </Text>
                <Image
                  source={require('../../images/Calendario.png')}
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>   
            <TextInput 
              style={styles.textField}
              placeholder="* Edad (en años)"
              placeholderTextColor={colors.moradoSecundario}
              onChangeText={(value) => handleChangeText('edad', value)}
            />
            <TextInput 
              style={styles.textField}
              placeholder="Peso (en kg)"
              placeholderTextColor={colors.moradoSecundario}
              onChangeText={(value) => handleChangeText('peso', value)}
            />
            <TextInput 
              style={styles.textField}
              placeholder="* Raza"
              placeholderTextColor={colors.moradoSecundario}
              onChangeText={(value) => handleChangeText('raza', value)}
            />
            <View style={styles.botonesHorizontales}>
              <View>
                <Text style={ isPressHembra ? styles.caracteristicasSeleccionada : styles.caracteristicas }> Macho </Text>
                <TouchableOpacity
                  style={ isPressMacho ? styles.botonPropiedadesSeleccionado : styles.botonPropiedades }
                  onPress={() => handleSexo("Masculino")}>
                    <Image
                      source={ isPressMacho ? require('../../images/MachoSeleccionado.png') : require('../../images/Macho.png') }
                      style={ isPressHembra ? styles.imageSeleccionada : styles.image}
                    />
                  </TouchableOpacity>
              </View>
              <View>
                <Text style={ isPressMacho ? styles.caracteristicasSeleccionada : styles.caracteristicas }> Hembra </Text>
                <TouchableOpacity 
                  style={ isPressHembra ? styles.botonPropiedadesSeleccionado : styles.botonPropiedades }
                  onPress={() => handleSexo("Femenino")}>
                    <Image
                      source={ isPressHembra ? require('../../images/HembraSeleccionado.png') : require('../../images/Hembra.png') }
                      style={ isPressMacho ? styles.imageHembraSeleccionada : styles.imageHembra }
                    />
                </TouchableOpacity>
              </View>
            </View>
            <DropDownPicker
              style={styles.dropDownPicker}
              placeholder="Nivel Actividad"
              placeholderStyle={{
                color: colors.moradoSecundario
              }}
              items={nivel}
              listItemLabelStyle={{
                color: colors.moradoSecundario
              }}
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
              checkedColor={colors.moradoPrincipal}
              uncheckedColor={colors.moradoSecundario}
              onPress={() => setVacunado(!vacunado)}           
            />
            <CheckBox
              title="MicroChip"
              checked={microChip}
              checkedColor={colors.moradoPrincipal}
              uncheckedColor={colors.moradoSecundario}
              onPress={() => setMicroChip(!microChip)}
            />
            <TextInput 
              style={styles.descripcion}
              placeholder="* Descripción (max 200 caracteres)"
              placeholderTextColor={colors.moradoSecundario}
              multiline={true}
              maxLength={200}
              onChangeText={(value) => {
                if (value.length == 180)
                    alert("¡Cuidado! Su descripción ya contiene 180 caracteres (max. 200)")
                if (value.length == 200)
                    alert("¡Su descripción ya contiene los 200 caracteres permitidos!")
                handleChangeText('descripcion', value)
              }}
            />
            <TouchableOpacity 
              onPress={() => 
                openGallery()
              }
              style={styles.botonCircularBlancoMorado}>
                <Text style={styles.botonTextoMorado}>
                    Añadir imagen de perfil
                </Text>
            </TouchableOpacity>   
            <TouchableOpacity 
                    onPress={() => {saveNewUser()}}
                    style={styles.botonCircularAmarillo}>
                        <Text style={styles.botonTextoAmarillo}>
                            Dar de alta
                        </Text>
            </TouchableOpacity>
        </ScrollView>
      </View>
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
    botonPropiedadesSeleccionado: {
      width: 63,
      height: 38,
      borderRadius: 19,
      borderColor: colors.amarillo,
      backgroundColor: colors.amarillo,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center'
    },
    dropDownPicker : {
      marginTop: 30,
      marginBottom: 30,
      borderRadius: 25,
      borderColor: colors.moradoPrincipal,
      borderWidth: 2,
      fontStyle : {
          color: colors.amarillo
      }
    },
    checkBox: {
      marginTop: 30,
      borderColor: colors.moradoPrincipal,
      borderRadius: 25
    },
    botonFechaNacimiento: {
      flexDirection: 'row',
      marginLeft: 25
    },
    fechaNacimiento: {
      marginTop: 20,
      height: 49,
      borderRadius: 24.5,
      borderColor: colors.moradoPrincipal,
      borderWidth: 1,
      justifyContent: 'center'
    },
    textoFecha: {
      fontFamily: 'InterRegular',
      color: colors.moradoPrincipal,
      fontSize: 16,
      marginRight: 100
    },
    botonCircularBlancoMorado : {
      backgroundColor: colors.blanco,
      borderColor: colors.moradoPrincipal,
      borderWidth: 2,
      width:260,
      height:50,
      borderRadius: 25,
      alignSelf: "center",
      marginBottom: 20
    },
    botonTextoMorado: {
      fontSize: 20,
      color: colors.moradoPrincipal,
      alignSelf: "center",
      marginTop: 5
    },
    botonCircularAmarillo : {
      backgroundColor: colors.amarillo,
      borderColor: colors.blanco,
      borderWidth: 2,
      width:260,
      height:50,
      borderRadius: 25,
      alignSelf: "center"
    },
    botonTextoAmarillo: {
      fontSize: 20,
      color: colors.blanco,
      fontWeight: "bold",
      alignSelf: "center",
      marginTop: 5
    },
    image: {
      flex: 1,
      width: 22,
      height: 22,
      resizeMode: 'contain'
    },
    imageSeleccionada: {
      flex: 1,
      width: 22,
      height: 22,
      resizeMode: 'contain',
      opacity: 0.5
    },
    imageHembra: {
      flex: 1,
      resizeMode: 'contain',
      width: 16,
      height: 20
    },
    imageHembraSeleccionada: {
      flex: 1,
      resizeMode: 'contain',
      width: 16,
      height: 20,
      opacity: 0.5
    },
    caracteristicas: {
      fontFamily: 'InterRegular',
      color: colors.amarillo,
      alignSelf: 'center'
    },
    caracteristicasSeleccionada : {
      fontFamily: 'InterRegular',
      color: colors.amarillo,
      alignSelf: 'center',
      opacity: 0.5
    },
    descripcion : {
        height: 120,
        marginTop: 30,
        marginBottom: 30,
        fontSize: 16,
        borderWidth: 2,
        padding: 10,
        borderColor: colors.moradoPrincipal,
        borderRadius: 15,
        color: colors.moradoPrincipal,
        multiline: true,
        fontFamily: 'InterRegular',
        textAlignVertical: 'top'
    }, 
    titulo : {
        fontFamily: "DMSans",
        fontSize: 32,
        color: colors.moradoPrincipal,
        marginTop: 40
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalViewFoto: {
      margin: 10,
      width: '90%',
      height: 190,
      backgroundColor: colors.amarillo,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalView: {
      margin: 10,
      width: '90%',
      height: '50%',
      backgroundColor: colors.amarillo,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    botonCerrar: {
      marginRight: 10,
      height: 40,
      width: 120,
      borderRadius: 10,
      backgroundColor: colors.moradoPrincipal,
      alignItems: 'center',
      justifyContent: 'center'
    },
    textoAlerta: {
      fontFamily: 'DMSans',
      fontSize: 20,
      color: colors.blanco,
    }
})
export default RegistrarAnimal;