import React, {useEffect, useState, useContext } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, Button } from "react-native";
import DatePicker from 'react-native-modern-datepicker';
import { CredentialsContext } from "../../components/CredentialsContext"

const FechaNacimientoAnimal = (props) => {
    const [state, setState] = useState({
        fecha: "22/10/2022"
      });
    const [chosenDate, setChosenDate] = useState('');

    const {type, setType} = useContext(CredentialsContext);

    return(
 
        <View>
      <Text>{chosenDate}</Text>
      <DatePicker
            date={chosenDate}
            onChangeText={(date) => handleChangeText('fecha', date.toDateString())}
            onDateChange={setChosenDate}
        />
        <Button title="Confirmar" onPress={() => {
          if(type == "usuario"){
            props.navigation.navigate('RegistrarAnimalPropietario', {userId: props.route.params.userId, valueFecha: chosenDate})}
          else{
            props.navigation.navigate('RegistrarAnimal', {userId: props.route.params.userId, valueFecha: chosenDate})}

          }
        }/>      
    </View>

  
        
             
        
         
    
    )
}


export default FechaNacimientoAnimal;