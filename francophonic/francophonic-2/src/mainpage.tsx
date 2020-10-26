import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { baseTheme, styles } from "./styles"
import { connect } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import QuestionsPage from './questionspage'

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function StatsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Stats!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const MainPage = ({ style, route, navigation }) => {
  return (
    <View style={style.container}>
      <Tab.Navigator>
        <Tab.Screen name="Study" component={QuestionsPage} />
        <Tab.Screen name="Stats" component={StatsScreen} />
      </Tab.Navigator>
    </View>
  );
}


/*
class MainPage extends React.Component<{ style: any, navigation: any}, {}> {
  
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

  render() {
    const {navigation, style} = this.props
    return (
      <View style={style.container}>
        <Text>french time oink oink!</Text>
        <Button
            title="Go to Details"
            onPress={() => navigation.navigate('Profile', {style})}
          />
      </View>
    );
  }
}
*/

const mapStateToProps = state => {
  return { style: styles(state.theme.currentTheme) }
}

export default connect(
  mapStateToProps
)(MainPage)