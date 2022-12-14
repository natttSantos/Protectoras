import React, { useEffect, useState, useContext } from "react";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '../../components/Color'

import {
  ScrollView,
  Modal,
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { TouchableOpacity } from "react-native";

import firebase from "../../database/firebase";
import { enableScreens } from "react-native-screens";


/*  const state = {
  imageFirebase: ""
};*/



/*const [state, SetState] = useState({
  imageFirebase: "",
})*/

const PerfilAnimal = (props) => {

const a = "https://firebasestorage.googleapis.com/v0/b/react-native-firebase-a2b50.appspot.com/o/images%2F7Ge1DcO93w0xDOzWOKXg?alt=media&token=ce324ed2-b8a8-42c2-a470-5d61b0fbe602";
  const initialStatee = {
    imageFirebase:"a",
    staet :""
    
  };

  const initialState = {
    nombre:"",
    apellidos:"",
    localizacion:"",
    dni:"",
    n_animales:"",
   // latitud:"",
    //longitud:"",
  };
  var u = "aaa";

  const [animal, setAnimal] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [cosas, setState] = useState(initialStatee);
  const [fotoProtectora, setfotoProtectora] = useState(""); 
  
  
  //Campos Opcionales
  const [pesoOpcional, setPesoOpcional] = useState("");
  const [edadOpcional, setEdadOpcional] = useState("");
  const [nivelOpcional, setNivelOpcional] = useState("");
  const [vacunadoOpcional, setVacunadoOpcional] = useState("No");
  const [microChipOpcional, setMicroChipOpcional] = useState("No");

  const initialStaate = {
    usuario: "",
    email: "" , 
    telefono: "", 
    nombre: "",
    contraseña: "",
    alta:""
}

const [usuario, setUsario] = useState("");
const [esUsuario] = useState(props.route.params.esUsuario);

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
    longitud: location.coords.longitude,
    verdad: "true"

  })
  setposicionMapa(current);
  setCoordenadas(current);
  setLoading2(false);
  
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
        console.log(imageUri);
        console.log(animal.nombre);
        uploadImage(imageUri)
          .then(resolve => {
            let ref = firebase
            .st
            .ref()
            .child(`images/${animal.nombre}`);
            ref
              .put(resolve)
              .then(resolve => {
                console.log("Imagen subida correctamente");
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


/*METODO LOADIMAGE PARA PRUEBAS NO BORRAR
  const loadImage = async () => {
      firebase
      .st
      .ref(`images/${animal.nombre}`)
      .getDownloadURL().then(function(url) {
      setState({
       imageFirebase: url
    });
  });

  };
*/

const getUsuarioById = async (id) => {
  const dbRef = props.route.params.esUsuario ? firebase.db.collection("users").doc(id) : firebase.db.collection("protectoras").doc(id);
  const doc = await dbRef.get();
  const usuario = doc.data();
  setUsario({...usuario, id: doc.id});
};


const getAnimalById = async (id) => {
  const dbRef = firebase.db.collection("animales").doc(id);
  const doc = await dbRef.get();
  const animal = doc.data();
  if(props.route.params.esUsuario) 
    await getImagenProtectora(animal.id_protectora)
  setAnimal({ ...animal, id: doc.id });


  firebase
  .st
  .ref(`images/${animal.nombre}`)
  .getDownloadURL().then(function(url) {
  setState({
   imageFirebase: url
});
});
  validateOptionalFields(animal); 
  checkMicrochip_Vacunado(animal); 
  setLoading(false);
};

const getImagenProtectora = async (id_protectora) => {
  const protectora = await firebase.db.collection('protectoras').doc(id_protectora).get()
  const {fotoModificada} = protectora.data()

  firebase.st.ref(`imagesProtectora/${fotoModificada}`).getDownloadURL().then(
    (url) => setfotoProtectora(url), (error) => alert('error'))
}



  const validateOptionalFields = (value) => {
    let noInfo = "NS/NC"; 
    if(value.peso == ""){
      setPesoOpcional(noInfo); 
    } else {
      setPesoOpcional(value.peso + " Kg")
    }
    if(value.edad == ""){
      setEdadOpcional(noInfo); 
    } else {
      setEdadOpcional(value.edad + " años")
    }
    if(value.nivelActividad == ""){
      setNivelOpcional(noInfo); 
    } else {
      setNivelOpcional(value.nivelActividad); 
    }
  }
  
const checkMicrochip_Vacunado = (value) => {
  if(value.microchip === true){
    setMicroChipOpcional("Si")
  } 
  if(value.vacunado === true){
    setVacunadoOpcional("Si")
  }
}

  const updateAnimal = async () => {
    const animalRef = firebase.db.collection("animales").doc(animal.id);
    await animalRef.set({
      nombre: animal.nombre,
      edad: animal.edad.toString(),
      raza: animal.raza,
      sexo: animal.sexo,
      fecha_nacimiento: animal.fecha_nacimiento,
      descripcion: animal.descripcion,
      latitud : animal.latitud,
      longitud: animal.longitud,
    });
    setAnimal(initialState);
    props.navigation.navigate("ListaAnimales");
  };

  const enviarSolicitud = async () => {
    const solicitudes = firebase.db.collection('solicitudes')
    const solicitudAEnviar = {
      id_animal: animal.id,
      id_protectora: animal.id_protectora,
      id_usuario: usuario.id,
      solucionada: false
    }

    const soliRepe = await solicitudes.where("id_protectora", "==", animal.id_protectora)
    .where("id_animal", "==", animal.id)
    .where("id_usuario", "==", usuario.id).get()
    let textoAlerta = ''
    const estaRepetido = !soliRepe.empty

    if(!estaRepetido) {
      await solicitudes.add(solicitudAEnviar)
      textoAlerta = 'Solicitud enviada correctamente'
      Alert.alert("Información", "Solicitud enviada correctamente", [
        {text: "Cerrar"}
      ])
    } else {
      textoAlerta = "Ya enviaste la solicitud de adopción"
      Alert.alert("Información", "Ya enviaste la solicitud de adopcion", [
        {text: "Cerrar"}
      ])
    }
    setTextoChikita(textoAlerta);
    setModalChikita({...modalChikita, visible: !modalChikita.visible})
  }

  useEffect(() => {
    getAnimalById(props.route.params.animalId);
    getUsuarioById(props.route.params.userId);
    getLocationPermission();
  }, []);

  const [coordenadas, setCoordenadas] = useState({
    verdad: "false",
  });

  const [posicionMapa, setposicionMapa] = useState({
    latitude: 39.391199,
    longitude:-2.038701,
  });


   const checkImage = () => {
    const { imageFirebase } = cosas;
    if (cosas != "") {
      return (
        <Image
          style={styles.imagen}
          source={{ uri: imageFirebase }}
        />
      );
    }
    return null;
  }

  const adoptarAnimal = () => {
    if(usuario.alta=="Si") { 
      enviarSolicitud();
    } else {
      Alert.alert("Información", "Tienes que completar tu perfil para poder adoptar", [
        {text: "Cerrar"},
        {text: "Completar perfil",  onPress: () => props.navigation.navigate('AltaAdoptar', {userId: props.route.params.userId})}
    ]);
    }

  };


/*
NO BORRAR
        <TouchableOpacity  
            style={styles.boton} 
            onPress={() => openGallery()}
            >
              <Text>Selecciona una imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity  
            style={styles.boton} 
            onPress={() => loadImage()}
            >
              <Text>Cargar una imagen</Text>
        </TouchableOpacity>

*/

const [modalChikita, setModalChikita] = useState({ visible: false}); 
const [textoChikita, setTextoChikita] = useState();


if(loading||  loading2) {
  return(
      <View>
          <ActivityIndicator />
      </View>
  )
}
if(!loading && !loading2) {
  console.log(coordenadas.latitude);
return (
     <><View style={styles.imagenContainer}>
    {checkImage()}
  </View>
  <ScrollView style={styles.container}>
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
      <View style={styles.perfilContainer}>
        <View style={styles.nombreContainer}>
          <Text style={styles.textoNombre}>
            {animal.nombre}
          </Text>
          <TouchableOpacity
          onPress={props.route.params.esUsuario ? () => props.navigation.navigate('PerfilProtectora', { protectoraId: animal.id_protectora })
                   : null}>
            {fotoProtectora == "" || !props.route.params.esUsuario ? null : <Image source={{uri: fotoProtectora}} style={styles.imagenProtectora} />}
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginVertical: 10}}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTexto}>
            {animal.raza}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTexto}>
              {animal.sexo}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTexto}>
              {animal.fecha_nacimiento}
            </Text>
          </View>
          {edadOpcional == "" ? null :
          <View style={styles.infoContainer}>
            <Text style={styles.infoTexto}>
              {edadOpcional}
            </Text>
          </View>
          }
          {pesoOpcional == "" ? null :
          <View style={styles.infoContainer}>
            <Text style={styles.infoTexto}>
              {pesoOpcional}
            </Text>
          </View>
          }
          {vacunadoOpcional == "No" ? null :
          <View style={styles.infoContainer}>
            <Text style={styles.infoTexto}>
              {"Vacunado"}
            </Text>
          </View>
          }
          {microChipOpcional == "No" ? null :
          <View style={styles.infoContainer}>
            <Text style={styles.infoTexto}>
              {"MicroChip"}
            </Text>
          </View>
          }
          {nivelOpcional == "" ? null :
          <View style={styles.infoContainer}>
            <Text style={styles.infoTexto}>
              {nivelOpcional == "Medio" ? "Nivel Actividad Medio" : nivelOpcional}
            </Text>
          </View>
          }
        </ScrollView>
        <View style={{padding: 20}}>
          <Text style={[styles.textoNombre, {fontSize: 24}]}>
            Descripción
          </Text>
        </View>
        <View style={styles.descripcionContainer}>
          <Text style={styles.descripcionTexto}>
            {animal.descripcion}
          </Text>
        </View>
        {props.route.params.esUsuario ? 
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
                pinColor='#BD562A'
                coordinate={coordenadas}
                onDragEnd={(direction) => setposicionMapa(direction.nativeEvent.coordinate)} />

              <Marker
                pinColor='#6BE795'
                coordinate={{
                  longitude: animal.longitud,
                  latitude: animal.latitud
                }} />
            </MapView>
          </View>
        : null}
        {props.route.params.esUsuario ?
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity
              style={styles.boton}
              onPress={() => adoptarAnimal()}
            >
              <Text style={styles.texto}>Solicitar adopción</Text>
            </TouchableOpacity>
          </View>
        : null}
      </View>
    </ScrollView></>
  );
        }
};

const styles = StyleSheet.create({
  container: {
    flex: 5,
  },
  perfilContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imagenContainer: {
    flex: 1,
    height: 200,
    width: '100%'
  },
  imagen: {
    height: 410,
    width: '100%'
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  btn: {
    marginBottom: 7,
  },
  image : {
    height : 170, 
    width : 170
},
title : {
  fontSize: 50,
  fontWeight: "bold", 
},
boton: {
  alignItems: "center",
  backgroundColor: colors.moradoPrincipal,
  padding: 10,
  width: 220,
  height: 40,
  borderRadius: 42

},
texto: {
  fontSize : 16,
  fontFamily: 'DMSans',
  color: colors.blanco
},
map: {
  width: 290,
  height: 150,
},
nombreContainer: {
  padding: 20,
  marginTop: 5,
  flexDirection: 'row',
  justifyContent: 'space-between'
},
textoNombre: {
  fontFamily: 'DMSans',
  fontSize: 36,
  color: colors.moradoPrincipal
},
imagenProtectora: {
  width: 48,
  height: 48,
  borderRadius: 24,
  borderColor: colors.moradoPrincipal,
  borderWidth: 2
},
infoContainer: {
  width: 75,
  height: 75,
  borderRadius: 20,
  backgroundColor: colors.amarillo,
  marginLeft: 15,
  justifyContent: 'center',
  alignItems: 'center'
},
infoTexto: {
  color: colors.blanco,
  fontFamily: 'InterRegular',
  fontWeight: 'bold',
  textAlign: 'center'
},
descripcionContainer: {
  marginHorizontal: 50
},
descripcionTexto: {
  fontFamily: 'InterRegular',
  fontSize: 14
},
mapaContainer: {
  width: 294,
  height: 154,
  marginHorizontal: 50,
  marginVertical: 30,
  borderColor: colors.moradoPrincipal,
  borderWidth: 2
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

export default PerfilAnimal;