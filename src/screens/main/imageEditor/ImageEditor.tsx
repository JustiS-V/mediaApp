import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Button,
  Alert,
  PanResponder,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImageEditor from '@react-native-community/image-editor';
import CameraRoll from '@react-native-camera-roll/camera-roll';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Grayscale, Invert } from 'react-native-color-matrix-image-filters';

export default function ImageEditorScreen({ route }: any) {
  const { image } = route.params;
  const navigation = useNavigation();
  const window = Dimensions.get('window');

  const [originalUri] = useState(typeof image === 'string' ? image : image.uri);
  const [currentUri, setCurrentUri] = useState(originalUri);
  const [editedUri, setEditedUri] = useState<string | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<'none' | 'grayscale' | 'invert'>('none');

  const [cropBox, setCropBox] = useState({
    x: 50,
    y: 50,
    width: 200,
    height: 200,
  });
  const animCrop = useRef(new Animated.ValueXY({ x: 200, y: 200 })).current;

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await checkAndRequestPermission();
    })();
  }, []);

  const checkAndRequestPermission = async () => {
    try {
      let permission;

      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
      } else if (Platform.Version >= 33) {
        permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      } else {
        permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      }

      const currentStatus = await check(permission);

      if (currentStatus === RESULTS.GRANTED) {
        setHasPermission(true);
        return;
      }

      const requestStatus = await request(permission);

      if (requestStatus === RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        Alert.alert('Permission Denied', 'Storage permission is required to save images.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to check permissions');
    }
  };

  const requestPermissionManually = async () => {
    await checkAndRequestPermission();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gesture) => {
      setCropBox(box => ({
        ...box,
        x: Math.max(0, Math.min(box.x + gesture.dx, window.width - box.width)),
        y: Math.max(0, Math.min(box.y + gesture.dy, window.height - box.height)),
      }));
    },
    onPanResponderRelease: () => {},
  });

  const animateCropBox = (width: number, height: number) => {
    Animated.timing(animCrop, {
      toValue: { x: width, y: height },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCropBox(box => ({
        ...box,
        width,
        height,
      }));
    });
  };

  const setSquare = () => {
    const size = Math.min(window.width, window.height) * 0.5;
    animateCropBox(size, size);
  };

  const set16x9 = () => {
    const width = Math.min(window.width * 0.8, 320);
    const height = width * 9 / 16;
    animateCropBox(width, height);
  };

  const set4x3 = () => {
    const width = Math.min(window.width * 0.8, 320);
    const height = width * 3 / 4;
    animateCropBox(width, height);
  };

  const handleCrop = async () => {
    try {
      const uri = typeof image === 'string' ? image : image.uri;
      const cropData = {
        offset: { x: Math.round(cropBox.x), y: Math.round(cropBox.y) },
        size: { width: Math.round(cropBox.width), height: Math.round(cropBox.height) },
        displaySize: { width: Math.round(cropBox.width), height: Math.round(cropBox.height) },
        resizeMode: 'contain' as const,
      };
      if (!uri) {
        Alert.alert('Error', 'Image URI is not defined');
        return;
      }

      const croppedResult: any = await ImageEditor.cropImage(uri, cropData);
      setEditedUri(croppedResult.uri);
      setCurrentUri(croppedResult.uri);
      setAppliedFilter('none');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to crop image');
    }
  };

  const handleSave = async () => {
          Alert.alert('Info', 'Issue with saving image. Please check permissions.');
return
    try {
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to save the image.');
        return;
      }

      await CameraRoll.save(currentUri, { type: 'photo' });

      Alert.alert('Success', 'Image saved to gallery');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to save image');
    }
  };

  const handleReset = () => {
    setCurrentUri(originalUri);
    setEditedUri(null);
    setAppliedFilter('none');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderImage = () => {
    if (appliedFilter === 'grayscale') {
      return (
        <Grayscale>
          <Image source={{ uri: currentUri }} style={styles.image} resizeMode="contain" />
        </Grayscale>
      );
    }
    if (appliedFilter === 'invert') {
      return (
        <Invert>
          <Image source={{ uri: currentUri }} style={styles.image} resizeMode="contain" />
        </Invert>
      );
    }
    return <Image source={{ uri: currentUri }} style={styles.image} resizeMode="contain" />;
  };

  return (
    <View style={styles.container}>
      {renderImage()}
      <Animated.View
        style={{
          position: 'absolute',
          left: cropBox.x,
          top: cropBox.y,
          width: animCrop.x,
          height: animCrop.y,
          borderWidth: 2,
          borderColor: 'red',
        }}
        {...panResponder.panHandlers}
      />
      <View style={styles.buttonRow}>
        <Button title="Square" onPress={setSquare} />
        <Button title="16:9" onPress={set16x9} />
        <Button title="4:3" onPress={set4x3} />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Crop" onPress={handleCrop} />
        <Button title="Grayscale" onPress={() => setAppliedFilter('grayscale')} />
        <Button title="Invert Colors" onPress={() => setAppliedFilter('invert')} />
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Save"
          onPress={handleSave}
          disabled={!hasPermission}
          color={hasPermission ? undefined : 'gray'}
        />
        <Button title="Reset" onPress={handleReset} />
        <Button title="Cancel" onPress={handleCancel} />
      </View>

      {/* <View style={styles.permissionButton}>
        <Button title="Request Permission" onPress={requestPermissionManually} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '60%' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  permissionButton: { marginTop: 20 },
});
