import firebase from '../database/firebase.js';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput
} from "react-native";

const BOTTOM_APPBAR_HEIGHT = 80;
const MEDIUM_FAB_HEIGHT = 56;

const SesionUsuario = (props) => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  const initialState = {
    usuario: "",
    email: "" , 
    telefono: "", 
}
const [usuario, setUsario] = useState(initialState);
const [loading, setLoading] = useState(true);

const handleTextChange = (value, prop) => {
  setUsario({ ...usuario, [prop]: value });
};

const getUsuarioById = async (id) => {
  const dbRef = firebase.db.collection("users").doc(id);
  const doc = await dbRef.get();
  const usuario = doc.data();
  console.log(usuario)
  setUsario({ ...usuario, id: doc.id });
  setLoading(false);
};

useEffect(() => { 
  getUsuarioById(props.route.params.userId); 
}, []);

if (loading) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#9E9E9E" />
    </View>
  );
}
  return (
    <Appbar
      style={[
        styles.bottom,
        {
          height: BOTTOM_APPBAR_HEIGHT + bottom
        },
      ]}
      safeAreaInsets={{ bottom }}
    >
      <Appbar.Content title={usuario.usuario} />
      <Appbar.Action icon="home" onPress={() => {}} />
      <Appbar.Action icon="plus-circle" onPress={() => {}} />
      <Appbar.Action icon="chat" onPress={() => {}} />
      <Appbar.Action icon="account" onPress={() => { props.navigation.navigate('PerfilUsuario', {usuarioId: usuario})  }} />
    </Appbar>
    
  );
};

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: 20,
  },
});


export default SesionUsuario;