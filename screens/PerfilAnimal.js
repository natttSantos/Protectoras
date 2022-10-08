import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

import firebase from "../database/firebase";

const PerfilAnimal = (props) => {
  const initialState = {
    nombre:"",
    raza:"",
    sexo:"",
    edad:"años",
    descripcion:"",
    fecha_nacimiento:""
  };

  const [animal, setAnimal] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const handleTextChange = (value, prop) => {
    setAnimal({ ...animal, [prop]: value });
  };

  const getAnimalById = async (id) => {
    const dbRef = firebase.db.collection("animales").doc(id);
    const doc = await dbRef.get();
    const animal = doc.data();
    setAnimal({ ...animal, id: doc.id });
    setLoading(false);
  };

  const updateAnimal = async () => {
    const animalRef = firebase.db.collection("animales").doc(animal.id);
    await animalRef.set({
      nombre: animal.nombre,
      edad: animal.edad.toString()+" años",
      raza: animal.raza,
      sexo: animal.sexo,
      fecha_nacimiento: animal.fecha_nacimiento,
      descripcion: animal.descripcion,
    });
    setAnimal(initialState);
    props.navigation.navigate("ListaAnimales");
  };

  useEffect(() => {
    getAnimalById(props.route.params.animalId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <TextInput
          placeholder="Nombre"
          autoCompleteType="nombre"
          style={styles.inputGroup}
          value={animal.nombre}
          onChangeText={(value) => handleTextChange(value, "nombre")}
        />
      </View>
      <View>
        <TextInput
          autoCompleteType="Edad"
          placeholder="Edad"
          style={styles.inputGroup}
          value={animal.edad.toString()+ " años"}
          onChangeText={(value) => handleTextChange(value, "edad")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Raza"
          autoCompleteType="raza"
          style={styles.inputGroup}
          value={animal.raza}
          onChangeText={(value) => handleTextChange(value, "raza")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Descripcion"
          autoCompleteType="descripcion"
          style={styles.inputGroup}
          value={animal.descripcion}
          onChangeText={(value) => handleTextChange(value, "descripcion")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Sexo"
          autoCompleteType="sexo"
          style={styles.inputGroup}
          value={animal.sexo}
          onChangeText={(value) => handleTextChange(value, "sexo")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Fecha de nacimiento"
          autoCompleteType="fecha_nacimiento"
          style={styles.inputGroup}
          value={animal.fecha_nacimiento}
          onChangeText={(value) => handleTextChange(value, "fecha_nacimiento")}
        />
      </View>
    </ScrollView>
  );
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
});

export default PerfilAnimal;