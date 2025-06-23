import React from 'react';
import {View, Image, StyleSheet, Button, Alert} from 'react-native';
import { styles } from './styles';

export default function ImageEditorScreen({route}: any) {
  const {image} = route.params;

  // Для расширенного редактирования используйте:
  // react-native-image-crop-picker или react-native-image-editor

  const handleEdit = () => {
    Alert.alert('Редактирование', 'Здесь будет функционал редактирования изображения.');
  };

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Button title="Редактировать" onPress={handleEdit} />
    </View>
  );
}
