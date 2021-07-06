import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ProductScreen } from '../screens/ProductScreen';

export type ProductsStackParams = {
    ProductsScreen: undefined,
    ProductScreen: { id?: string, name?: string }
}

const Stack = createStackNavigator<ProductsStackParams>();

export const ProductsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions = {{
                cardStyle: {
                    backgroundColor: 'white'
                },
                headerStyle: {
                    elevation: 0,
                    shadowColor: 'white'
                }
            }}
        >
            <Stack.Screen 
                name = "ProductsScreen" 
                component = { ProductsScreen }  
                options = {{ title: 'Productos' }}
            />
            <Stack.Screen 
                name = "ProductScreen" 
                component = { ProductScreen }  
            />
        </Stack.Navigator>
    )
}
