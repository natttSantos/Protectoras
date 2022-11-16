import React, {useEffect, useState} from "react";
import * as Location from 'expo-location';
import { StyleSheet, Text, View,ActivityIndicator,ScrollView,TextInput,Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
//import MapViewDirections from 'react-native-maps-directions';
//import { GOOGLE_MAPS_KEY } from '@env';
import { Button } from "react-native-elements";
const carImage = require('../../images/perfilUsuario.jpg')
import firebase from '../../database/firebase';
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from 'expo-image-picker';


const MapaAnimalEncontradoProtectora = (props) => {


  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [imagenes, setImagenes] = useState([]);
  let imagenesAux = []

  const [tipo, setTipo] = useState([
    { label: "Perro", value: "Perro" },
    { label: "Gato", value: "Gato" },
  ]);


  const [foto, setFoto] = useState({
    existe:"",
  });

  /*const cargarImagenes = async () => {
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
*/

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
    latitude: 39.484242,
    longitude:  -0.377869,
  });

  const getUsuarioById = async (id) => {
    const dbRef = firebase.db.collection("users").doc(id);
    const doc = await dbRef.get();
    const usuario = doc.data();
    console.log(usuario)
    setUsuario({ ...usuario, id: doc.id });
    //setLoading(false);
  };

  const [notificacionCargar, setCargarNotificacion] = useState(initialStatee);
  const initialStatee = {
    latitud:"",
    longitud:"",
    descripcion:"",
    tipo:"",
    usuario:""
}


const initialStateee = {
  imageFirebase:"a",
  staet :""

};
const [cosas, setFotoAnimal] = useState(initialStatee);

  const getNotificacionAnimal = async (id) => {
    const dbRef = firebase.db.collection("notificacionAnimal").doc(id);
    const doc = await dbRef.get();
    const notificacionCargar = doc.data();
    setCargarNotificacion({ ...notificacionCargar, id: doc.id });
    firebase
    .st
    .ref(`imagesNotificacionAnimal/${notificacionCargar.tipo+notificacionCargar.descripcion}`)
    .getDownloadURL().then(function(url) {
      setFotoAnimal({
     imageFirebase: url
  });
});
    setLoading2(false);
    console.log("holaaa");
  //  checkImage();
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
  const [notificacionesAnimalEncontrado, setNotificacionesAnimalEncontrado] = useState([]);

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


  firebase.db.collection('notificacionAnimal').onSnapshot((querySnapshot) => {
    const listaNotificaciones = []
    console.log("aaaniimal");
    querySnapshot.docs.forEach((doc) => {
        const {descripcion, tipo, usuario, latitud, longitud, recogido, horas, minutos, dia, mes, año} = doc.data()
        listaNotificaciones.push({
            id: doc.id,
            latitud,
            longitud,
            descripcion,
            tipo,
            usuario,
            recogido,
            dia,
            mes,
            año,
            horas,
            minutos,
        })
    });
    setNotificacionesAnimalEncontrado(listaNotificaciones)
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
    setLoading(false);
    setCoordenadas(current);
  }



  const modificarNotificacion = async (id) => {
    const protectoraRef = firebase.db.collection("notificacionAnimal").doc(id);
    await protectoraRef.set({
      tipo: notificacionCargar.tipo,
      descripcion: notificacionCargar.descripcion,
      latitud: notificacionCargar.latitud,
      longitud: notificacionCargar.longitud,
      usuario: notificacionCargar.usuario,
      recogido: "Si"
        })
        alert("Notificacion enviada correctamente")
}







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

const checkImage = () => {
  if(!loading2){
    console.log("sdgsd");
    const { imageFirebase } = cosas;
    const { tipo } = notificacionCargar;
    console.log(notificacionCargar.tipo+"         bbbbb");
   // setLoading2(false);
      return (
        <View>
           <Text style = {styles.texto} >
          {"Avistado por: "+notificacionCargar.usuario+" el " +notificacionCargar.dia +"/" + notificacionCargar.mes +"/" + notificacionCargar.año+ " a las " +notificacionCargar.horas +":"+notificacionCargar.minutos  }
        </Text>
        <Text style = {styles.texto} >
          {"Nombre: " + notificacionCargar.tipo}
        </Text>
        <Text style = {styles.texto} >
          {"Descripcion: " + notificacionCargar.descripcion}
        </Text>
        <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: imageFirebase }}
        />
        <Button title="Recogido" onPress={() =>  modificarNotificacion(notificacionCargar.id)} /> 
        </View>

      );

  }
}

  /* Codigo para saber donde estan las protectoras
  {protectoras.map((protectora, index) => {
              
    return (
            <Marker 
               title={protectora.nombre}
               pinColor= '#843B90'
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
          pinColor= '#BD562A'
          coordinate={coordenadas}
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
        />
          {notificacionesAnimalEncontrado.map((notificacionAnimalActual, index) => {
              if(notificacionAnimalActual.recogido =="No")
              return (
                      <Marker 
                         title={notificacionAnimalActual.nombre}
                         pinColor= '#6BE795'
                         coordinate={{
                            longitude: notificacionAnimalActual.longitud,
                            latitude: notificacionAnimalActual.latitud
                         }}
                         onPress={() => {getNotificacionAnimal(notificacionAnimalActual.id)}}
                        />);
          })}

      </MapView>
      {checkImage()}
      <Button 
                title="Enviar" 
                onPress={() => {saveNewProtectora()}}/>
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
        height:900
  },
  map: {
    width: 290,
    height: 360
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
texto:{
  fontSize : 16,
  padding : 5,
  borderBottomWidth: 1,
  borderBottomColor: "#cccccc",
  marginTop : 13
}
});
export default MapaAnimalEncontradoProtectora;