import React, {useEffect, useState} from "react";
import * as Location from 'expo-location';
import { StyleSheet, Text, View,ActivityIndicator,ScrollView,TextInput } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
//import MapViewDirections from 'react-native-maps-directions';
//import { GOOGLE_MAPS_KEY } from '@env';
import { Button } from "react-native-elements";
const carImage = require('../../images/perfilUsuario.jpg')
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

  const cargarImagenes = async () => {
    let i = protectoras.length
    setLoading(true);
    if(i > 0){
        await protectoras.map(async (protectora, index) => {
          console.log(protectora.nombre);
            await firebase
            .st
            .ref(`imagesProtectora/${protectora.fotoModificada}`)
            .getDownloadURL().then(function(url) {
                i--
                imagenesAux[index] = url
                setImagenes(...imagenes, imagenesAux)
                if(i == 0) setLoading(false)
            });
            console.log("si entro")
        })
    }
    else {
        console.log("no entro")
        setLoading(false)
    }
}

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
  latitud:"",
  longitud:""
  
});

const handleChangeText = (nombre, value) => {
  setNotificacionAnimal({...notificacionAnimal, [nombre]: value}); 
}; 


  const [origin, setOrigin] = useState({
    latitude: 39.391199,
    longitude:  -2.038701,
  });

  const getUsuarioById = async (id) => {
    const dbRef = firebase.db.collection("users").doc(id);
    const doc = await dbRef.get();
    const usuario = doc.data();
    console.log(usuario)
    setUsuario({ ...usuario, id: doc.id });
    setLoading(false);
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
      //cargarImagenes();
  });
  }, [])

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
    setOrigin(current);
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


  const saveNewProtectora = async () => {
    if (notificacionAnimal.tipo =="" || notificacionAnimal.descripcion=="") {
        validateFields();
    } else {
        const dbRef = firebase.db.collection('notificacionAnimal');
            await dbRef.add({
                tipo: notificacionAnimal.tipo,
                descripcion: notificacionAnimal.descripcion,
                latitud: coordenadas.latitud,
                longitud: coordenadas.longitud,
                usuario: usuario.usuario
            })
            alert("Notificacion enviada correctamente")
        
    }
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
if(protectoras.length > 0) {
  return (
    <ScrollView style={styles.container}> 
    <View> 
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
                    style={styles.descripcion}
                    placeholder="Descripción (max 200 caracteres)"
                    onChangeText={(value) => handleChangeText('descripcion', value)}
                    />
                    </View>
                    <View style={{marginTop: 15}}>
                    <Button title="Adjuntar fotografía" onPress={() =>  openGallery()} /> 
                    </View>
                    <View> 
      <MapView 
        style={styles.map}
        initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04
          }}
      >
                <Marker 
          
          image={carImage}
          coordinate={origin}
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
        />

            
        
      </MapView>
      </View>
      <Button 
                title="Dar de alta" 
                onPress={() => {saveNewProtectora()}}/>
      
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
        padding: 35
  },
  map: {
    width: 500,
    height: 300
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