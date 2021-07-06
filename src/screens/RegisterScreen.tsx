import React, { useContext, useEffect } from 'react';
import { View, Text, TextInput, Platform, TouchableOpacity, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { WhiteLogo } from '../components/WhiteLogo';
import { loginStyles } from '../theme/loginTheme';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { Background } from '../components/Background';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

export const RegisterScreen = ({ navigation }: Props) => {

    const { signUp, errorMessage, removeError } = useContext(AuthContext);

    const { email, password, name, onChange } = useForm({
        name: '',
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

    const onRegister = () => {
        Keyboard.dismiss();

        signUp({
            nombre: name,
            correo: email,
            password
        });
    }

    return (
        <>

            <KeyboardAvoidingView
                style = {{ flex: 1, backgroundColor: '#5856D6' }}
                behavior={ (Platform.OS === 'ios') ? 'padding' : 'height' }
            >
                <View style = { loginStyles.formContainer }>
                    <WhiteLogo />

                    <Text style = { loginStyles.title }>Registro</Text>

                    <Text style = { loginStyles.label }>Nombre:</Text>
                    <TextInput 
                        placeholder="Ingrese su nombre:"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid="white"
                        style = {[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor = "white"
                        autoCapitalize = "words"
                        autoCorrect = { false }
                        onChangeText = { (value) => onChange(value, 'name') }
                        value = { name }
                        onSubmitEditing = { onRegister }
                    />

                    <Text style = { loginStyles.label }>Email:</Text>
                    <TextInput 
                        placeholder="Ingrese su email:"
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
                        onSubmitEditing = { onRegister }
                    />

                    <Text style = { loginStyles.label }>Contraseña:</Text>
                    <TextInput 
                        placeholder="***********"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid="white"
                        secureTextEntry = { true }
                        style = {[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor = "white"
                        autoCapitalize = "none"
                        autoCorrect = { false }
                        onChangeText = { (value) => onChange(value, 'password') }
                        value = { password }
                        onSubmitEditing = { onRegister }
                    />

                    <View style={ loginStyles.buttonContainer }>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={ loginStyles.button }
                            onPress = { onRegister }
                        >
                            <Text style = { loginStyles.buttonText }>Crear cuenta</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        activeOpacity = {0.8}
                        onPress = { () => navigation.replace('LoginScreen') }
                        style = { loginStyles.buttonReturn }
                    >
                        <Text style = { loginStyles.buttonText }>Ingresar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}
