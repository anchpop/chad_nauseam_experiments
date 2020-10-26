import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import style from "./styles"

const playSound = async () => {
  const soundObject = new Audio.Sound();
  await soundObject.loadAsync(require('../assets/audio/french/0a4b44e806c056eb8769a97e5bdf560ee01fb821e93c5196910a0c944207f1ecfr-FR-Wavenet-C.mp3'));
  await soundObject.playAsync();
}

const ReviewScreen = () => {
  return (
    <View style={style.container}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10, width: "100%", height: "100%" }}>
        <View style={{ paddingRight: 5 }}>
          <TouchableOpacity onPress={playSound}>
            <Ionicons name="md-volume-high" size={32} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ fontSize: 25 }}>Je te vois.</Text>
        </View>
      </View>

      <View style={{ flex: 5 }}>
      </View>

      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <TouchableOpacity style={{
          width: "100%", height: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: "rgb(80, 200, 120)"
        }}>
          <Text style={style.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View >

  )
}

export default ReviewScreen