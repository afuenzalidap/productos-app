import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Button, Image, Alert } from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';
import { Picker } from '@react-native-picker/picker';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'>{}


export const ProductScreen = ({route, navigation}: Props) => {    

    const { id = '', name = '' } = route.params;

    const [tempUri, setTempUri] = useState<string>('');

    const { categories } = useCategories();
    const { loadProductById, addProduct, updateProduct, deleteProduct, uploadImage } = useContext(ProductsContext);

    const { _id, categoriaId, nombre, img, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: ''
    });


    useEffect(() => {
        navigation.setOptions({
            title: (nombre) ? nombre : 'Nuevo producto'
        });
    }, [nombre]);

    useEffect(() => {
        loadProducto();
    }, [])

    const loadProducto = async() => {
        if( id.length === 0 ) return;
        const product = await loadProductById( id );

        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre: product.nombre
        });
    }

    const saveOrUpdate = async() => {
        if( _id.length > 0 ){
            console.log('Actualizar');
            updateProduct( categoriaId, nombre, id );
        }else{
            //Actualizar
            /* if ( categoriaId.length === 0 ){
                onChange( categories[0]._id, 'categoriaId' );
            } */

            const tempCategoriaId = categoriaId || categories[0]._id;
            const newProduct = await addProduct( tempCategoriaId, nombre );
            onChange( newProduct._id, '_id');
        }
    }

    const deleteItem = async () => {
        if( _id.length > 0 ){
            await deleteProduct(_id);
        }
    }

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5
        }, (resp) => {
            if ( resp.didCancel ) return;
            if( !resp.uri ) return;

            setTempUri( resp.uri );

            uploadImage( resp, _id )
        });
    }

    const takePhotoFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5
        },(resp) => {
            if ( resp.didCancel ) return;
            if( !resp.uri ) return;

            setTempUri( resp.uri );

            uploadImage( resp, _id );
        })
    }

    return (
        <View style = { styles.container }>
            <ScrollView>
                <Text style = { styles.label} >Nombre del producto:</Text>
                <TextInput 
                    placeholder = "Producto"
                    style = { styles.textInput }
                    value = { nombre }
                    onChangeText = { (value) => onChange(value,'nombre') }
                />

                <Text style = { styles.label} >Selecciona categoria:</Text>
                <Picker
                    selectedValue={ categoriaId }
                    onValueChange={( value) => onChange(value, 'categoriaId') }
                    >

                    {
                        categories.map( c => (
                            <Picker.Item 
                                label = { c.nombre }
                                value = { c._id }
                                key = { c._id }
                            />
                        ))
                    }
                </Picker>

                <Button
                    title = "Guardar"
                    onPress = { saveOrUpdate }
                    color = "#5856D6"
                />

                {
                    (_id.length > 0) && (
                        <View>
                            <View style = {{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                <Button
                                    title = "Camara"
                                    onPress = { takePhoto }
                                    color = "#5856D6"
                                />

                                <View style = {{ width: 10 }} />

                                <Button
                                    title = "Galeria"
                                    onPress = { takePhotoFromGallery }
                                    color = "#5856D6"
                                />
                            </View>

                            <View style = {{ flex: 1, justifyContent: 'flex-end', marginTop: 10 }}>
                                <Button
                                    title = "Eliminar"
                                    onPress = { deleteItem }
                                    color = "red"
                                />
                            </View>
                        </View>
                    )
                }

                {
                    (img.length > 0) && (
                        <Image
                            source = {{ uri: img }}
                            style = {{
                                marginTop: 20,
                                width: '100%',
                                height: 300
                            }}
                        />
                    )
                }

                {/* Imagen temporal */}

                {
                    (tempUri.length > 0) && (
                        <Image
                            source = {{ uri: tempUri }}
                            style = {{
                                marginTop: 20,
                                width: '100%',
                                height: 300
                            }}
                        />
                    )
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 10
    }
});