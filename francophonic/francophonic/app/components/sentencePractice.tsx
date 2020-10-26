import React from 'react';
import { Component } from 'react';
import {
    Button,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    View,
    Text,
    TextInput,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// @ts-ignore
import KeyboardSpacer from 'react-native-keyboard-spacer'
import * as _ from "lodash";

import { ProblemType } from '../problemTypes'
import { ThemeObject, withTheme, themes } from '../themes'
import * as Actions from '../actions'; 
import SentenceWord from './sentenceWord'
import { getDefinitionsInFrench, normalizeEnglishSentence, frenchSentenceSplitterNormalized, PracticeGrade, frenchSentenceSplitter } from '../utils/sentenceUtils'
import { gradeEnglishSentences,  } from '../utils/sentenceGrading'
import sentenceList from '../data/sentenceList'

interface Props {
    theme: ThemeObject
}

interface State {
    text: string, 
    submitted: boolean
}

interface ThemeStyles {
    root: ViewStyle,
    button: ViewStyle,
    buttonText: TextStyle,
    instructionText: TextStyle,
    textBox: TextStyle,
}


class SentencePractice extends React.Component<Props, State> {
    static navigationOptions = {
        title: 'Sentences', 
    };
    constructor(props: any) {
        super(props);
        this.state = {text: "", submitted: false};
    }

    submitButtonPressed() {
        this.setState({submitted: true})
    }

    render() {
        let buttonDisabled = this.state.text.replace(" ", "") === ""
        const themeStyles: ThemeStyles =  {
            root: {
                backgroundColor: this.props.theme.colors.backgroundColor
            },
            button: {
                backgroundColor: buttonDisabled ? this.props.theme.colors.buttonColorDisabled : this.props.theme.colors.buttonColor
            },
            buttonText: {
                color: this.props.theme.colors.buttonTextColor
            },
            instructionText: {
                color: this.props.theme.colors.textColor
            },
            textBox: {
                color: this.props.theme.colors.textColor
            }
        }
        
        let problemType = ProblemType.translateFrenchToEnglish
        let chosenSentence = sentenceList[0]


        let sentenceFrench = chosenSentence.frenchPreferred[0].sentence
        let frenchDefinitions = getDefinitionsInFrench(sentenceFrench)

        let sentenceFrenchObject: {render: string[], normalizedWords: string[]} = {render: frenchSentenceSplitter(sentenceFrench), normalizedWords: frenchSentenceSplitterNormalized(sentenceFrench)}
        let sentencesEnglish = chosenSentence.englishPreferred.map(v => v.sentence)
        let sentenceComponent = frenchDefinitions.map((v, index) => <SentenceWord key={index} frenchWordInfo={v} problemType={problemType}/>)
        
        let grade: PracticeGrade | undefined = undefined
        if (this.state.submitted) {
            grade = gradeEnglishSentences(sentenceFrenchObject.normalizedWords, sentencesEnglish, this.state.text)
        }

        return (
            <View style={[styles.root, themeStyles.root]}>
                <View style={styles.instructionTextContainer}>
                    <Text style={[styles.instructionText, themeStyles.instructionText]}>Translate this sentence</Text>
                </View>
                <View style={[styles.sentenceText]}>{sentenceComponent}</View>
                {this.state.submitted && grade != undefined ? 
                <View style={[styles.textBox]}>
                    <Text style={[styles.submittedText, styles.submissionText, {color: this.props.theme.colors.textColor}]}>
                        {this.state.text} {"\n"}
                    </Text>
                    <Text style={{fontSize: 24, marginTop: 5, color: grade.perfect ? this.props.theme.colors.goodColor : this.props.theme.colors.badColor}}>
                         Correct Sentence:
                    </Text>
                    <Text style={[styles.submittedText, styles.correctAnswerText, {color: this.props.theme.colors.textColor}]}>
                        {grade.closestEnglishSentence}
                    </Text>
                </View> : 
                <TextInput
                    style={[styles.textBox, styles.textEntry, themeStyles.textBox]}
                    placeholder="L'Anglais ici"
                    onChangeText={(text) => this.setState({text})}
                    multiline={true}
                    maxLength = {300}
                    numberOfLines = {4}
                />}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        disabled={buttonDisabled}
                        style={[styles.button, themeStyles.button]}
                        onPress={() => this.submitButtonPressed()}>
                        <Text style={[styles.buttonText, themeStyles.buttonText]}>{this.state.submitted ? "Next" : "Check" }</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardSpacer/>
            </View>
        );
    }
};


const styles = StyleSheet.create({
    root: {
        flex: 1, alignItems: 'stretch', justifyContent: 'center',
    },
    instructionTextContainer: {
        margin: 20,
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sentenceText: {
        margin: 20,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row'
    },
    sentenceWord: {
        fontSize: 24,
        justifyContent: "flex-end",
    },
    sentenceWordContainer: {
    },
    sentenceWordContainerFocus: {
        borderRadius: 5,
        padding: 5,
        margin: 1,
    },
    submissionText: {
        fontSize: 20,
    },
    correctAnswerText: {
        fontSize: 20,
    },
    submittedText: {
        fontSize: 20,
    },
    textEntry: {
        fontSize: 20,
        textAlignVertical: "top"
    },
    textBox: {
        margin: 20,
        marginTop: 10,
        marginBottom: 30,
        flex: 1,
    },
    button: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonContainer: {
        height: 60  
    }
})

function mapStateToProps(state: any) {
    return {
        loading: state.dataReducer.loading,
        data: state.dataReducer.data
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
//function mapDispatchToProps(dispatch) {
//    return bindActionCreators(Actions, dispatch);
//}

//Connect everything
export default withTheme(connect(mapStateToProps)(SentencePractice));