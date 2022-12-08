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

const PerfilProtectora = (props) => {

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
  const checkTipoUsuario_usuario = () => { 
    if (props.route.params.isUsuario) {
      return (
        <View style={styles.container}>
        <View style={styles.textContainerGmailTlf}>
            {checkImage()}
            <Text style={styles.textoNombreProte} >{protectora.nombre}</Text>
        </View>
      
        <View style={styles.containerInfoProte}>
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

        <View style={{marginTop: 630}}>
        <BotonAbrirURL url={protectora.url}>
          Página web
        </BotonAbrirURL>
        </View>

        <View style={{marginTop: -470}}>
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
      )
    } 
  }
  
  const checkTipoUsuario_protectora = () => { 
    if (!props.route.params.isUsuario) {
      return (
        <View style={styles.container}>
          <Appbar.Header style={styles.appBar}>
          <Appbar.Content title="" />
          <Appbar.Action icon="lead-pencil" size={30} onPress={() => {
                        props.navigation.navigate('ModificarProtectora', {userId: storedCredentials}) 
                      }} />
          <Appbar.Action icon="logout" size={30} onPress={clearLogin} />
          </Appbar.Header>

        <View style={styles.textContainerGmailTlf}>
            {checkImage()}
            <Text style={styles.textoNombreProte} >{protectora.nombre}</Text>
        </View>
      
        <View style={styles.containerInfoProte}>
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
        <TouchableOpacity 
                      onPress={() => {
                        props.navigation.navigate('ListaDonaciones', {userId: storedCredentials,  protectoraId:props.route.params.protectoraId}) 
                      }}
                      style={styles.botonCircularMorado2}>
                          <Text style={styles.botonTexto}>
                              Lista
                          </Text>
          </TouchableOpacity>

        <View style={{marginTop: 515}}>
        <BotonAbrirURL url={protectora.url}>
          Página web
        </BotonAbrirURL>
        </View>
    </View>
      )
    }
  }

  useEffect(() => {
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
            style={styles.botonCircularMorado} 
            onPress={handlePress} 
            >
              <Text style={styles.botonTexto}>Página web</Text>
          </TouchableOpacity>
};

const styles = StyleSheet.create({
  container: {
        flex: 1, 
        height: 2000, 
        backgroundColor: colors.amarillo 
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
  bottom: 258, 
  flex: 1
},
  textoNombreProte: {
    fontSize: 24,
    alignSelf: "center", 
    color: colors.blanco,
    fontWeight: 'bold', 
    marginBottom: 4, 
    marginTop: -190
  },
  containerInfoProte: {
    height: '68%',
    width: '100%',
    justifyContent: 'center',
    position: "absolute", 
    backgroundColor: colors.blanco,
    borderRadius: 35, 
    alignSelf: 'center', 
    bottom: -26, 
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
  botonCircularMorado : {
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

});


export default PerfilProtectora;