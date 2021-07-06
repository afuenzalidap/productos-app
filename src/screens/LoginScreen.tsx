import React, { useContext, useEffect } from 'react';
import { View, Text, TextInput, Platform, TouchableOpacity, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { loginStyles } from '../theme/loginTheme';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}


export const LoginScreen = ({ navigation }: Props) => {


    const { signIn, errorMessage, removeError } = useContext(AuthContext);

    const { email, password, onChange } = useForm({
        email: '',
        password: ''
    });

    useEffect(() => {
        if( errorMessage.length === 0 ) return;

        Alert.alert(
            'Login incorrecto', 
            errorMessage,
            [
                {
                    text: 'Ok',
                    onPress: () => {
                        removeError();
                    }
                }
            ]
        );

    }, [errorMessage])

    const onLogin = () => {
        Keyboard.dismiss();

        signIn({
            correo: email,
            password
        })
    }

    return (
        <>
            <Background />

            <KeyboardAvoidingView
                style = {{ flex: 1 }}
                behavior={ (Platform.OS === 'ios') ? 'padding' : 'height' }
            >
            <View style = { loginStyles.formContainer }>
            <WhiteLogo />

            <Text style = { loginStyles.title }>Login</Text>

            <Text style = { loginStyles.label }>Email:</Text>
            <TextInput 
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.4)"
                underlineColorAndroid="white"
                keyboardType="email-address"
                style = {[
                    loginStyles.inputField,
                    (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                ]}
                selectionColor = "white"

                autoCapitalize = "none"
                autoCorrect = { false }

                onChangeText = { (value) => onChange(value, 'email') }
                value = { email }

                onSubmitEditing = { onLogin }
            />

            <Text style = { loginStyles.label }>Contraseña:</Text>
            <TextInput 
                placeholder="Pass"
                placeholderTextColor="rgba(255,255,255,0.4)"
                underlineColorAndroid="white"
                style = {[
                    loginStyles.inputField,
                    (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                ]}
                selectionColor = "white"
                
                autoCapitalize = "none"
                autoCorrect = { false }
                onChangeText = { (value) => onChange(value, 'password') }
                value = { password }
                onSubmitEditing = { onLogin }
                secureTextEntry = { true }
            />

            <View style={ loginStyles.buttonContainer }>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={ loginStyles.button }
                    onPress = { onLogin }
                >
                    <Text style = { loginStyles.buttonText }>Ingresar</Text>
                </TouchableOpacity>
            </View>

            <View style={ loginStyles.newUserContainer }>
                <TouchableOpacity
                    activeOpacity = {0.8}
                    onPress = { () => navigation.replace('RegisterScreen') }
                >
                    <Text style = { loginStyles.buttonText }>Nueva cuenta</Text>

                </TouchableOpacity>
            </View>

            </View>
            </KeyboardAvoidingView>
        </>
    )
}
