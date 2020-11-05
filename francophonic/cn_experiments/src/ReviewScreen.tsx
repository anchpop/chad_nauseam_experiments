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
  const { styles } = useStyle()
  return (
    <View style={styles.questionContainer}>

      <View style={{ paddingRight: 5 }}>
        <TouchableOpacity onPress={playSound}>
          <Ionicons name="md-volume-high" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.questionText}>Je te vois.</Text>
      </View>

    </View>
  )
}

const ReviewScreen = () => {
  const [currentInput, setCurrentInput] = React.useState("")
  const { styles } = useStyle()

  return (
    <Container imageLight={require('../assets/images/france/franceLight.jpg')} imageDark={require('../assets/images/france/franceDark.jpg')}>
      <Question />

      <View style={styles.answerContainer} >
        <TextInput
          style={styles.answerTextInput}
          onChangeText={setCurrentInput}
          value={currentInput}
          multiline={true}
          autoCorrect={false}
          autoFocus={true}
          placeholder="In english..."
        />
      </View>

      <View style={styles.submitButtonContainer}>
        <Button style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </Button>
      </View>
    </Container >

  )
}

export default ReviewScreen