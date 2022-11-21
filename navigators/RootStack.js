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
            <Stack.Navigator>
                <Stack.Screen
                    name="PrincipalScreen"
                    component={PrincipalScreen}
                />
                <Stack.Screen 
                    name="InicioSesion"
                    component={InicioSesion}
                />
                <Stack.Screen
                    name="RegistrarUsuario"
                    component={RegistrarUsuario}
                />
                <Stack.Screen
                    name="AltaProtectora"
                    component={AltaProtectora}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack;