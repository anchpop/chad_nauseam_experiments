import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './src/redux/reducers'
import MainPage from './src/mainpage'

const store = createStore(rootReducer)

/*
const MainNavigator = createStackNavigator({
  Home: {
          screen: mainPage,
        },
  Profile: {screen: questionsPage},
});


const App = createAppContainer(MainNavigator);
*/
const Stack = createStackNavigator();

export default () => (
  <Provider store={store}>
    <NavigationContainer>
      <MainPage />
    </NavigationContainer>
  </Provider>
)
