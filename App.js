import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 

const Stack = createNativeStackNavigator()

 //Importamos los tres componentes creados: 
import InicioSesion from './screens/InicioSesion'
import RegistrarUsuario from './screens/RegistrarUsuario'
import PrincipalScreen from './screens/PrincipalScreen'
import ListaProtectoras from './screens/ListaProtectoras'
import AltaProtectora from './screens/AltaProtectora'
import ListaAnimales from './screens/ListaAnimales';
import PerfilAnimal from './screens/PerfilAnimal';
import SesionUsuario from './screens/SesionUsuario';
import PerfilUsuario from './screens/PerfilUsuario';
import PerfilProtectora from './screens/PerfilProtectora';
import AltaAdoptar from './screens/AltaAdoptar';



function MyStack (){
  return (
    <Stack.Navigator>
      <Stack.Screen name="PrincipalScreen" component={PrincipalScreen}/>
      <Stack.Screen name="AltaProtectora" component={AltaProtectora} />
      <Stack.Screen name="ListaAnimales" component={ListaAnimales} />
      <Stack.Screen name="ListaProtectoras" component={ListaProtectoras}/>
      <Stack.Screen name="InicioSesion" component={InicioSesion} />
      <Stack.Screen name="RegistrarUsuario" component={RegistrarUsuario} />
      <Stack.Screen name="PerfilAnimal" component={PerfilAnimal} />
      <Stack.Screen name="SesionUsuario" component={SesionUsuario} />
      <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />
      <Stack.Screen name="PerfilProtectora" component={PerfilProtectora} />
      <Stack.Screen name="AltaAdoptar" component={AltaAdoptar} />
    </Stack.Navigator>
  )
}
export default function App() {
  return (
    <NavigationContainer> 
      <MyStack/>  
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
