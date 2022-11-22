import React from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 
import { CredentialsContext } from '../components/CredentialsContext';

import PrincipalScreen from './../screens/PrincipalScreen'
import InicioSesion from './../screens/InicioSesion'
import RegistrarUsuario from './../screens/Altas/RegistrarUsuario'
import AltaProtectora from './../screens/Altas/AltaProtectora'

import SesionUsuario from './../screens/Sesiones/SesionUsuario'
import PerfilUsuario from '../screens/Perfiles/PerfilUsuario'
import Home from '../screens/Home';
import ListaProtectoras from '../screens/Listas/ListaProtectoras'
import ListaAnimales from '../screens/Listas/ListaAnimales';
import PerfilAnimal from '../screens/Perfiles/PerfilAnimal';
import PerfilProtectora from '../screens/Perfiles/PerfilProtectora';
import AltaAdoptar from '../screens/Altas/AltaAdoptar';
import UserDetailScreen from '../screens/UserDetailScreen';
import RegistrarAnimal from '../screens/Altas/RegistrarAnimal';
import AltaGlobal from '../screens/Altas/AltaGlobal';
import PerfilAdoptar from '../screens/Perfiles/PerfilAdoptar';
import SesionProtectora from '../screens/Sesiones/SesionProtectora';
import FechaNacimientoAnimal from '../screens/Altas/FechaNacimientoAnimal';
import ModificarProtectora from '../screens/Modificar/ModificarProtectora';
import ModificarUsuario from '../screens/Modificar/ModificarUsuario';
import MapaAnimalEncontrado from '../screens/Mapa/MapaAnimalEncontrado';
import MapaAnimalEncontradoProtectora from '../screens/Mapa/MapaAnimalEncontradoProtectora';
import InformacionSolicitud from '../screens/InformacionSolicitud';


const Stack = createNativeStackNavigator();

const RootStack = () => {
    return(
        <CredentialsContext.Consumer>
            {({storedCredentials}) => (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='PrincipalScreen'>
                        {storedCredentials  ? (
                            <>
                                <Stack.Screen
                                    name="SesionUsuario"
                                    component={SesionUsuario}

                                />
                                <Stack.Screen
                                    name="PerfilUsuario"
                                    component={PerfilUsuario}
                                />
                                <Stack.Screen
                                    name="Home"
                                    component={Home}
                                />
                                <Stack.Screen
                                    name="ListaAnimales"
                                    component={ListaAnimales}
                                />
                                <Stack.Screen
                                    name="ListaProtectoras"
                                    component={ListaProtectoras}
                                />
                                <Stack.Screen
                                    name="PerfilAnimal"
                                    component={PerfilAnimal}
                                />
                                <Stack.Screen
                                    name="PerfilProtectora"
                                    component={PerfilProtectora}
                                />
                                <Stack.Screen
                                    name="AltaAdoptar"
                                    component={AltaAdoptar}
                                />
                                <Stack.Screen
                                    name="UserDetailScreen"
                                    component={UserDetailScreen}
                                />
                                <Stack.Screen
                                    name="RegistrarAnimal"
                                    component={RegistrarAnimal}
                                />
                                <Stack.Screen
                                    name="AltaGlobal"
                                    component={AltaGlobal}
                                />
                                <Stack.Screen
                                    name="PerfilAdoptar"
                                    component={PerfilAdoptar}
                                />
                                <Stack.Screen
                                    name="SesionProtectora"
                                    component={SesionProtectora}
                                />
                                <Stack.Screen
                                    name="FechaNacimientoAnimal"
                                    component={FechaNacimientoAnimal}
                                />
                                <Stack.Screen
                                    name="ModificarProtectora"
                                    component={ModificarProtectora}
                                />
                                <Stack.Screen
                                    name="ModificarUsuario"
                                    component={ModificarUsuario}
                                />
                                <Stack.Screen
                                    name="MapaAnimalEncontrado"
                                    component={MapaAnimalEncontrado}
                                />
                                <Stack.Screen
                                    name="MapaAnimalEncontradoProtectora"
                                    component={MapaAnimalEncontradoProtectora}
                                />
                                <Stack.Screen
                                    name="InformacionSolicitud"
                                    component={InformacionSolicitud}
                                />
                            </>
                            ) : (
                            <>
                                <Stack.Screen
                                    name="PrincipalScreen"
                                    component={PrincipalScreen}
                                    options={{
                                        headerStyle: {
                                            backgroundColor: '#ffb743'
                                        },
                                        headerTintColor: '#fff',
                                        headerTransparent: false,
                                        headerTitle: ''
                                    }}
                                />
                                <Stack.Screen 
                                name="InicioSesion"
                                component={InicioSesion}
                                options={{ 
                                    headerStyle: {
                                        backgroundColor: '#ffb743'
                                    },
                                    headerTintColor: '#fff',
                                    headerTitle: 'Inicia sesión' 
                                }}
                                />
                                <Stack.Screen
                                    name="RegistrarUsuario"
                                    component={RegistrarUsuario}
                                    options={{
                                        headerStyle: {
                                            backgroundColor: '#ffb743'
                                        },
                                        headerTintColor: '#fff',
                                        headerTitle: 'Registro' 
                                    }}
                                />
                                <Stack.Screen
                                    name="AltaProtectora"
                                    component={AltaProtectora}
                                    options={{ 
                                        headerSytle: {
                                            backgroundColor: 'transparent'
                                        },
                                        headerTransparent: false,
                                        headerTintColor: '#5b1d66',
                                        headerTitle: 'Dar de alta tu protectora' 
                                    }}
                                />
                            </>
                            )
                        }
                        
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </CredentialsContext.Consumer>
    )
}

export default RootStack;