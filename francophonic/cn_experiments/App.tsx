import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ReviewScreen from './src/ReviewScreen'


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Review" component={ReviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;