import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    FlatList,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ThemeObject, withTheme } from '../themes'
import { NavigationContainer } from 'react-navigation';

import * as Actions from '../actions'; // Import your actions

const styles = StyleSheet.create({
    activityIndicatorContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    row:{
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 10
    },
    title:{
        fontSize: 15,
        fontWeight: "600"
    },
    description:{
        marginTop: 5,
        fontSize: 14,
    },
    buttonContainer: {
        margin: 5,
    }
});

interface Props {
    theme: ThemeObject,
    navigation: any,
}

class Home extends Component<Props> {
    static navigationOptions = {
        title: 'Francophonic', 
    };

    render() {
        let themeStyles =  {
            view: {
                backgroundColor: this.props.theme.colors.backgroundColor
            },
        }
        return (
                <View style={[{flex:1, paddingTop:20}, themeStyles.view]}>
                    <View style={styles.buttonContainer}>
                        <Button
                            color={this.props.theme.colors.buttonColor}
                            title="Practice Sentences"
                            onPress={() => this.props.navigation.navigate('Sentence')}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            color={this.props.theme.colors.buttonColor}
                            title="Practice Flashcards"
                            onPress={() => this.props.navigation.navigate('Flashcard')}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            color={this.props.theme.colors.buttonColor}
                            title="Donate :)"
                            onPress={() => this.props.navigation.navigate('Donate')}
                        />
                    </View>
                </View>
        );
    }
};




// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state: any) {
    return {
        loading: state.dataReducer.loading,
        data: state.dataReducer.data
    }
}


//Connect everything
let HomeScreen = withTheme(connect(mapStateToProps)(Home));



class DonateScreen extends React.Component {
    static navigationOptions = {
        title: 'Donate', 
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Donate Screen</Text>
            </View>
        );
    }
}

class FlashcardScreen extends React.Component {
    static navigationOptions = {
        title: 'Flashcards', 
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Flashcard Practice Screen</Text>
            </View>
        );
    }
}

export { HomeScreen, DonateScreen, FlashcardScreen }