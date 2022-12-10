import React, {useState, useEffect} from "react"
import {ScrollView, View, StyleSheet, Text, TouchableOpacity}  from 'react-native'
import {Avatar, ListItem} from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../../database/firebase";
import { colors } from '../../components/Color'
 
const FiltradoAnimales = (props) => {  
    var protectorasFiltrado_id = []; 
    var protectoraSelected_localizacion; 
    var localizaciones_selected = []; 

    const [loading, setLoading] = useState(false);
    const [animales, setAnimales] = useState([]);

    // CÓDIGO LISTA ANIMALES //

    const [estado, setEstado] = useState({
      perroPressed: false,
      gatoPressed: false, 
      comunidadValencianaPressed: false, 
      alicantePressed: false, 
      cuencaPressed: false
    })

    //DROPDOWNPICKER
    const [protectoras, setProtectoras] = useState([]);
    const [tipoOpen, setTipoOpen] = useState(false);
    const [tipoValue, setTipoValue] = useState(null);
    const [tipo, setTipo] = useState([]);

    const getProtectoras = async () => {
      firebase.db.collection('protectoras').onSnapshot((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
            const {url, nombre, localizacion, email, direccion, descripcion, fotoModificada} = doc.data()
            protectoras.push({
                id: doc.id,
                url,
                nombre,
                localizacion,
                email,
                direccion,
                descripcion, 
                fotoModificada
            })
        });
        setProtectoras(protectoras)
        cargarProtectorasMenu(protectoras)
    });
    }

    const cargarProtectorasMenu = (protectoras) => {
      let protectorasMenu = [] 
      protectoras.map((protectora => protectorasMenu.push({
        value: protectora.nombre, 
        label: protectora.nombre, 
      })))
      setTipo(protectorasMenu); 
    }
    
    const getProtectorasFiltrado = () =>{
      firebase.db.collection('protectoras').onSnapshot((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
            const {url, nombre, localizacion, email, direccion, descripcion, fotoModificada} = doc.data()
            protectoras.push({
                id: doc.id,
                url,
                nombre,
                localizacion,
                email,
                direccion,
                descripcion, 
                fotoModificada
            })
        });
        setProtectoras(protectoras)
        for (let i=0; i<protectoras.length; i++){
          for(let j = 0; j<localizaciones_selected.length; j++){
            if (protectoras[i].localizacion == localizaciones_selected[j]){
              protectorasFiltrado_id.push(protectoras[i].id);  
            } 
          }
      }
          
    }
      )}

    const cargarFiltros = () => {
      var animalesFiltrado = []; 
      var noHayAnimalesFiltrado = ""; 
      seleccionMultiple_Localizacion(); 
      getProtectorasFiltrado();

      setTimeout(() => {
          if (estado.gatoPressed){ 
            if(localizaciones_selected.length != 0){
              animalesFiltrado = animales.filter(animal => animal.tipo === 'Gato' && protectorasFiltrado_id.includes(animal.id_protectora));   
            }
            if(localizaciones_selected.length == 0){
              animalesFiltrado = animales.filter(animal => animal.tipo === 'Gato');   
            }
          }
          
          if(estado.perroPressed){
            if(localizaciones_selected.length != 0){
              animalesFiltrado = animales.filter(animal => animal.tipo === 'Perro'  && protectorasFiltrado_id.includes(animal.id_protectora));
            } 
            if(localizaciones_selected.length == 0){
              animalesFiltrado = animales.filter(animal => animal.tipo === 'Perro');
            }
          } 


          if (!estado.gatoPressed && !estado.perroPressed) { 
            if(localizaciones_selected.length != 0){
              animalesFiltrado = animales.filter(animal => protectorasFiltrado_id.includes(animal.id_protectora));    
            }
            if(localizaciones_selected.length == 0){
              animalesFiltrado = animales;     
            }
        }  
        setLoading(false);

        if(animalesFiltrado.length == 0){
          noHayAnimalesFiltrado = "No hay animales para los filtros seleccionados :("; 
        }
        props.route.params.onGoBack(animalesFiltrado)
        props.navigation.goBack()
        //props.navigation.navigate('ListaAnimales', {animalesFiltrado: animalesFiltrado, filtrado: true, noHayAnimalesFiltrado: noHayAnimalesFiltrado});
      }, 1000);       
    }

    const seleccionMultiple_Localizacion = () => {
      if(estado.comunidadValencianaPressed){ 
        localizaciones_selected.push('Comunidad Valenciana'); 
        console.log("paso1")
      }
      if(estado.alicantePressed){ 
        localizaciones_selected.push('Alicante');
        console.log("paso2")
      }
      if(estado.cuencaPressed){ 
        localizaciones_selected.push('Cuenca');
        console.log("paso3")
      }
    }


      useEffect(() => {
        getProtectoras(); 

      }, [])

       useEffect(() =>{
        setAnimales(props.route.params.animales)
       }, [animales])

    const handleChangeText = (nombre, value) => {
      setEstado({...estado, [nombre]: value}); 
    }; 

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
    const handleColorChangeLocalizacion = (localizacion) => {
          if(localizacion == 'comunidadValenciana'){
            setEstado({ ...estado, ['comunidadValencianaPressed']: !estado.comunidadValencianaPressed});
          } if (localizacion == 'alicante'){
            setEstado({ ...estado, ['alicantePressed']: !estado.alicantePressed});  
          } if (localizacion == 'cuenca'){
            setEstado({ ...estado, ['cuencaPressed']: !estado.cuencaPressed});  
          }
    };

    if(loading) {
      return(
          <View>
              <ActivityIndicator />
          </View>
      )
  }
  return (
    <ScrollView nestedScrollEnabled={true}
    style={styles.container}>
      <Text style={styles.titulo}>
        Filtros
      </Text>
      <View style={styles.container}>

      <View style ={{borderTopWidth: 1.7,  borderTopColor: '#cccccc', marginTop: 15}}>
      <Text style={styles.text}>
        Tipo animal
      </Text>
      </View>
      <View style ={{flexDirection:'row', justifyContent: 'space-between', width:90}}>
      <TouchableOpacity
          onPress={() => {handleColorChange('perro')}}
          style={[styles.buttonGatoPerro, estado.perroPressed ? {backgroundColor: colors.amarillo} : {backgroundColor: colors.blanco}]}>
            <Text style={[styles.buttonText, estado.perroPressed ? {color: colors.blanco} : {color: colors.amarillo}]}>
                PERRO
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {handleColorChange('gato')}}
          style={[styles.buttonGatoPerro, estado.gatoPressed ? {backgroundColor: colors.amarillo} : {backgroundColor: colors.blanco}]}>
            <Text style={[styles.buttonText, estado.gatoPressed ? {color: colors.blanco} : {color: colors.amarillo}]}>
                GATO
            </Text>
        </TouchableOpacity>
        </View>

        
      <View style ={{borderTopWidth: 1.7,  borderTopColor: '#cccccc', marginTop: 15}}>
      <Text style={styles.text}>
        Localización
      </Text>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
            onPress={() => {handleColorChangeLocalizacion('comunidadValenciana')}}
            style={[styles.buttonLocalizacion, estado.comunidadValencianaPressed ? {borderColor: colors.moradoPrincipal} : {borderColor: colors.moradoSecundario}]}>
              <Text style={[styles.buttonText, estado.comunidadValencianaPressed ? {color: colors.moradoPrincipal} : {color: colors.moradoSecundario}]}>
                  Valencia
              </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {handleColorChangeLocalizacion('alicante')}}
            style={[styles.buttonLocalizacion, estado.alicantePressed ? {borderColor: colors.moradoPrincipal} : {borderColor: colors.moradoSecundario}]}>
              <Text style={[styles.buttonText, estado.alicantePressed ? {color: colors.moradoPrincipal} : {color: colors.moradoSecundario}]}>
                  Alicante
              </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {handleColorChangeLocalizacion('cuenca')}}
            style={[styles.buttonLocalizacion, estado.cuencaPressed ? {borderColor: colors.moradoPrincipal} : {borderColor: colors.moradoSecundario}]}>
              <Text style={[styles.buttonText, estado.cuencaPressed ? {color: colors.moradoPrincipal} : {color: colors.moradoSecundario}]}>
                  Cuenca
              </Text>
          </TouchableOpacity>
        </ScrollView>
      
      <TouchableOpacity 
                    onPress={() => cargarFiltros()}
                    style={styles.button}>
                        <Text style={styles.buttonTextFinal}>
                            Aplicar filtros 
                        </Text>
                </TouchableOpacity>
  </View>
  </ScrollView>

    )

 }

 const styles = StyleSheet.create({
  container: {
      flex: 2, 
      padding: 20, 
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
  buttonGatoPerro : {
    width:110,
    height: 40, 
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.amarillo,
    borderWidth: 2,
    padding: 6,
    marginTop: 20,
    marginLeft: 17, 
    marginBottom: 20
  }, 
  buttonLocalizacion : {
    width:110,
    height: 40, 
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.moradoSecundario,
    padding: 6,
    marginTop: 20,
    marginLeft: 17, 
    marginBottom: 20
  },picker : {
    width:160,
    elevation: 8,
    marginTop: 20,
    marginLeft: 17, 
    marginBottom: 20
  }, button : {
    backgroundColor: colors.amarillo,
    padding: 10,
    marginTop: 40,
    borderRadius: 20
},
  buttonTextFinal: {
    fontSize: 18,
    color: colors.blanco,
    fontFamily: 'DMSans',
    alignSelf: "center",   
}, 

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  titulo: {
      margin: 12,
      marginTop: 40,
      padding: 10,
      fontSize: 40,
      fontFamily: 'DMSans',
      color: colors.moradoPrincipal,
      textAlign: "left"
  },
  lista: {
      margin: 12,
      padding: 10
  },
  imagen: {
      height: 60,
      width: 60
  },text: {
    fontSize: 20,
    color: colors.moradoPrincipal,
    fontFamily: 'DMSans', 
    marginTop: 20,
    marginLeft: 20
  }, 
  buttonText: {
    fontSize: 15,
    color: colors.amarillo,
    fontFamily: 'DMSans',
    alignSelf: "center",
    textTransform: "uppercase"    
  }
});




export default FiltradoAnimales; 

