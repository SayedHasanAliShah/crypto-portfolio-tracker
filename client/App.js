import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import DetailScreen from './src/screens/DetailScreen';
import AlertScreen from './src/screens/AlertScreen';

// Suppress InteractionManager deprecation warning from React Navigation
LogBox.ignoreLogs([
    'InteractionManager has been deprecated',
]);

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#1a1a2e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Crypto Tracker' }}
                />
                <Stack.Screen
                    name="Portfolio"
                    component={PortfolioScreen}
                    options={{ title: 'My Portfolio' }}
                />
                <Stack.Screen
                    name="Detail"
                    component={DetailScreen}
                    options={{ title: 'Coin Details' }}
                />
                <Stack.Screen
                    name="Alerts"
                    component={AlertScreen}
                    options={{ title: 'Price Alerts' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
