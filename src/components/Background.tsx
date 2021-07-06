import React from 'react';
import { View, Text } from 'react-native';

export const Background = () => {
    return (
        <View
            style = {{
                position: 'absolute',
                backgroundColor: '#5956D6',
                top: -250,
                width: 800,
                height: 900,
                transform: [
                    { rotate: '-70deg' }
                ]
            }}
        />
    )
}
