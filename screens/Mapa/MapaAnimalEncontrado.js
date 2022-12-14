import React, {useEffect, useState} from "react";
import * as Location from 'expo-location';
import { StyleSheet, Text, View,ActivityIndicator,ScrollView,TextInput,TouchableOpacity, Alert, LogBox, Modal } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
//import MapViewDirections from 'react-native-maps-directions';
//import { GOOGLE_MAPS_KEY } from '@env';
import { Button } from "react-native-elements";
import firebase from '../../database/firebase';
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../components/Color';


const MapaAnimalEncontrado = (props) => {

  useEffect(() => {

    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])

  const [loading, setLoading] = useState(true);
  const [imagenes, setImagenes] = useState([]);
  let imagenesAux = []

  const [tipo, setTipo] = useState([
    { label: "Perro", value: "Perro" },
    { label: "Gato", value: "Gato" },
  ]);


  const [foto, setFoto] = useState({
    existe:"",
  });

const [state, setState] = useState({
  animal:"",
  descripcion:"",
  latitud:"",
  longitud:""
});

const [notificacionAnimal, setNotificacionAnimal] = useState({
  tipo:"",
  descripcion:"",
});

const [modalChikita, setModalChikita] = useState({ visible: false}); 
const [textoChikita, setTextoChikita] = useState();

const [coordenadas, setCoordenadas] = useState({
});

const [state1, setState1] = useState({
  
});

const handleChangeText = (nombre, value) => {
  setNotificacionAnimal({...notificacionAnimal, [nombre]: value}); 
}; 


  const [posicionMapa, setposicionMapa] = useState({
    latitude: 39.391199,
    longitude:-2.038701,
  });

  const getUsuarioById = async (id) => {
    const dbRef = firebase.db.collection("users").doc(id);
    const doc = await dbRef.get();
    const usuario = doc.data();
    setUsuario({ ...usuario, id: doc.id });
  };


  const [usuario, setUsuario] = useState(initialState);
  const initialState = {
    usuario: "",
    email: "" , 
    telefono: "", 
    nombre: "",
    contraseña: "",
    alta:""
}

  const [protectoras, setProtectoras] = useState([]);
  useEffect(() => {
    getLocationPermission();
    getUsuarioById(props.route.params.userId); 
    
    firebase.db.collection('protectoras').onSnapshot((querySnapshot) => {
      const listaProtectoras = []

      querySnapshot.docs.forEach((doc) => {
          const {latitud, longitud} = doc.data()
          listaProtectoras.push({
              id: doc.id,
              latitud,
              longitud
          })
      });
      setProtectoras(listaProtectoras)
  });
  }, [])
let fechaActual = new Date();

  const [tipoOpen, setTipoOpen] = useState(false);
  const [tipoValue, setTipoValue] = useState(null);

  async function getLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') {
      alert('Permission denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }
    setCoordenadas({
      latitud: location.coords.latitude,
      longitud: location.coords.longitude

    })
    setposicionMapa(current);
    setCoordenadas(current);
    setLoading(false);
    
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
if(notificacionAnimal.tipo != "" && notificacionAnimal.descripcion != ""){
    const resultPermission =true; 
    if (resultPermission) {
      const resultImagePicker = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
    
      if (resultImagePicker.cancelled === false) {
        const imageUri = resultImagePicker.uri;
        let textoAlerta = "";
        uploadImage(imageUri)
          .then(resolve => {
            let ref = firebase
            .st
            .ref()
            .child(`imagesNotificacionAnimal/${notificacionAnimal.tipo+notificacionAnimal.descripcion}`);
            ref
              .put(resolve)
              .then(resolve => {
                console.log("Imagen subida correctamente");
                setFoto({
                    existe: "Si"
                 });
                 textoAlerta = "Imagen subida correctamente"
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
}else{
  textoAlerta = "Primero debe introducir el tipo de animal y descripción";
}
setTextoChikita(textoAlerta);
setModalChikita({...modalChikita, visible: !modalChikita.visible});
  };


  const guardarNotificacion = async () => {
    if (notificacionAnimal.tipo =="" || notificacionAnimal.descripcion=="") {
        validateFields();
    } else {
      await firebase.db.collection('notificacionAnimal').add({
                tipo: notificacionAnimal.tipo,
                descripcion: notificacionAnimal.descripcion,
                latitud: coordenadas.latitude,
                longitud: coordenadas.longitude,
                usuario: usuario.usuario,
                recogido: "No",
                dia : fechaActual.getDate(),
                mes : fechaActual.getMonth(),
                año: fechaActual.getFullYear(),
                horas: fechaActual.getHours(),
                minutos: fechaActual.getMinutes(),

            })
            setTextoChikita("Notificacion enviada correctamente");
            setModalChikita({...modalChikita, visible: !modalChikita.visible});
        
    }
}


const cancelar = () => {
  if(true)
  setState1(null);
  return null
}

const validateFields = () => {
  let textoAlerta = "Complete el campo: ";
  if (notificacionAnimal.tipo == ''){
      textoAlerta += "\n - Tipo de animal"; 
  } if (notificacionAnimal.descripcion == ''){
      textoAlerta += "\n - Descripción ";  
  } if (foto.existe == ''){
      textoAlerta += "\n - Foto "; 
  } 
  setTextoChikita(textoAlerta);
  setModalChikita({...modalChikita, visible: !modalChikita.visible}); 
}

  /* Codigo para saber donde estan las protectoras
  {protectoras.map((protectora, index) => {
              
    return (
            <Marker 
               title={protectora.nombre}
               coordinate={{
                  longitude: protectora.longitud,
                  latitude: protectora.latitud
               }}
               
               onPress={() => {props.navigation.navigate('PerfilProtectora', {protectoraId: protectora.id})}}
              />);
})}*/

  if(loading) {
    return(
        <View>
            <ActivityIndicator />
        </View>
    )
}
if(!loading) {
  return (
    <ScrollView>
    <View style={styles.container}>
    <Modal
        animationType="slide"
        transparent={true}                    
        visible={modalChikita.visible}
        onRequestClose={() => {
            setModalChikita({...modalChikita, visible: !modalChikita.visible});
        }}>
        <View style={styles.centeredView}>
            <View style={[styles.modalView, {height: '30%'}]}>
                <View style={{flex: 4}}>
                    <Text style={[styles.textoAlerta, {fontSize: 20}]}> {textoChikita} </Text>
                </View>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                    onPress={() => setModalChikita({...modalChikita, visible: !modalChikita.visible})}>
                        <View style={styles.botonCerrar}>
                            <Text style={[styles.textoAlerta, {fontSize: 20}]}>cerrar</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal> 
    <Text style={styles.titulo}>Notificar animal en la calle</Text>  
      <View>
      <DropDownPicker name="eleccion"
          style={styles.dropDownPicker}
          listItemLabelStyle={{
            color: colors.moradoSecundario
        }}
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
    </View>
  <TextInput  
    style={styles.descripcion}
    placeholderTextColor={colors.moradoSecundario}
    placeholder="Descripción (max 200 caracteres)"
    value={state1.value}
    onChangeText={(value) =>{ handleChangeText('descripcion', value)
    setState1({value: value})}}
  /> 
 <View> 
    <TouchableOpacity 
      onPress={() => 
      openGallery()
    }
      style={[styles.botonPropiedades, {marginBottom: 20}, {borderColor: colors.moradoPrincipal}]}>
        <Text style={[styles.botonTexto, {color: colors.moradoPrincipal}]}>
        Adjuntar fotografía
        </Text>
</TouchableOpacity>
</View>
    <View style={styles.mapaContainer}>
      <MapView 
        style={styles.map}
        initialRegion={{
            latitude: posicionMapa.latitude,
            longitude: posicionMapa.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04
          }}
      >
                <Marker 
           pinColor= '#BD562A'
          coordinate={coordenadas}
          onDragEnd={(direction) => setposicionMapa(direction.nativeEvent.coordinate)}
        />

            
        
      </MapView>
    </View>
    <TouchableOpacity 
          onPress={() => 
            Alert.alert("Información", "¿Está seguro que desea cancelar el avistamiento?", [
              {text: "Confirmar", 
              onPress: () => {
                {
                  //props.navigation.navigate('MapaAnimalEncontrado', {userId: props.route.params.userId})
                  console.log("no va???")
                 // this.setTipoValue({value:""})
                  setNotificacionAnimal({
                    tipo:"",
                    descripcion:""
                  })
                  setFoto({existe:"No"})
                }
                setState1({value:''})
              }}, 
              {text: "Cancelar"}
          ])
          
          
          
          }
          style={styles.botonCancelar}>
            <Text style={styles.botonTexto}>
              Cancelar
            </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {guardarNotificacion()}}
          style={styles.boton}>
            <Text style={styles.botonTexto}>
              Enviar
            </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
  );
} else {
  return (
      <View>
          <Text>
              NO HAY PROTECTORAS
          </Text>
      </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 2, 
    padding: 15,
    backgroundColor: colors.blanco 
  },
  descripcion : {
    height: 100,
    borderWidth: 2,
    borderColor: colors.moradoPrincipal,
    borderRadius: 15,
    multiline: true,
    textAlignVertical: "top",
    color: colors.moradoPrincipal,
    fontSize: 16,
    padding: 10,
    marginBottom: 30
},
inputGroup: {
  fontSize: 20, 
  padding: 0,
  marginBottom: 10,
  marginTop: 10, 
  borderBottomWidth: 2, 
  borderBottomColor: '#cccccc'
},
titulo: {
  padding: 10,
  color: colors.moradoPrincipal,
  fontSize: 29,
  fontFamily: 'DMSans',
  textAlign: "center",
  marginTop: 70,
  marginBottom: 20,
},
dropDownPicker : {
  marginBottom: 25,
  marginTop: 15,
  borderRadius: 25,
  borderColor: colors.moradoPrincipal,
  borderWidth: 2,
  fontStyle : {
  color: colors.amarillo
 }
},
botonPropiedades : {
  borderWidth: 2,
  width:260,
  height:50,
  borderRadius: 25,
  alignSelf: "center"
}, 
botonTexto : {
  fontSize: 22,
  alignSelf: "center",
  marginTop: 5
},
mapaContainer: {
  width: 294,
  height: 364,
  marginHorizontal: 30,
  marginVertical: 10,
  borderColor: colors.moradoPrincipal,
  borderWidth: 2,
  marginBottom: 30
},
map: {
  width: 290,
  height: 360
},
boton : {
  backgroundColor: colors.moradoPrincipal,
  borderColor: colors.blanco,
  borderWidth: 2,
  width:170,
  height:42,
  borderRadius: 25,
  alignSelf: "center",
},
botonCancelar : {
  backgroundColor: colors.amarillo,
  borderColor: colors.blanco,
  borderWidth: 2,
  width:170,
  height:42,
  borderRadius: 25,
  alignSelf: "center",
  marginBottom: 10
},
botonTexto: {
  fontSize: 18,
  color: colors.blanco,
  fontWeight: "bold",
  alignSelf: "center",
  marginTop: 5
}, 
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22
},
modalView: {
  margin: 10,
  width: '90%',
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
  elevation: 5,
  borderWidth: 1,
  borderColor: colors.moradoPrincipal
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
  color: colors.blanco,
},
});
export default MapaAnimalEncontrado;