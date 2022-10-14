
import React from "react";
import firebase from '../database/firebase.js';
import {View, Text, StyleSheet, ScrollView} from "react-native";

let nombreUsuario, email, telefono; 


const PerfilUsuario = (props) => {
    const initialState = {
        nombre: "",
        email: "" , 
        telefono: "", 
    }
    const [animal, setUsario] = useState(initialState);
    const [loading, setLoading] = useState(true);

    const handleChangeText = (value, prop) => {
        setUsario({...usuario, [prop]: value}); 
    }; 
    const getUserById = async (id) => {
        const dbRef = firebase.db.collection("users").doc(id);
        const doc = await dbRef.get();
        const animal = doc.data();
        setUsuario({ ...animal, id: doc.id });
        setLoading(false);
      };
 return (
    <ScrollView style={styles.container}>

<     View>
         <Image source={require('../images/gatitos.jpg')} style={styles.image}/>
      </View>
      <View>
        <TextInput
          placeholder="Nombre"
          autoCompleteType="nombre"
          style={styles.inputGroup}
          value={"Nombre: "+animal.nombre}
          onChangeText={(value) => handleTextChange(value, "nombre")}
        />
      </View>
      <View>
        <TextInput
          autoCompleteType="Edad"
          placeholder="Edad"
          style={styles.inputGroup}
          value={"Edad: "+animal.edad.toString()+ " años"}
          onChangeText={(value) => handleTextChange(value, "edad")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Raza"
          autoCompleteType="raza"
          style={styles.inputGroup}
          value={"Raza: "+animal.raza}
          onChangeText={(value) => handleTextChange(value, "raza")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Sexo"
          autoCompleteType="sexo"
          style={styles.inputGroup}
          value={"Sexo: "+animal.sexo}
          onChangeText={(value) => handleTextChange(value, "sexo")}
        />
      </View> 
    </ScrollView>
  );
    
;
 }; 



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
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
    height : 250, 
    width : 250
}
});


export default PerfilUsuario; 