import React, {useContext} from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 
import { CredentialsContext } from '../components/CredentialsContext';

//Stack de autentificación
import PrincipalScreen from './../screens/PrincipalScreen'
import InicioSesion from './../screens/InicioSesion'
import RegistrarUsuario from './../screens/Altas/RegistrarUsuario'
import AltaProtectora from './../screens/Altas/AltaProtectora'

//Stack de usuario
import SesionUsuario from './../screens/Sesiones/SesionUsuario'
import ListaProtectoras from '../screens/Listas/ListaProtectoras'
import ListaAnimales from '../screens/Listas/ListaAnimales';
import PerfilAnimal from '../screens/Perfiles/PerfilAnimal';
import AltaAdoptar from '../screens/Altas/AltaAdoptar';
import FechaNacimientoAnimal from '../screens/Altas/FechaNacimientoAnimal';
import ModificarUsuario from '../screens/Modificar/ModificarUsuario';
import MapaAnimalEncontrado from '../screens/Mapa/MapaAnimalEncontrado';
import FiltradoAnimales from '../screens/Listas/FiltradoAnimales';
import RegistrarAnimalPropietario from '../screens/Altas/RegistrarAnimalPropietario';
import Donaciones from '../screens/Donaciones'
import FechaExpiracion from '../screens/FechaExpiracion';

//Stack de protectora
import SesionProtectora from '../screens/Sesiones/SesionProtectora';
import RegistrarAnimal from '../screens/Altas/RegistrarAnimal';
import MapaAnimalEncontradoProtectora from '../screens/Mapa/MapaAnimalEncontradoProtectora';
import InformacionSolicitud from '../screens/InformacionSolicitud';
import ListaAnimalesProtectora from '../screens/Listas/ListaAnimalesProtectora';
import ListaDonaciones from '../screens/Listas/ListaDonaciones';
import ModificarProtectora from '../screens/Modificar/ModificarProtectora';

//Stack común para ambos tipos de usuarios
import PerfilProtectora from '../screens/Perfiles/PerfilProtectora';
import PerfilUsuario from '../screens/Perfiles/PerfilUsuario'
import AltaGlobal from '../screens/Altas/AltaGlobal';
import Notificaciones from '../screens/Notificaciones/Notificaciones';
import ListaSolicitudes from '../screens/Listas/ListaSolicitudes';

//Bibliotecas colores CSS
import {colors} from '../components/Color';

const Stack = createNativeStackNavigator();

const RootStack = () => {
    return(
        <CredentialsContext.Consumer>
            {({storedCredentials, type}) => (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='PrincipalScreen'>
                        {storedCredentials  ? (
                            <>
                                {type ? (
                                    <>
                                        <Stack.Screen
                                            name="SesionUsuario"
                                            component={SesionUsuario}
                                            options={{
                                                headerTintColor: '#fff',
                                                headerTransparent: true,
                                                headerTitle: ''
                                            }}
                                        />
                                        <Stack.Screen
                                            name="PerfilUsuario"
                                            component={PerfilUsuario}
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
                                            options={{headerTransparent: true, headerTitle: ''}}
                                        />
                                        <Stack.Screen
                                            name="PerfilProtectora"
                                            component={PerfilProtectora}
                                            options={{headerTransparent: true, headerTitle: ''}}
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
                                            name="Notificaciones"
                                            component={Notificaciones}
                                        />
                                        <Stack.Screen
                                            name="FiltradoAnimales"
                                            component={FiltradoAnimales}
                                            options={{headerTransparent: true, headerTitle: ''}}
                                        />
                                        <Stack.Screen
                                            name="AltaAdoptar"
                                            component={AltaAdoptar}
                                        />
                                        
                                        <Stack.Screen
                                            name="RegistrarAnimalPropietario"
                                            component={RegistrarAnimalPropietario}
                                        />
                                        <Stack.Screen
                                            name="FechaNacimientoAnimal"
                                            component={FechaNacimientoAnimal}
                                        />
                                        <Stack.Screen
                                            name="Donaciones"
                                            component={Donaciones}
                                            options={{ 
                                                headerStyle: {
                                                    backgroundColor: colors.amarillo
                                                },
                                                headerTransparent: true,
                                                headerTitle: '',                                    
                                                }}
                                        />
                                         <Stack.Screen
                                            name="FechaExpiracion"
                                            component={FechaExpiracion}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Stack.Screen
                                            name="SesionProtectora"
                                            component={SesionProtectora}
                                            options={{headerShown: false}}
                                        />
                                        <Stack.Screen
                                            name="AltaAdoptar"
                                            component={AltaAdoptar}
                                        />
                                        <Stack.Screen
                                            name="RegistrarAnimal"
                                            component={RegistrarAnimal}
                                            options={{headerTransparent: true, headerTitle: '', headerTintColor: colors.moradoPrincipal}}
                                        />
                                        <Stack.Screen
                                            name="AltaGlobal"
                                            component={AltaGlobal}
                                        />
                                        <Stack.Screen
                                            name="PerfilProtectora"
                                            component={PerfilProtectora}
                                        />
                                        <Stack.Screen
                                            name="FechaNacimientoAnimal"
                                            component={FechaNacimientoAnimal}
                                            options={{headerTransparent: true, headerTitle: '', headerTintColor: colors.moradoPrincipal}}
                                        />
                                        <Stack.Screen
                                            name="MapaAnimalEncontradoProtectora"
                                            component={MapaAnimalEncontradoProtectora}
                                        />
                                        <Stack.Screen
                                            name="InformacionSolicitud"
                                            component={InformacionSolicitud}
                                        />
                                        <Stack.Screen
                                            name="Notificaciones"
                                            component={Notificaciones}
                                        />
                                        <Stack.Screen
                                            name="ListaAnimalesProtectora"
                                            component={ListaAnimalesProtectora}
                                        />
                                        <Stack.Screen
                                            name="ListaDonaciones"
                                            component={ListaDonaciones}
                                            options={{ 
                                                headerStyle: {
                                                    backgroundColor: colors.blanco
                                                },
                                                headerTransparent: true,
                                                headerTitle: '',                                    
                                                }}
                                        />
                                        <Stack.Screen
                                            name="ListaSolicitudes"
                                            component={ListaSolicitudes}
                                        />
                                        <Stack.Screen
                                            name="ModificarProtectora"
                                            component={ModificarProtectora}
                                        />
                                        <Stack.Screen
                                            name="PerfilAnimal"
                                            component={PerfilAnimal}
                                            options={{headerTransparent: true, headerTitle: '', headerTintColor: colors.amarillo}}
                                        />
                                        <Stack.Screen
                                            name="PerfilUsuario"
                                            component={PerfilUsuario}
                                            options={{
                                                headerTintColor: '#fff',
                                                headerTransparent: true,
                                                headerTitle: ''
                                            }}
                                        />
                                    </>
                                )}
                                
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
                                        headerTransparent: true,
                                        headerTitle: ''
                                    }}
                                />
                                <Stack.Screen 
                                name="InicioSesion"
                                component={InicioSesion}
                                options={{ 
                                    headerStyle: {
                                        backgroundColor: colors.amarillo
                                    },
                                    headerTransparent: true,
                                    headerTitle: '',                                    
                                    }}
                                />
                                <Stack.Screen
                                    name="RegistrarUsuario"
                                    component={RegistrarUsuario}
                                    options={{ 
                                        headerStyle: {
                                        backgroundColor: colors.amarillo
                                        },
                                        headerTransparent: true,
                                        headerTitle: '',                                    
                                        }}
                                />
                                <Stack.Screen
                                    name="AltaProtectora"
                                    component={AltaProtectora}
                                    options={{ 
                                        headerStyle: {
                                            backgroundColor: colors.blanco
                                        },
                                        headerTransparent: true,
                                        headerTitle: '',                                    
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