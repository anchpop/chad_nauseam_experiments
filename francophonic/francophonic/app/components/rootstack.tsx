import React, { Component } from 'react';
import {
    Button,
    FlatList,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';

import { ThemeObject, themes, ThemeProvider, withTheme } from '../themes'
import { HomeScreen, DonateScreen, FlashcardScreen } from './home'
import SentencePracticeScreen from "./sentencePractice"
  

interface Props {
    theme: string
}

class RootStackContainer extends React.Component<Props> {
    render() {
        let theme: ThemeObject = themes[this.props.theme]
        let RootStack = createStackNavigator(
            {
                Home: HomeScreen,
                Sentence: SentencePracticeScreen,
                Donate: DonateScreen,
                Flashcard: FlashcardScreen
            },
            {
                initialRouteName: 'Home',
                navigationOptions: {
                    headerStyle: {
                        backgroundColor: theme.colors.headerColor,
                    },
                    headerTitleStyle: {
                        color: theme.colors.headerTextColor,
                    },
                    headerTintColor: theme.colors.headerTextColor
                }
            }
        );
        return (
            <ThemeProvider theme={theme}>
                <RootStack/>
            </ThemeProvider>
        );
    }
}


function mapStateToProps(state: any) {
    return {
        theme: state.theme.currentTheme,
    }
}

export default connect(mapStateToProps)(RootStackContainer);