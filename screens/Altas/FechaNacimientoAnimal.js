import React, {useEffect, useState, useContext } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity } from "react-native";
import DatePicker from 'react-native-modern-datepicker';
import { CredentialsContext } from "../../components/CredentialsContext"
import { colors } from '../../components/Color';

const FechaNacimientoAnimal = (props) => {
    const [state, setState] = useState({
        fecha: "22/10/2022"
      });
    const [chosenDate, setChosenDate] = useState('');
    const [modal, setModal] = useState({
        visible: false
    });
    const {type, setType} = useContext(CredentialsContext);

    return(
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal.visible}
          onRequestClose={() => {
              setModal({...modal, visible: !modal.visible});
          }}>
          <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <View style={{flex: 4}}>
                      <Text style={styles.texto}>Por favor, seleccione una fecha válida</Text>
                  </View>
                  <View style={styles.buttonGroup}>
                      <TouchableOpacity
                      onPress={() => setModal({...modal, visible: !modal.visible})}>
                          <View style={styles.botonCerrar}>
                              <Text style={styles.texto}>cerrar</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
        </Modal>
        <Text style={styles.fecha}>{chosenDate}</Text>
        <DatePicker
          options={{
            headerFont: "InterRegular",
            defaultFontSize: "InterRegular",
            mainColor: colors.moradoPrincipal,
            textHeaderColor: colors.moradoPrincipal,
            textDefaultColor: colors.moradoPrincipal,
            textSecondaryColor: colors.moradoSecundario,
            borderColor: colors.amarillo,
            selectedTextColor: colors.amarillo
          }}
          mode="calendar"
          date={chosenDate}
          onChangeText={(date) => handleChangeText('fecha', date.toDateString())}
          onDateChange={setChosenDate}
        />
        <TouchableOpacity 
          onPress={() => {
            if(chosenDate == '') {
              setModal({...modal, visible: !modal.visible})
            }
            else {
              props.navigation.navigate('RegistrarAnimal', {userId: props.route.params.userId, valueFecha: chosenDate})
            }
            }
          }
          style={styles.botonCircularBlancoMorado}>
              <Text style={styles.botonTextoMorado}>
                  Confirmar
              </Text>
        </TouchableOpacity>   
      </View>
    )
}


const styles = StyleSheet.create({
  container : {
    flex: 1, 
    padding: 35,
    backgroundColor: colors.blanco
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 10,
    width: '90%',
    height: 190,
    backgroundColor: colors.amarillo,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  fecha: {
    marginTop: 30,
    alignSelf : 'center',
    fontFamily: 'InterRegular',
    color: colors.moradoPrincipal,
    fontSize: 16,
    opacity: 0.7
  },
  botonCircularBlancoMorado : {
    backgroundColor: colors.blanco,
    borderColor: colors.moradoPrincipal,
    borderWidth: 2,
    width:260,
    height:50,
    borderRadius: 25,
    alignSelf: "center",
    marginBottom: 20
  },
  botonTextoMorado: {
    fontSize: 20,
    color: colors.moradoPrincipal,
    alignSelf: "center",
    marginTop: 5
  },
  botonCerrar: {
    marginRight: 10,
    height: 40,
    width: 120,
    borderRadius: 10,
    backgroundColor: colors.moradoPrincipal,
    alignItems: 'center',
    justifyContent: 'center'
  },
  texto: {
    fontFamily: 'DMSans',
    fontSize: 20,
    color: colors.blanco,
  },
})

export default FechaNacimientoAnimal;