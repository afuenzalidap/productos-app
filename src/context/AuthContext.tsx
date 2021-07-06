import React,{ createContext, useReducer, useEffect } from "react";
import cafeApi from "../api/cafeApi";
import { Usuario, LoginResponse, LoginData, RegisterData } from '../interfaces/appInterfaces';
import { authReducer, AuthState } from './authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';


type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (registerData: RegisterData) => void;
    signIn: (loginData: LoginData) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInitialState);

    useEffect(() => {
        checkToken();
    }, [])

    const checkToken = async() => {
        const token = await AsyncStorage.getItem('token');
        // no token = no autenticado
        if(!token) return dispatch({type: 'notAuthenticated'})

        const resp = await cafeApi.get('/auth');
        if( resp.status !== 200 ){
            return dispatch({ type: 'notAuthenticated' });
        }

        dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        });

    }

    const signIn = async( { correo, password }: LoginData) => {
        try{
            const { data } = await cafeApi.post<LoginResponse>('/auth/login',{
                correo,
                password
            });

            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);

        }catch (error){
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Información incorrecta'
            });
        }
    }
    const signUp = async ({ nombre, correo, password }: RegisterData) => {
        try{
            const { data } = await cafeApi.post<LoginResponse>('/usuarios',{
                nombre,
                correo,
                password
            });

            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);

        }catch (err){
            dispatch({
                type: 'addError',
                payload: err.response.data.msg || 'Información incorrecta'
            });
        }
    }

    const logOut = async () => {

        await AsyncStorage.removeItem('token');

        dispatch({
            type: 'logout'
        })
    }
    const removeError = () => {
        dispatch({
            type: 'removeError'
        })
    }

    return (
        <AuthContext.Provider value = {{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,
        }}>
            { children }
        </AuthContext.Provider>
    )
}