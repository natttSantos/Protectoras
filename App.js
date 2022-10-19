import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 

const Stack = createNativeStackNavigator()

 //Importamos los tres componentes creados: 
import InicioSesion from './screens/InicioSesion'
import RegistrarUsuario from './screens/Altas/RegistrarUsuario'
import PrincipalScreen from './screens/PrincipalScreen'
import ListaProtectoras from './screens/Listas/ListaProtectoras'
import AltaProtectora from './screens/Altas/AltaProtectora'
import ListaAnimales from './screens/Listas/ListaAnimales';
import PerfilAnimal from './screens/Perfiles/PerfilAnimal';
import SesionUsuario from './screens/Sesiones/SesionUsuario';
import PerfilUsuario from './screens/Perfiles/PerfilUsuario';
import PerfilProtectora from './screens/Perfiles/PerfilProtectora';
import AltaAdoptar from './screens/Altas/AltaAdoptar';
import UserDetailScreen from './screens/UserDetailScreen';
import Home from './screens/Home';
import RegistrarAnimal from './screens/Altas/RegistrarAnimal';
import AltaGlobal from './screens/Altas/AltaGlobal';
import PerfilAdoptar from './screens/Perfiles/PerfilAdoptar';



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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AltaGlobal" component={AltaGlobal} />
      <Stack.Screen name="RegistrarAnimal" component={RegistrarAnimal} />
      <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />
      <Stack.Screen name="PerfilProtectora" component={PerfilProtectora} />
      <Stack.Screen name="AltaAdoptar" component={AltaAdoptar} />
      <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
      <Stack.Screen name="PerfilAdoptar" component={PerfilAdoptar} />
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
