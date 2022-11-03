import React, {useState, useEffect} from "react"
import {ScrollView, View, StyleSheet, Text}  from 'react-native'
import {Avatar, ListItem} from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../../database/firebase";
 
const ListaAnimales = (props) => {

    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    let imagenesAux = []
  

  
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
                console.log("si entro")
            })
        }
        else {
            console.log("no entro")
            setLoading(false)
        }
    }
    
      useEffect(() => {
        cargarImagenes()
        if(estado.gatoPressed)
          setAnimalesACargar(animales.filter(animal => animal.tipo === 'Gato'))
        else if(estado.perroPressed)
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
          onPress={() => {handleColorChange('gato')}}
          style={[styles.button, estado.gatoPressed ? {backgroundColor: 'blue'} : {backgroundColor: 'white'}]}>
            <Text style={styles.buttonText}>
                GATO
            </Text>
        </TouchableOpacity>
      </View>

      { animalesACargar.map((animal, index) => {

      return(
                      
        <ListItem key={animal.id}       
        bottomDivider
        onPress={() => {
        props.navigation.navigate("PerfilAnimal", {
        animalId: animal.id, registrado: true
        });
        }}
        >
        <Avatar 
           style = {styles.imagen}
           source={{uri: imagenes[index]}}
        />
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




export default ListaAnimales; 

