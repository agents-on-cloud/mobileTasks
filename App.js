import React from 'react';
import {Text, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './components/Home';

/////// redux //////
import {Provider} from 'react-redux';
import store from './reducers/index';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <Provider store={store}>
        {/* <SafeAreaView> */}
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
          </NavigationContainer>
        {/* </SafeAreaView> */}
      </Provider>
    </>
  );
}

const webName = 'Shopping List';
