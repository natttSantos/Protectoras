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

const UserDetailScreen = (props) => {
    //console.log(props.route.params.userId);
    return (
        <View>
            
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
            <Appbar.Content title={usuario.nombre} />
            <Appbar.Action icon="home" onPress={() => {}} />
            <Appbar.Action icon="plus-circle" onPress={() => {}} />
            <Appbar.Action icon="chat" onPress={() => {}} />
            <Appbar.Action icon="account" onPress={() => { props.navigation.navigate('PerfilProtectora', {usuarioId: usuario})  }} />
        </Appbar>
        
        );
}

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
export default UserDetailScreen; 