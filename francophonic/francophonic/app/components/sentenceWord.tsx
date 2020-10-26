import React, { Component } from 'react';
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
// @ts-ignore
import PopoverTooltip from 'react-native-popover-tooltip';


import { FrenchWordInfo } from '../utils/sentenceUtils'
import { ProblemType } from '../problemTypes'
import wordList from '../data/wordList'
import { ThemeObject, withTheme } from '../themes'

interface Props {
    theme: ThemeObject,
    key: number,
    frenchWordInfo: FrenchWordInfo
}

interface Label {
    label: string,
    onPress: () => void
} 

interface ThemeStyles {
    sentenceWordContainerFocus: ViewStyle,
    sentenceWord: TextStyle,
}



class SentenceWord extends React.Component<Props> {
    constructor(props: Props) {
      super(props);
    }
    

    render() {
        let themeStyles: ThemeStyles =  {
            sentenceWord: {
                color: this.props.theme.colors.textColor
            },
            sentenceWordContainerFocus: {
                backgroundColor: this.props.theme.colors.backgroundColorAttention,
            },
        }
        
        let word = this.props.frenchWordInfo.frenchWord
        let labels: Label[] = []
        
        if (this.props.frenchWordInfo.realWord)
        {
            this.props.frenchWordInfo.translation.forEach(translation => {
                labels.push(
                {
                    label: translation.display,        // show the word thats being translated
                    onPress: () => {},
                })
                translation.englishTranslations.forEach(element => {
                    labels.push(
                    {
                        label: element,            // show the translation
                        onPress: () => {},
                    })
                });
                
            });
        }
        
        return (<View>
                    { !this.props.frenchWordInfo.realWord ? 
                        <View style={styles.sentenceWordContainer} key={1}>
                            <Text style={[styles.sentenceWord]}>
                                {word}
                            </Text>
                        </View> : 
                        <PopoverTooltip
                            overlayStyle={{backgroundColor: 'transparent'}}
                            delayLongPress={0}
                            setBelow={true}
                            ref={'tooltip' + this.props.key}
                            buttonComponent={
                            <View style={[styles.sentenceWordContainer, styles.sentenceWordContainerFocus, themeStyles.sentenceWordContainerFocus]} key={1}>
                                <Text style={[styles.sentenceWord, themeStyles.sentenceWord]}>
                                    {word}
                                </Text>
                            </View>}
                            items={labels}
                            // animationType='timing'
                            // using the default timing animation
                            />
                        }
                </View>
                )
    }
};


const styles = StyleSheet.create({
    sentenceText: {
        margin: 10,
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
})

//Connect everything
export default withTheme(SentenceWord);