
import firebase from '../database/firebase.js';
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  Text
} from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Avatar, ListItem} from "react-native-elements";
 
const Home = (props) => {
    
  const initialState = {
        nombre: ""  
    }
    const [usuario, setUsario] = useState(initialState);
    const [loading, setLoading] = useState(true);
  
    const handleTextChange = (value, prop) => {
      setUsario({ ...usuario, [prop]: value });
    };
  
    const getUsuarioById = async (id) => {
      dbRef = null; 
      if (props.route.params.isUsuario == false){
        dbRef = firebase.db.collection("protectoras").doc(id);
      } else{
        dbRef = firebase.db.collection("users").doc(id);  
      }
      const doc = await dbRef.get();
      const usuario = doc.data();
      setUsario({ ...usuario, id: doc.id });
      setLoading(false);
    };
  
    useEffect(() => { 
      getUsuarioById(props.route.params.userId); 
    }, []);
  
    // CÓDIGO LISTA ANIMALES //


      const initialStatee = {
        imageFirebase:"",
        staet :""
        
      };

      const [cosas, setState] = useState(initialStatee);

      const [animales, setProtectoras] = useState([]);
      const URLAnimal = "";
      var state = "";
      useEffect(() => {
          firebase.db.collection('animales').onSnapshot((querySnapshot) => {
              const listaAnimales = []
  
              querySnapshot.docs.forEach((doc) => {
                  const {nombre, raza, sexo, edad, descripcion, fecha_nacimiento} = doc.data()
                  listaAnimales.push({
                      id: doc.id,
                      nombre,
                      raza,
                      sexo,
                      edad,
                      descripcion,
                      fecha_nacimiento
                  })
              });
              setProtectoras(listaAnimales)
          })
      })
  
      
      const loadImage = async () => {
        console.log(p);
        firebase
        .st
        .ref(`images/${animal}`)
        .getDownloadURL().then(function(url) {
        setState({
         url
      });
    });
  
    };
  
  
  
        const checkImage = () => {
          const { imageFirebase } = cosas;
          console.log(imageFirebase);
          if (cosas != "") {
            return (
              <Avatar
                  style={styles.imagen}
                  rounded
                  source={{uri: imageFirebase}} />
            );
          }
          return null;
        };
      

 return (
  <ScrollView style={styles.container}>
 
    <Text style = {styles.texto} >
        Bienvenido, {usuario.nombre}
    </Text>
 
    <Text style={styles.titulo}>
       Lista Animales
    </Text>
    { animales.map((animal) => {
   // uploadImage(animal.nombre);
   //  {loadImage(animal.nombre)}
                
    return(
                    
      <ListItem key={animal.id} 
            
      bottomDivider
      onPress={() => {
      props.navigation.navigate("PerfilAnimal", {
      animalId: animal.id, registrado: true,
      userId: props.route.params.userId,
      });
      console.log(props.route.params.userId + "        aaa");
      }}
      >
      <ListItem.Chevron />
        <ListItem.Content 
          style={styles.lista}>
            <ListItem.Title 
            style={{fontWeight: "bold"}}> 
            {animal.nombre} 
            </ListItem.Title>
          <ListItem.Subtitle> {animal.descripcion} </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
      )})
    }


</ScrollView>

  )

 }

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  image : {
    height : 250, 
    width : 250,
    marginBottom : 15
  },
  texto: {
    fontSize : 20,
    padding : 10,
    color: 'blue',
    fontWeight: "bold", 
    textAlign: 'right'
  }, 
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  titulo: {
      margin: 12,
      padding: 10,
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: "left"
  },
  lista: {
      margin: 12,
      padding: 10
  },
  imagen: {
      height: 60,
      width: 60
  }
});




export default Home; 

