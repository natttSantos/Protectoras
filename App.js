import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 

import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import { CredentialsContext } from './components/CredentialsContext';
import RootStack from './navigators/RootStack';

const Stack = createNativeStackNavigator()

 //Importamos los tres componentes creados: 
import InicioSesion from './screens/InicioSesion'
import RegistrarUsuario from './screens/Altas/RegistrarUsuario'
import PrincipalScreen from './screens/PrincipalScreen'
import ListaProtectoras from './screens/Listas/ListaProtectoras'
import AltaProtectora from './screens/Altas/AltaProtectora'
import ListaAnimales from './screens/Listas/ListaAnimales';
import PerfilAnimal from './screens/Perfiles/PerfilAnimal';
import PerfilUsuario from './screens/Perfiles/PerfilUsuario';
import PerfilProtectora from './screens/Perfiles/PerfilProtectora';
import AltaAdoptar from './screens/Altas/AltaAdoptar';
import UserDetailScreen from './screens/UserDetailScreen';
import Home from './screens/Home';
import RegistrarAnimal from './screens/Altas/RegistrarAnimal';
import AltaGlobal from './screens/Altas/AltaGlobal';
import PerfilAdoptar from './screens/Perfiles/PerfilAdoptar';
import SesionUsuario from './screens/Sesiones/SesionUsuario';
import SesionProtectora from './screens/Sesiones/SesionProtectora';
import FechaNacimientoAnimal from './screens/Altas/FechaNacimientoAnimal';
import ModificarProtectora from './screens/Modificar/ModificarProtectora';
import ModificarUsuario from './screens/Modificar/ModificarUsuario';
import MapaAnimalEncontrado from './screens/Mapa/MapaAnimalEncontrado';
import MapaAnimalEncontradoProtectora from './screens/Mapa/MapaAnimalEncontradoProtectora';
import InformacionSolicitud from './screens/InformacionSolicitud';


import FiltradoAnimales from './screens/Listas/FiltradoAnimales';


function MyStack (){
  return (
    <Stack.Navigator>
      <Stack.Screen name="PrincipalScreen" component={PrincipalScreen} options={{headerShown: false}}/>
      <Stack.Screen name="AltaProtectora" component={AltaProtectora} />
      <Stack.Screen name="ListaAnimales" component={ListaAnimales} />
      <Stack.Screen name="FiltradoAnimales" component={FiltradoAnimales} />
      <Stack.Screen name="ListaProtectoras" component={ListaProtectoras}/>
      <Stack.Screen name="InicioSesion" component={InicioSesion} />
      <Stack.Screen name="RegistrarUsuario" component={RegistrarUsuario} />
      <Stack.Screen name="PerfilAnimal" component={PerfilAnimal} />
      <Stack.Screen name="SesionUsuario" component={SesionUsuario} />
      <Stack.Screen name="SesionProtectora" component={SesionProtectora} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AltaGlobal" component={AltaGlobal} />
      <Stack.Screen name="RegistrarAnimal" component={RegistrarAnimal} />
      <Stack.Screen name="FechaNacimientoAnimal" component={FechaNacimientoAnimal} />
      <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />
      <Stack.Screen name="PerfilProtectora" component={PerfilProtectora} />
      <Stack.Screen name="AltaAdoptar" component={AltaAdoptar} />
      <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} options={{title: 'Detalles'}} />
      <Stack.Screen name="PerfilAdoptar" component={PerfilAdoptar} />
      <Stack.Screen name="ModificarProtectora" component={ModificarProtectora} />
      <Stack.Screen name="ModificarUsuario" component={ModificarUsuario} />
      <Stack.Screen name="MapaAnimalEncontrado" component={MapaAnimalEncontrado} />
      <Stack.Screen name="InformacionSolicitud" component={InformacionSolicitud} />
      <Stack.Screen name="MapaAnimalEncontradoProtectora" component={MapaAnimalEncontradoProtectora} />
    </Stack.Navigator>
  )
}
export default function App() {
  
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState(""); 

  const checkLogInCredentials = () => {
    AsyncStorage
      .getItem('getPetCredentials')
      .then((result) => {
        console.log(result)
        if (result !== null) {
          setStoredCredentials(result)
        }
        else { 
          setStoredCredentials(null)
        }
      })
      .catch(error => console.log(error)) 
  }

  if (!appReady) {
    return (
      <AppLoading 
        startAsync={checkLogInCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    )
  }

  return (
    <CredentialsContext.Provider value={{storedCredentials, setStoredCredentials}}>
        <RootStack/>
    </CredentialsContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
