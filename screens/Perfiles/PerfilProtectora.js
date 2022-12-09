import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  Button,
  ActivityIndicator,
  Alert
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import firebase from "../../database/firebase";
import Donaciones from "../Donaciones"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../components/CredentialsContext";
import {colors} from '../../components/Color';
import { Appbar} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import {Avatar, ListItem} from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";

const PerfilProtectora = (props) => {
  const isFocused = useIsFocused()
  const initialState = {
    nombre:"",
    email:"",
    localizacion:"",
    direccion:"",
    url:"",
    descripcion:"",
    fotoModificada:""
  };

  const initialStatee = {
    imageFirebase:"a",
    staet :""
    
  };
  const [imagenes, setImagenes] = useState([]);
  let imagenesAux = []
  const [animales, setAnimales] = useState([])
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  const {type, setType} = useContext(CredentialsContext)

  const [cosas, setState] = useState(initialStatee);
  const [loading, setLoading] = useState(true);
  const [cambios, setcambios] = useState(false);
  const [protectora, setProtectora] = useState(initialState);

  const clearLogin = () => {
    console.log('presionado')
    AsyncStorage.removeItem('getPetCredentials')
    .then(() =>{
      setStoredCredentials(null);
    })
    .catch((error) =>{console.log(error)})
  }

  const getProtectoraById = async (id) => {
    const dbRef = firebase.db.collection("protectoras").doc(id);
    const doc = await dbRef.get();
    const protectora = doc.data();
    setProtectora({ ...protectora, id: doc.id });
    setLoading(false);
    firebase
    .st
    .ref(`imagesProtectora/${protectora.fotoModificada}`)
    .getDownloadURL().then(function(url) {
        setState({
        imageFirebase: url
      });
    });
  };

  const cargarImagenes = async () => {
    let i = animales.length

    if(i > 0){
        await animales.map(async (animal, index) => {
            await firebase
            .st
            .ref(`images/${animal.nombre}`)
            .getDownloadURL().then(function(url) {
                i--
                imagenesAux[index] = url
                setImagenes(...imagenes, imagenesAux)
                if(i == 0) setLoading(false)
            });
        })
    }
    else {
        setLoading(false)
    }
}
  const getAllAnimalesDeProtectora = async (id) => {
    const animales = []

    const dbRef = firebase.db.collection('animales').where("id_protectora", "==", id)
    const docs = await dbRef.get()
    docs.forEach(doc => {
        const {nombre, sexo,descripcion, raza} = doc.data()
        animales.push({
            id: doc.id,
            id_protectora: id,
            nombre,
            raza,
            descripcion,
            sexo
        })
    })

    setAnimales(animales)
    setLoading(false)
  }
  const checkImage = () => {
    const { imageFirebase } = cosas;
    if (cosas != "") {
      return (
        <Image
          style={styles.image}
          source={{ uri: imageFirebase }}
        />
      );
    }
    return null;
  }
  const cargarListaAnimales = () => {
    if(animales.length > 0) {
      return(
          <View style={styles.containerListaAnimales}>
                  <Text style={styles.titulo}> Animales en esta protectora</Text>
                  {animales.map((animal, index) => {
                      return (
                          <ListItem key={animal.id}
                              bottomDivider
                              onPress={() => {props.navigation.navigate('PerfilAnimal', {animalId: animal.id, userId: props.route.params.userId, esUsuario: false})}}>
                              <Avatar 
                              style = {styles.imagen}
                              source={{uri: imagenes[index]}}
                              />
                              <ListItem.Content 
                              style = {styles.lista}
                              >
                                  <ListItem.Title> {animal.nombre} </ListItem.Title>
                                  <ListItem.Subtitle> {animal.raza} </ListItem.Subtitle>
                                  <ListItem.Subtitle> {animal.sexo} </ListItem.Subtitle>
                              </ListItem.Content>
                          </ListItem>);
                  })}
              </View>
      )
  } else {
      return (
          <View>
              <Text>
                  NO HAY ANIMALES
              </Text>
          </View>
      )
  }
  }
  const checkTipoUsuario_usuario = () => { //SESION USUARIO
    if (props.route.params.isUsuario) {
      return (
        <ScrollView style={styles.container}>
        <View style={styles.container}>
        <View style={styles.textContainerGmailTlf}>
            {checkImage()}
            <Text style={styles.textoNombreProte} >{protectora.nombre}</Text>
        </View>
      
        <View style={styles.containerInfoProte}>
        <View style={{marginTop: -2150, padding: 40,marginBottom: -350}}><Text style={styles.titulo}>Datos</Text></View>
        
        <View style={styles.containerInfoProteCUADRADO}>
        <Text style={styles.textoInfoProteEnunciado}>Email</Text>
        <Text style={styles.textoInfoProte}>{protectora.email}</Text>
        <Text style={styles.textoInfoProteEnunciado}>Localizacion</Text>
        <Text style={styles.textoInfoProte}>{protectora.localizacion}</Text>
        <Text style={styles.textoInfoProteEnunciado}>Dirección</Text>
        <Text style={styles.textoInfoProte}>{protectora.direccion} </Text>
        <Text style={styles.textoInfoProteEnunciado}>Descripción</Text>
        <Text style={styles.textoDescipcion}>{protectora.descripcion} </Text>
        </View>
        </View>

        <View style={{marginTop: 708}}>
        <BotonAbrirURL url={protectora.url}>
          Página web
        </BotonAbrirURL>
        </View>

        <View style={{marginTop: -537}}>
        <TouchableOpacity 
                      onPress={() => {
                        props.navigation.navigate('Donaciones', {userId: storedCredentials,  protectoraId:props.route.params.protectoraId}) 
                      }}
                      style={styles.botonCircularMorado2}>
                          <Text style={styles.botonTexto}>
                              Donar
                          </Text>
          </TouchableOpacity>
          </View>
          </View>
          {cargarListaAnimales()}
    </ScrollView>
      )
    } 
  }
  
  const checkTipoUsuario_protectora = () => { 
    if (!props.route.params.isUsuario) { //SESION PROTECTORA
      return (
        <View style={styles.container}>
          <Appbar.Header style={styles.appBar}>
          <Appbar.Content title="" />
          <Appbar.Action icon="lead-pencil" size={30} onPress={() => {
                        props.navigation.navigate('ModificarProtectora', {userId: storedCredentials}) 
                      }} />
          <Appbar.Action icon="logout" size={30} onPress={clearLogin} />
          </Appbar.Header>

        <View style={styles.textContainerGmailTlf_desdeProte}>
            {checkImage()}
            <View style={{marginTop: -210}}><Text style={styles.textoNombreProte} >{protectora.nombre}</Text></View>
        </View>
      
        <View style={styles.containerInfoProte_desdeProte}>
        <View style={styles.containerprueba}>
        <Text style={styles.textoInfoProteEnunciado}>Email</Text>
        <Text style={styles.textoInfoProte}>{protectora.email}</Text>
        <Text style={styles.textoInfoProteEnunciado}>Localizacion</Text>
        <Text style={styles.textoInfoProte}>{protectora.localizacion}</Text>
        <Text style={styles.textoInfoProteEnunciado}>Dirección</Text>
        <Text style={styles.textoInfoProte}>{protectora.direccion} </Text>
        <Text style={styles.textoInfoProteEnunciado}>Descripción</Text>
        <Text style={styles.textoDescipcion}>{protectora.descripcion} </Text>
        </View>
        </View>

        <View style={{marginTop: 20}}>
        <TouchableOpacity 
                      onPress={() => {
                        props.navigation.navigate('ListaDonaciones', {userId: storedCredentials,  protectoraId:props.route.params.protectoraId}) 
                      }}
                      style={styles.botonListaDonaciones}>
                          <Text style={styles.botonTexto}>
                              Lista donaciones
                          </Text>
          </TouchableOpacity>
          </View>

        <View style={{marginTop: 400}}>
        <BotonAbrirURL url={protectora.url}>
          Página web
        </BotonAbrirURL>
        </View>
    </View>
      )
    }
  }

  useEffect(() => { 
    if(isFocused) {
      setLoading(true)
      getAllAnimalesDeProtectora(props.route.params.protectoraId);
    }
  }, [isFocused]);

  useEffect(() => {
    cargarImagenes(); 
    getProtectoraById(props.route.params.protectoraId); 
  }, [cambios]);
  
  if(loading) {
    return(
        <View>
            <ActivityIndicator />
        </View>
    )
}


return (
    <View style={styles.container}>
        {checkTipoUsuario_protectora()}
        {checkTipoUsuario_usuario()}
    </View>
  );
};



const BotonAbrirURL = ({ url }) => {
  
    const handlePress = useCallback(async () => {
    //Revisando si el link es soportado/válido
    const soportado = await Linking.canOpenURL(url);

    if (soportado) {
      // Abirendo el link con el navegador del teléfono
      await Linking.openURL(url);
    } else {
      Alert.alert(`No es posible abrir la URL: ${url}`);
    }
  }, [url]);

  return <TouchableOpacity  
            style={styles.botonCircularAmarillo} 
            onPress={handlePress} 
            >
              <Text style={styles.botonTexto}>Página web</Text>
          </TouchableOpacity>
};

const styles = StyleSheet.create({
  container: {
        flex: 1, 
        backgroundColor: colors.amarillo 
  },
  containerListaAnimales: {
    flex: 2, 
    padding: 15, 
    height: 1000, 
    marginTop: 500 
},
  image: {
        width: 110,
        height: 110,
        alignSelf: "center", 
        top: -50, 
        position: "absolute", 
        borderRadius: 75
  },
  textContainer: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    position: "absolute", 
    alignSelf: 'center', 
    bottom: -180,
    flex: 1
},
textContainerGmailTlf: {
  height: '50%',
  width: '100%',
  justifyContent: 'center',
  position: "absolute", 
  alignSelf: 'center', 
  bottom: 60, 
  flex: 1
},textContainerGmailTlf_desdeProte: {
  height: '50%',
  width: '100%',
  justifyContent: 'center',
  position: "absolute", 
  alignSelf: 'center', 
  padding: 50,
  marginTop: 70
},
  textoNombreProte: {
    fontSize: 24,
    alignSelf: "center", 
    color: colors.blanco,
    fontWeight: 'bold',
    top: 10
  },
  containerInfoProte: {
    height: 2000, 
    width: '100%',
    justifyContent: 'center',
    position: "absolute", 
    backgroundColor: colors.blanco,
    borderRadius: 35, 
    alignSelf: 'center', 
    top: 220, 
    flex: 1
  },
  containerInfoProte_desdeProte: {
    height: 540, 
    width: '100%',
    justifyContent: 'center',
    position: "absolute", 
    backgroundColor: colors.blanco,
    borderRadius: 35, 
    alignSelf: 'center', 
    top: 220, 
    flex: 1
  },
  containerInfoProteCUADRADO: {
    height: 450, 
    width: 350,
    justifyContent: 'center',
    position: "absolute", 
    borderColor: colors.moradoPrincipal, 
    borderWidth: 3,
    borderRadius: 35, 
    alignSelf: 'center', 
    top: 200, 
    marginBottom: 4, 
    marginTop: -170, 
    flex: 1
  },
  containerprueba: {
    marginBottom: 4, 
    marginTop: -170
  }, 
  textoInfoProteEnunciado: {
    fontSize: 14, 
    color: "#AD8EB3",
    padding: 60,
    marginBottom: -70
  },
  textoInfoProte: {
    fontSize: 14, 
    padding: 60,
    marginBottom: -100, 
    marginTop: -40
  },
  textoDescipcion: {
    fontSize: 14, 
    color: "#5B1D66",
    padding: 60,
    marginTop: -40, 
    marginBottom: -70
  },
  botonCircularAmarillo : {
        backgroundColor: colors.amarillo,
        borderColor: colors.blanco,
        borderWidth: 2,
        width:260,
        height:42,
        borderRadius: 25,
        alignSelf: "center",
      },
      botonCircularMorado2 : {
        backgroundColor: colors.moradoPrincipal,
        borderColor: colors.blanco,
        borderWidth: 2,
        width:105,
        height:42,
        borderRadius: 25,
        alignSelf: "center",
      },
      botonListaDonaciones : {
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
  appBar: {
    flex: 1, 
    justifyContent: "space-between",
    elevation: 0, 
    backgroundColor: colors.amarillo,
    padding: 50,
    marginTop: 52
  },
  titulo: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: "#5B1D66",
    padding: 40
  },

});


export default PerfilProtectora;