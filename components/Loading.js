import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Loading({ size = 120, style }) {
    return (
        <View
            style={[
                { width: 100, height: 60, alignItems: 'center', justifyContent: 'center' },
                style,
            ]}
            pointerEvents="none"
        >
            <LottieView
                source={require('../assets/animations/Loading.json')}
                autoPlay
                loop
                style={{ width: size, height: size }}
            />
        </View>
    );
}
