import * as React from "react";
import { View, Text, TextInput } from 'react-native';

import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Container from './components/Container'

import style from "./styles"

const playSound = async () => {
  const soundObject = new Audio.Sound();
  await soundObject.loadAsync(require('../assets/audio/french/0a4b44e806c056eb8769a97e5bdf560ee01fb821e93c5196910a0c944207f1ecfr-FR-Wavenet-C.mp3'));
  await soundObject.playAsync();
}

const ReviewScreen = () => {
  const [currentInput, setCurrentInput] = React.useState("")

  return (
    <Container>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: "100%", height: "100%" }}>
        <View style={{ paddingRight: 5 }}>
          <TouchableOpacity onPress={playSound}>
            <Ionicons name="md-volume-high" size={32} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ fontSize: 25 }}>Je te vois.</Text>
        </View>
      </View>

      <View style={{ flex: 5, width: "100%", height: "100%" }} >
        <TextInput
          style={{ width: "100%", height: "100%", textAlignVertical: 'top', fontSize: 25 }}
          onChangeText={setCurrentInput}
          value={currentInput}
          multiline={true}
          autoCorrect={false}
          autoFocus={true}
        />
      </View>

      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <TouchableOpacity style={style.submitButton}>
          <Text style={style.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Container >

  )
}

export default ReviewScreen