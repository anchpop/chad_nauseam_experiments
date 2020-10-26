import React from 'react'
import { Component } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import store from './app/store'; 
import RootStack from './app/components/rootstack' 

export default class App extends Component {
  render() {
      return (
          <Provider store={store}>
              <RootStack />
          </Provider>
      );
  }
}