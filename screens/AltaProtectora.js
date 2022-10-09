import React, {useState} from "react";
import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import firebase from '../database/firebase';

const AltaProtectora = () => {

    const [openn, setOpen] = useState(false)

    return(
        <View style={styles.container}> 
            <Text style={styles.title}> Protectora </Text>
            <View 
            style={styles.inputGroup}> 
                <TextInput 
                style={styles.inputText}
                placeholder="Nombre"
                />
            </View>
            <DropDownPicker
                            items={[
                                { label: 'Select Issue Level', value: 'Select Issue Level' },
                                { label: 'Very important', value: 'Very important' },
                                { label: 'Medium level', value: 'Medium level' },
                                { label: 'Information', value: 'Information' },
                            ]}
                            open={openn}
                            setOpen={setOpen}
                            onChangeItem={() => console.log('hola')}
                        />
            
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        padding: 35
    },
    inputGroup: {
        fontSize: 20, 
        padding: 0,
        marginBottom: 15,
        marginTop: 15, 
        borderBottomWidth: 2, 
        borderBottomColor: '#cccccc'
    }, inputText: {
        fontSize: 17
      },
      title : {
        fontSize: 40,
        fontWeight: "bold"
      }
})
export default AltaProtectora;