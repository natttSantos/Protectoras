
import firebase from '../database/firebase.js';
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text
} from "react-native";
//import { TouchableOpacity } from 'react-native-gesture-handler';
import {Avatar, ListItem} from "react-native-elements";
 
const Home = (props) => {
    
  const initialState = {
        nombre: ""  
    }
    const [usuario, setUsario] = useState(initialState);
    const [loading, setLoading] = useState(true);
  
    const getUsuarioById = async (id) => {
      let dbRef = null; 
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

      const [estado, setEstado] = useState({
        perroPressed: false,
        gatoPressed: false
      })

      const [animales, setAnimales] = useState([]);
      const [animalesACargar, setAnimalesACargar] = useState([]);

      useEffect(() => {
          firebase.db.collection('animales').onSnapshot((querySnapshot) => {
              const listaAnimales = []
  
              querySnapshot.docs.forEach((doc) => {
                  const {nombre, descripcion, tipo} = doc.data()
                  listaAnimales.push({
                      id: doc.id,
                      nombre,
                      descripcion,
                      tipo
                  })
              });
              setAnimales(listaAnimales)
              setAnimalesACargar(listaAnimales)
          })
      }, [])

      useEffect(() => {
        if(estado.gatoPressed)
          setAnimalesACargar(animales.filter(animal => animal.tipo == 'Gato'))
        if(estado.perroPressed)
          setAnimalesACargar(animales.filter(animal => animal.tipo == 'Perro'))
        else
          setAnimalesACargar(animales)
      }, [estado])
      

    const handleColorChange = (animal) => {
      if(animal == 'perro'){
        if(estado.gatoPressed && !estado.perroPressed)
          setEstado({ ...estado, ['perroPressed']: !estado.perroPressed, ['gatoPressed']: !estado.gatoPressed});
        else
          setEstado({ ...estado, ['perroPressed']: !estado.perroPressed});}
      else { 
        if(estado.perroPressed && !estado.gatoPressed)
          setEstado({ ...estado, ['gatoPressed']: !estado.gatoPressed, ['perroPressed']: !estado.perroPressed});
        else
          setEstado({ ...estado, ['gatoPressed']: !estado.gatoPressed});}
    };

  return (
    <ScrollView style={styles.container}>
      <Text style = {styles.texto} >
      Bienvenid@, {usuario.nombre}
      </Text>
  
      <Text style={styles.titulo}>
        Lista Animales
      </Text>
      <View style ={{flexDirection:'row', justifyContent: 'space-between', width:150}}>
      <TouchableOpacity
          onPress={() => {handleColorChange('perro')}}
          style={[styles.button, estado.perroPressed ? {backgroundColor: 'blue'} : {backgroundColor: 'white'}]}>
            <Text style={styles.buttonText}>
                PERRO
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleColorChange('gato')}
          style={[styles.button, estado.gatoPressed ? {backgroundColor: 'blue'} : {backgroundColor: 'white'}]}>
            <Text style={styles.buttonText}>
                GATO
            </Text>
        </TouchableOpacity>
      </View>

      { animalesACargar.map((animal) => {
                  
      return(
                      
        <ListItem key={animal.id} 
              
        bottomDivider
        onPress={() => {
        props.navigation.navigate("PerfilAnimal", {
        animalId: animal.id, registrado: true,
        userId: props.route.params.userId,
        });
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
  button : {
    elevation: 8,
    padding: 10,
    marginTop: 20,
    marginBottom: 20
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
  },
  buttonText: {
    fontSize: 14,
    colors: "#ffffff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"    
  }
});




export default Home; 

