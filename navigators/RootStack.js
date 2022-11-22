import React from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 
import { CredentialsContext } from '../components/CredentialsContext';

import PrincipalScreen from './../screens/PrincipalScreen'
import InicioSesion from './../screens/InicioSesion'
import RegistrarUsuario from './../screens/Altas/RegistrarUsuario'
import AltaProtectora from './../screens/Altas/AltaProtectora'
import SesionUsuario from './../screens/Sesiones/SesionUsuario'


const Stack = createNativeStackNavigator();

const RootStack = () => {
    return(
        <CredentialsContext.Consumer>
            {({storedCredentials}) => (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='PrincipalScreen'>
                        {storedCredentials  ? (
                            <Stack.Screen
                                name="SesionUsuario"
                                component={SesionUsuario}

                            />
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