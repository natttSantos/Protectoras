import React from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 

import PrincipalScreen from './../screens/PrincipalScreen'
import InicioSesion from './../screens/InicioSesion'
import RegistrarUsuario from './../screens/Altas/RegistrarUsuario'
import AltaProtectora from './../screens/Altas/AltaProtectora';

const Stack = createNativeStackNavigator();

const RootStack = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName='PrincipalScreen' >
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
                        headerTitle: 'AltaProtectora' 
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack;