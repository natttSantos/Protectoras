import React, {useState, useEffect} from "react"
import {ScrollView, View, StyleSheet, Text, TouchableOpacity}  from 'react-native'
import {Avatar, ListItem} from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../../database/firebase";
import DropDownPicker from "react-native-dropdown-picker";
 
const ListaAnimales = (props) => {

    const [loading, setLoading] = useState(true);
  
    // CÓDIGO LISTA ANIMALES //

    const [estado, setEstado] = useState({
      perroPressed: false,
      gatoPressed: false
    })

  
    const [animales, setAnimales] = useState([]);
    const [imagenes, setImagenes] = useState([]);

    const cargarImagenes = async () => {
        let i = animales.length
        let imagenesAux = []

        if(i > 0){
          animales.map(async (animal, index) => {
            await firebase
              .st
              .ref(`images/${animal.nombre}`)
              .getDownloadURL().then(function (url) {
                i--;
                imagenesAux[index] = url;
                setImagenes(...imagenes, imagenesAux);
                if (i == 0) 
                  setLoading(false);
              });
          })
        }
        else {
             setLoading(false)
        }
    }

    const cargarAnimalesDeFiltrado = () => {
      if(props.route.params.filtrado != undefined){
        setAnimales(props.route.params.animalesFiltrado); 
      }
    }

    const actualizarImagenes = () => {
      const imagenesAux = []

      animales.map((animal) => {
        const index = animales.findIndex(animalin => animalin == animal)
        imagenesAux.push(imagenes[index])
      })
      setImagenes(imagenesAux)
      
    }

      useEffect(() => {
        if(props.route.params.filtrado == undefined){
        firebase.db.collection('animales').onSnapshot((querySnapshot) => {
            const listaAnimales = []

            querySnapshot.docs.forEach((doc) => {
                const {nombre, descripcion, tipo, raza, sexo, fecha_nacimiento, id_protectora, 
                adoptado, peso, edad, nivelActividad, vacunado, microchip} = doc.data()
                listaAnimales.push({
                    id: doc.id,
                    nombre,
                    tipo,
                    raza,
                    sexo,
                    descripcion,
                    fecha_nacimiento, 
                    id_protectora, 
                    adoptado, 
                    peso, 
                    edad, 
                    nivelActividad, 
                    vacunado, 
                    microchip
                })
            });
            setAnimales(listaAnimales)
        })}
      }, [])

      
    useEffect(() => {
      cargarAnimalesDeFiltrado(); 
    }, [animales])

    useEffect(() => {
      setLoading(true)
      if(imagenes.length != 0) {
        actualizarImagenes()
        setLoading(false)
      } 
    }, [animales])

    useEffect(() => {
      cargarImagenes()
    }, [animales])
      

    if(loading) {
      return(
          <View>
              <ActivityIndicator />
          </View>
      )
  }
  return (
    <ScrollView 
    style={styles.container}>
      <Text style={styles.titulo}>
        Lista Animales
      </Text>
      <View style={styles.container}>
      <TouchableOpacity
          onPress={() => props.navigation.navigate('FiltradoAnimales', {animales: animales})}
          style={styles.button}>
            <Text style={styles.buttonText}>
                Filtrar
            </Text>
      </TouchableOpacity>
      

      

      { animales.map((animal, index) => {
      return(
                      
        <ListItem key={animal.id}       
        bottomDivider
        onPress={() => {
        props.navigation.navigate("PerfilAnimal", {
        animalId: animal.id, userId: props.route.params.userId, esUsuario: true
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

  </View>
  </ScrollView>

    )

 }

 const styles = StyleSheet.create({
  container: {
      flex: 2, 
      padding: 35, 
      height: 3000
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
    elevation: 3,
    backgroundColor: "#ffebcd",
    padding: 10,
    marginTop: 20,
    marginBottom: 20, 
    width:100
}, picker : {
    width:160,
    elevation: 8,
    marginTop: 20,
    marginLeft: 17, 
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

