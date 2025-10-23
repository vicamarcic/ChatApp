import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    View,ScrollView
} from 'react-native';

const ios = Platform.OS === 'ios';

export default function CustomKeyboardView({children}) {

    return (
            <KeyboardAvoidingView
                behavior={ios ? 'padding' : 'height'}
                style={{ flex: 1}}
                keyboardVerticalOffset={80}
            >
               <ScrollView
                   style ={{flex:1}}
                   contentContainerStyle={{flex:1}}
                   bounces={false}
                   showsVerticalScrollIndicator={false}
               >
                   {
                       children
                   }
               </ScrollView>
            </KeyboardAvoidingView>

    );
}
