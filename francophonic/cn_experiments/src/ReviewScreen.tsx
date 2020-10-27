import * as React from "react";
import { View, Text, TextInput } from 'react-native';

import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Container from './components/Container'

import useStyle from "./styles"

const playSound = async () => {
  const soundObject = new Audio.Sound();
  await soundObject.loadAsync(require('../assets/audio/french/0a4b44e806c056eb8769a97e5bdf560ee01fb821e93c5196910a0c944207f1ecfr-FR-Wavenet-C.mp3'));
  await soundObject.playAsync();
}

const Question = () => {
  const style = useStyle()
  return (
    <View style={style.questionContainer}>

      <View style={{ paddingRight: 5 }}>
        <TouchableOpacity onPress={playSound}>
          <Ionicons name="md-volume-high" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={style.questionText}>Je te vois.</Text>
      </View>

    </View>
  )
}

const Working = () => (
  <View style={{ flex: 1, alignItems: "center" }}>
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: "5%",
        paddingVertical: "0%",
        width: "50%"
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 4,
          backgroundColor: "red",
          width: "100%",
          height: "100%"
        }}
        nativeID="buttoncontainer"
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            backgroundColor: "green"
          }}
          nativeID="toubableopacity"
        >
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>)

const ReviewScreen = () => {
  const [currentInput, setCurrentInput] = React.useState("")
  const style = useStyle()

  return (
    <Container>
      <Question />

      <View style={style.answerContainer} >
        <TextInput
          style={style.answerTextInput}
          onChangeText={setCurrentInput}
          value={currentInput}
          multiline={true}
          autoCorrect={false}
          autoFocus={true}
        />
      </View>

      <View style={style.submitButtonContainer} nativeID="buttoncontainer">
        <TouchableOpacity style={style.submitButton} nativeID="toubableopacity">
          <Text style={style.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Container >

  )
}

export default ReviewScreen