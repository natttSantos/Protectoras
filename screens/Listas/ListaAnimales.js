import React, {useState, useEffect} from "react"
import {ScrollView, View, StyleSheet, Text, TouchableOpacity, Image}  from 'react-native'
import {Avatar, ListItem} from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../../database/firebase";
import DropDownPicker from "react-native-dropdown-picker";
import { colors } from '../../components/Color';
 
const ListaAnimales = (props) => {
    const [loading, setLoading] = useState(true);
  
    // CÓDIGO LISTA ANIMALES //

    const [estado, setEstado] = useState({
      perroPressed: false,
      gatoPressed: false
    })

  
    const [animales, setAnimales] = useState([]);
    const [animalesACargar, setAnimalesACargar] = useState([]);
    const [protectoras, setProtectoras] = useState([])
    // const [imagenes, setImagenes] = useState([]);
    // const [imagenesACargar, setACargar] = useState([]);

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

    const cargarProtectoras = async () => {
      let protectorasAux = []
      const protect = await firebase.db.collection('protectoras').get()
      let i = protect.docs.length;
      
      protect.docs.map(doc => {
        firebase.st.ref(`imagesProtectora/${doc.data().fotoModificada}`).getDownloadURL().then((url) => {
          protectorasAux.push({...doc.data(), url: url, id: doc.id})
          i--
          if (i == 0)
            setProtectoras(protectorasAux)
        })
      })
    }

      useEffect(() => {
        if(props.route.params.filtrado == undefined){
        firebase.db.collection('animales').where("adoptado", "==", false).onSnapshot((querySnapshot) => {
            const listaAnimales = []
            let i = querySnapshot.docs.length

            querySnapshot.docs.forEach((doc) => {
                const {nombre, tipo, raza, sexo, edad} = doc.data()
                firebase.st.ref(`images/${nombre}`)
                .getDownloadURL().then(url => {
                  i--
                  listaAnimales.push({
                      id: doc.id,
                      nombre,
                      tipo,
                      raza,
                      sexo,
                      edad,
                      url: url
                    })
                    if (i == 0){
                      setAnimales(listaAnimales); setAnimalesACargar(listaAnimales); setLoading(false)}
                })
            });
        })}
      }, [])

      useEffect(() => {
        cargarProtectoras()
      },[])

      
    // useEffect(() => {
    //   cargarAnimalesDeFiltrado(); 
    // }, [animales])

    // useEffect(() => {
    //   setLoading(true)
    //   if(imagenes.length != 0) {
    //     actualizarImagenes()
    //     setLoading(false)
    //   } 
    // }, [animales])

    // useEffect(() => {
    //   cargarImagenes()
    // }, [animales])
      

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
      <View style={{marginTop: 54}}>
        <Text style={styles.titulo}>
          Nuestras protectoras
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {protectoras.map((protectora, index) => {
            return(
              <TouchableOpacity
              key={index} 
              onPress={() => props.navigation.navigate('PerfilProtectora', { protectoraId: protectora.id })}>
                <View style={styles.protectorasContainer}>
                  <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={{uri: protectora.url}} style={{height: 125, width: 116, borderTopLeftRadius: 17, borderTopRightRadius: 17}}/>
                  </View>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 14, fontFamily: 'DMSans', color: colors.moradoPrincipal}}>{protectora.nombre}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
      <View>
        
      <Text style={styles.titulo}>Animales en adopción</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20}}>
        <TouchableOpacity
        onPress={() => props.navigation.navigate('FiltradoAnimales', { animales: animales, onGoBack: (animalesFiltrado) => setAnimalesACargar(animalesFiltrado)})}
        style={styles.button}>
          <Text style={styles.buttonText}>
              Filtrar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => setAnimalesACargar(animales)}
        style={[styles.button, {backgroundColor: colors.moradoPrincipal}]}>
          <Text style={styles.buttonText}>
              Quitar Filtros
          </Text>
        </TouchableOpacity>
      </View>
      { animalesACargar.length == 0 ? <Text style ={{fontSize: 18.5, marginTop: 12, padding: 2, color: 'gray'}}>No hay animales para los filtros seleccionados {":("}</Text> : 
      animalesACargar.map((animal, index) => {
      return(

        <View key={animal.id} style={styles.animalContainer}>
          <View style={styles.imagenContainer}>
            <TouchableOpacity
            onPress={() => props.navigation.navigate('PerfilAnimal', { animalId: animal.id, userId: props.route.params.userId, esUsuario: true })}>
              <Image source={{uri: animal.url}} style={{width:100, height: 100, borderRadius: 50}} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.nombreContainer}>
              <Text style={styles.nombreTexto}>{animal.nombre}</Text>
              <Text>A</Text>
            </View>
            <View style={styles.descripcionSexoContainer}>
              <View style={styles.descripcionContainer}>
                <Text style={styles.descripcionTexto}>{animal.edad} años</Text>
                <Text style={styles.descripcionTexto}>{animal.nombre}</Text>
              </View>
              <View style={styles.sexoContainer}>
                <Image source={animal.sexo == 'Masculino' ? require('../../images/Masculino.png') : require('../../images/Femenino.png')}/>
              </View>
            </View>
          </View>
        </View>
                      
        // <ListItem key={animal.id}       
        // bottomDivider
        // onPress={() => {
        // props.navigation.navigate("PerfilAnimal", {
        // animalId: animal.id, userId: props.route.params.userId, esUsuario: true
        // });
        // }}
        // >
        // <Avatar 
        //    style = {styles.imagen}
        //    source={{uri: imagenes[index]}}
        // />
        // <ListItem.Chevron />
        //   <ListItem.Content 
        //     style={styles.lista}>
        //       <ListItem.Title 
        //       style={{fontWeight: "bold"}}> 
        //       {animal.nombre} 
        //       </ListItem.Title>
        //     <ListItem.Subtitle> {animal.descripcion} </ListItem.Subtitle>
        //   </ListItem.Content>
        // </ListItem>
        )})
      }

  </View>
  </ScrollView>

    )

 }

 const styles = StyleSheet.create({
  container: {
      flex: 2, 
      padding: 15, 
      height: 3000
  },
  protectorasContainer: {
    height: 170,
    width: 120,
    marginHorizontal: 20,
    borderRadius: 20,
    borderColor: colors.moradoPrincipal,
    borderWidth: 2,
    flex: 1
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
    backgroundColor: colors.amarillo,
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
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
      color: colors.moradoPrincipal,
      fontSize: 32,
      fontFamily: 'DMSans',
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
    fontSize: 16,
    color: colors.blanco,
    fontFamily: 'DMSans',
    alignSelf: "center", 
  },
  animalContainer: {
    flex: 1,
    width: 320,
    height: 140,
    borderColor: colors.moradoPrincipal,
    borderWidth: 2,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row'
  },
  imagenContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    flex: 3,
  },
  nombreContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  nombreTexto: {
    fontFamily: 'DMSans',
    fontSize: 20,
    color: colors.negro
  },
  descripcionContainer: {
    flex: 5,
    justifyContent: 'flex-start',
    paddingLeft: 20
  },
  descripcionTexto: {
    fontFamily: 'InterRegular',
    fontSize: 16,
    color: colors.negro
  },
  sexoContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  descripcionSexoContainer: {
    flex: 1,
    flexDirection: 'row',
  }
});




export default ListaAnimales; 

