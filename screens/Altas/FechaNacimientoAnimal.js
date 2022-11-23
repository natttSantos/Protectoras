import React, {useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, Button } from "react-native";
import DatePicker from 'react-native-modern-datepicker';


const FechaNacimientoAnimal = (props) => {
    const [state, setState] = useState({
        fecha: "22/10/2022"
      });
    const [chosenDate, setChosenDate] = useState('');

    return(
 
        <View>
      <Text>{chosenDate}</Text>
      <DatePicker
            date={chosenDate}
            onChangeText={(date) => handleChangeText('fecha', date.toDateString())}
            onDateChange={setChosenDate}
        />
        <Button title="Confirmar" onPress={() => {
          if(props.route.params.esProtectora == "No"){
            props.navigation.navigate('RegistrarAnimalPropietario', {userId: props.route.params.userId, valueFecha: chosenDate})}
          else{
            props.navigation.navigate('RegistrarAnimal', {userId: props.route.params.userId, valueFecha: chosenDate})}

          }
          }/>      
    </View>

  
        
             
        
         
    
    )
}


export default FechaNacimientoAnimal;