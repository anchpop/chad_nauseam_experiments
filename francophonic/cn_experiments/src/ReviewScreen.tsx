import * as React from "react";
import { View, Text, TextInput, TouchableOpacity } from 'react-native';


import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import Container from './components/Container'
import Button from './components/Button'

import useStyle from "./styles"

const playSound = async () => {
  const soundObject = new Audio.Sound();
  await soundObject.loadAsync(require('../assets/audio/french/0a4b44e806c056eb8769a97e5bdf560ee01fb821e93c5196910a0c944207f1ecfr-FR-Wavenet-C.mp3'));
  await soundObject.playAsync();
}

const Question = () => {
  const { reviewPageStyles } = useStyle()
  return (
    <View style={reviewPageStyles.questionContainer}>

      <View style={{ paddingRight: 7 }}>
        <TouchableOpacity onPress={playSound}>
          <Ionicons name="md-volume-high" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={reviewPageStyles.questionText}>
          Je te vois.
        </Text>
      </View>


    </View>
  )
}

const ReviewScreen = () => {
  const [currentInput, setCurrentInput] = React.useState("")
  const { reviewPageStyles } = useStyle()

  return (
    <Container imageLight={require('../assets/images/france/franceLight.jpg')} imageDark={require('../assets/images/france/franceDark.jpg')}>
      <Question />

      <View style={reviewPageStyles.answerContainer} >
        <TextInput
          style={reviewPageStyles.answerTextInput}
          onChangeText={setCurrentInput}
          value={currentInput}
          multiline={true}
          autoCorrect={false}
          autoFocus={true}
          placeholder="In english..."
        />
      </View>

      <View style={reviewPageStyles.submitButtonContainer}>
        <Button style={reviewPageStyles.submitButton}>
          <Text style={reviewPageStyles.submitButtonText}>Submit</Text>
        </Button>
      </View>
    </Container >

  )
}

export default ReviewScreen