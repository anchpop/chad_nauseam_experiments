import React from 'react';
import { connect } from 'react-redux'
import { Animated, KeyboardAvoidingView, TextInput, TouchableOpacity,  Button, StyleSheet, Text, View } from 'react-native';
import { baseTheme, styles } from "./styles"
import { EDIT_TEXT, SUBMIT, MODIFY_PERFORMANCE } from './redux/actions'
import { getFirstSentence, lineToWordsEnglish, computeWordsScoresEnglish, lineToWordsFrench, clamp } from "./redux/selectors"
import sentences, {Sentence} from './data/sentencedictionary'
import { Header } from 'react-navigation'
import { Audio } from 'expo-av'
import moment from 'moment'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PanGestureHandler, TapGestureHandler, RotationGestureHandler } from 'react-native-gesture-handler';
import produce from "immer"


/*
class Screen2 extends React.Component<{ textContent: string, 
                                        editText: (text: String) => void, 
                                        style: any, 
                                        navigation: any, 
                                        sentenceInfo: {
                                          french: String;
                                          englishTranslations: Sentence[];
                                          uuid: String;
                                          audio: any;
                                        }, 
                                        submitText: (modifiers: Array<Array<number>>) => void, submitted: Boolean,
                                        changeWordPerformanceScore: (currentPerformanceModifiers: Array<Array<number>>, wordIndex: number, partIndex: number, newModifier: number, correct: boolean) => void,
                                        performanceModifiers: Array<Array<number>>
                                      }, {}> {
  
  updateHeader() {
    this.props.navigation.setParams({ style: this.props.style });
  }
  
  componentDidMount() {
    this.updateHeader();
  }

  static navigationOptions = ({ navigation }) => {
    let styleInfo = navigation.getParam('style')
    if (styleInfo == null)
      styleInfo = baseTheme
    return {
      headerStyle: styleInfo.headerStyle
    }
  }

  async playSound(audio) {
    const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(audio);
        await soundObject.playAsync();
      } catch (error) {
        console.log(error)
      }
  }

  render() {
    const { textContent, editText, submitText, style, sentenceInfo, submitted, performanceModifiers, changeWordPerformanceScore } = this.props
    const disabled = textContent === ""
    const button = submitted ? 
                      <TouchableOpacity style={[style.mainButton, style.nextButton]} disabled={disabled} >
                        <Text style={style.submitButtonText}>Next</Text>
                      </TouchableOpacity>
                    : <TouchableOpacity style={[style.mainButton, disabled ? style.submitButtonDisabled : {}]} disabled={disabled} onPress={() => submitText(lineToWordsFrench(sentenceInfo.french).map(a => a.map(b => 0)))} >
                        <Text style={style.submitButtonText}>Submit</Text>
                      </TouchableOpacity>
    let textArea = null
    let questionComponent = null
    if (submitted)
    {
      const scores = computeWordsScoresEnglish(textContent, sentenceInfo.french, sentenceInfo.englishTranslations.map(s => s.sentence))
      textArea = <View style={style.textbox}>
                    <Text style={{fontSize: style.questionTextFontSize}}>{textContent}</Text>
                 </View>
                 
      questionComponent = scores.flatMap((wordGroup, index1) => wordGroup.map(({part, word, correct}, index2) => 
          <PanGestureHandler
            key={index1 + "." + index2}
            onGestureEvent={({nativeEvent}) => {
                changeWordPerformanceScore(performanceModifiers, index1, index2, nativeEvent.velocityY / 6000, correct)
              }}>
            <Animated.View style={{
              height: 150,
              justifyContent: 'center',
            }}>
              <Text key={index1 + "." + index2} style={[style.questionText, {color: style.wordColorGradient[clamp((correct ? 2 : 0) + Math.floor(performanceModifiers[index1][index2]),0,style.wordColorGradient.length-1)]}]}>
                {word}{' '}
              </Text>
            </Animated.View>
          </PanGestureHandler>
        )
      )
       
    }
    else { 
      textArea = <TextInput
                    multiline={true}
                    onChangeText={(text) => editText(text)}
                    value={textContent}
                    style={[style.textbox, {fontSize: style.questionTextFontSize}]}
                    placeholderTextColor={style.placeholderTextColor}
                    placeholder="In English..."
                  />
      questionComponent = <Text style={style.questionText}>
                            {sentenceInfo.french}
                          </Text>
    }

    return (
      <KeyboardAvoidingView style={style.container} keyboardVerticalOffset={Header.HEIGHT + 25} behavior="padding" enabled>
          <View style={{flex: 1.5, justifyContent: "flex-start", alignContent: "center", flexDirection: "row" }}>
            <View style={{height: "100%", width: "auto", justifyContent: "center"}}>
              <TouchableOpacity onPress={async () => this.playSound(sentenceInfo.audio)}>
                <MaterialCommunityIcons name="volume-high" raised reverse size={style.audioButtonSize}/>
              </TouchableOpacity>
            </View>
            <View style={{height: "100%", width: "auto", justifyContent: "center"}}>
              <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
                {questionComponent}
              </View>
            </View>
          </View>
          {textArea}
          <View style={{flex: 1}}>
          {button}
        </View>
  
      </KeyboardAvoidingView>
    );
  }
}
*/


const QScreen = ({ textContent, style, submitted, sentenceInfo, performanceModifiers, editText, submitText, changeWordPerformanceScore, route, navigation }) => {

  const disabled = textContent === ""
  const button = submitted ? 
                    <TouchableOpacity style={[style.mainButton, style.nextButton]} disabled={disabled} >
                      <Text style={style.submitButtonText}>Next</Text>
                    </TouchableOpacity>
                  : <TouchableOpacity style={[style.mainButton, disabled ? style.submitButtonDisabled : {}]} disabled={disabled} onPress={() => submitText(lineToWordsFrench(sentenceInfo.french).map(a => a.map(b => 0)))} >
                      <Text style={style.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
  let textArea = null
  let questionComponent = null
  if (submitted)
  {
    const scores = computeWordsScoresEnglish(textContent, sentenceInfo.french, sentenceInfo.englishTranslations.map(s => s.sentence))
    textArea = <View style={style.textbox}>
                  <Text style={{fontSize: style.questionTextFontSize}}>{textContent}</Text>
               </View>
               
    questionComponent = scores.flatMap((wordGroup, index1) => wordGroup.map(({part, word, correct}, index2) => 
        <PanGestureHandler
          key={index1 + "." + index2}
          onGestureEvent={({nativeEvent}) => {
              changeWordPerformanceScore(performanceModifiers, index1, index2, nativeEvent.velocityY / 6000, correct)
            }}>
          <Animated.View style={{
            height: 150,
            justifyContent: 'center',
          }}>
            <Text key={index1 + "." + index2} style={[style.questionText, {color: style.wordColorGradient[clamp((correct ? 2 : 0) + Math.floor(performanceModifiers[index1][index2]),0,style.wordColorGradient.length-1)]}]}>
              {word}{' '}
            </Text>
          </Animated.View>
        </PanGestureHandler>
      )
    )
     
  }
  else { 
    textArea = <TextInput
                  multiline={true}
                  onChangeText={(text) => editText(text)}
                  value={textContent}
                  style={[style.textbox, {fontSize: style.questionTextFontSize}]}
                  placeholderTextColor={style.placeholderTextColor}
                  placeholder="In English..."
                />
    questionComponent = <Text style={style.questionText}>
                          {sentenceInfo.french}
                        </Text>
  }

  return (
    <View style={style.container}>
        <View style={{flex: 1.5, justifyContent: "flex-start", alignContent: "center", flexDirection: "row" }}>
          <View style={{height: "100%", width: "auto", justifyContent: "center"}}>
            <TouchableOpacity onPress={async () => this.playSound(sentenceInfo.audio)}>
              <MaterialCommunityIcons name="volume-high" raised reverse size={style.audioButtonSize}/>
            </TouchableOpacity>
          </View>
          <View style={{height: "100%", width: "auto", justifyContent: "center"}}>
            <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
              {questionComponent}
            </View>
          </View>
        </View>
        {textArea}
        <View style={{flex: 1}}>
        {button}
      </View>

    </View>
  );
}
  

const mapStateToProps = state => ({
  textContent: state.editText.textBoxContent,
  style: styles(state.theme.currentTheme),
  submitted: state.editText.submitted,
  sentenceInfo: getFirstSentence(state),
  performanceModifiers: state.editText.performanceModifiers
})

const mapDispatchToProps = dispatch => ({
  editText: (t) => dispatch(EDIT_TEXT(t)),
  submitText: (initialModifiers) => dispatch(SUBMIT(initialModifiers)),
  changeWordPerformanceScore: (currentPerformanceModifiers, wordIndex, partIndex, modifyBy, correct) => dispatch(MODIFY_PERFORMANCE(produce(currentPerformanceModifiers, (mod) => {
    mod[wordIndex][partIndex] += modifyBy
    mod[wordIndex][partIndex]  = clamp(mod[wordIndex][partIndex], 0 - (correct ? 2 : 0), 4 - (correct ? 2 : 0))

  })))
})
  

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QScreen)