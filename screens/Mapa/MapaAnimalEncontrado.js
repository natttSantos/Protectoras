import React, {useEffect, useState} from "react";
import * as Location from 'expo-location';
import { StyleSheet, Text, View,ActivityIndicator,ScrollView,TextInput,Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
//import MapViewDirections from 'react-native-maps-directions';
//import { GOOGLE_MAPS_KEY } from '@env';
import { Button } from "react-native-elements";
import firebase from '../../database/firebase';
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from 'expo-image-picker';

const MapaAnimalEncontrado = (props) => {


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
                 alert("Imagen subida correctamente")
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
}else{alert ("Primero debe introducir el tipo de animal y su descripción");}
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
            alert("Notificacion enviada correctamente")
        
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
  alert (textoAlerta); 
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
    <ScrollView > 
    <View style={styles.container}>
       
    <DropDownPicker name="eleccion"
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
                    style={styles.descripcion}
                    placeholder="Descripción (max 200 caracteres)"
                    value={state1.value}
                    onChangeText={(value) =>{ handleChangeText('descripcion', value)
                    setState1({value: value})}}
                    />
                    <Button title="Adjuntar fotografía" onPress={() =>  openGallery()} /> 
                    
                    
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
      
      <Button 
                title="Cancelar" 
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
                
                
                
                }/>


      <Button 
                title="Enviar" 
                onPress={() => {guardarNotificacion()}}/>
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
    flex: 1, 
        padding: 35,
        height:700,
        marginBottom: 80
  },
  map: {
    width: 290,
    height: 360,
    marginTop: 10,
    marginBottom: 20
  },
  descripcion : {
    height: 100,
    borderWidth: 2,
    borderColor: '#cccccc'
},
inputGroup: {
  fontSize: 20, 
  padding: 0,
  marginBottom: 10,
  marginTop: 10, 
  borderBottomWidth: 2, 
  borderBottomColor: '#cccccc'
}, 
});
export default MapaAnimalEncontrado;