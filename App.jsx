import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import DreamsScreen from './src/screens/DreamsScreen';
import DreamDetailsScreen from './src/screens/DreamDetailsScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import ProjectDetailsScreen from './src/screens/ProjectDetailsScreen';

enableScreens();

const Stack = createStackNavigator();

const App = () => {
  
    return (
          <NavigationContainer>
              <Stack.Navigator initialRouteName="HomeScreen">
                  <Stack.Screen 
                      name="HomeScreen" 
                      component={HomeScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="DreamsScreen" 
                      component={DreamsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="DreamDetailsScreen" 
                      component={DreamDetailsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="ProjectsScreen" 
                      component={ProjectsScreen} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="ProjectDetailsScreen" 
                      component={ProjectDetailsScreen} 
                      options={{ headerShown: false }} 
                  />
              </Stack.Navigator>
          </NavigationContainer>
    );
};

export default App;
