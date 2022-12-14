import React, {useEffect, useState} from "react";
import * as Location from 'expo-location';
import { StyleSheet, Text, View,ActivityIndicator,ScrollView,TextInput,Image, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
//import MapViewDirections from 'react-native-maps-directions';
//import { GOOGLE_MAPS_KEY } from '@env';
import { Button } from "react-native-elements";
const carImage = require('../../images/perfilUsuario.jpg')
import firebase from '../../database/firebase';
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../components/Color';

const MapaAnimalEncontradoProtectora = (props) => {
  DropDownPicker.setListMode("SCROLLVIEW");


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
    setposicionMapa(current);
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
        setTextoChikita("Notificacion enviada correctamente");
        setModalChikita({...modalChikita, visible: !modalChikita.visible});
}

  const animalRecogido = async () => {
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
  setTextoChikita(textoAlerta);
  setModalChikita({...modalChikita, visible: !modalChikita.visible});
  
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
           <Text style = {styles.descripcion} >
          { notificacionCargar.tipo + " avistado por "+notificacionCargar.usuario+" el " +notificacionCargar.dia +"/" + notificacionCargar.mes +"/" + notificacionCargar.año+ " a las " +notificacionCargar.horas +":"+notificacionCargar.minutos
           + "\n \n Descripcion: " + notificacionCargar.descripcion  }
        </Text>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: imageFirebase }}
          />
        </View>
        <TouchableOpacity 
          onPress={() =>  modificarNotificacion(notificacionCargar.id)}
          style={styles.boton}>
            <Text style={styles.botonTexto}>
              Recogido
            </Text>
        </TouchableOpacity>
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

const [modalChikita, setModalChikita] = useState({ visible: false}); 
const [textoChikita, setTextoChikita] = useState();

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
    <Text style={styles.titulo}>   Animales encontrados  </Text>
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
          {notificacionesAnimalEncontrado.map((notificacionAnimalActual, index) => {
              if(notificacionAnimalActual.recogido =="No")
              return (
                      <Marker 
                      key={index}
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
      </View>
      {checkImage()}
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
  image:  { 
    width: 200, 
    height: 200, 
},
container: {
  flex: 2, 
  paddingTop: 15,
  paddingHorizontal: 15,
  paddingBottom: 15,
  backgroundColor: colors.blanco
},
map: {
  width: 290,
  height: 360
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
},
titulo: {
  padding: 0,
  color: colors.moradoPrincipal,
  fontSize: 29,
  fontFamily: 'DMSans',
  textAlign: "left",
  marginTop: 50,
  marginBottom: 30,
},
mapaContainer: {
  width: 294,
  height: 364,
  marginHorizontal: 30,
  marginVertical: 10,
  borderColor: colors.moradoPrincipal,
  borderWidth: 2
},
imageContainer: {
  width: 204,
  height: 204,
  marginHorizontal: 80,
  marginVertical: 30,
  borderColor: colors.moradoPrincipal,
  borderWidth: 2,
  marginBottom:30,
},
descripcion : {
  height: 200,
  borderWidth: 2,
  borderColor: colors.moradoPrincipal,
  borderRadius: 15,
  multiline: true,
  textAlignVertical: "top",
  color: colors.moradoPrincipal,
  fontSize: 21,
  padding: 20,
  marginBottom: 10,
  marginTop: 30,
  fontFamily: 'InterRegular'
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
export default MapaAnimalEncontradoProtectora;