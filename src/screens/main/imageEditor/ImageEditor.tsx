import React, {useState, useRef} from 'react';
import {View, Image, StyleSheet, Button, Alert, PanResponder, Dimensions, Animated} from 'react-native';
import {styles} from './styles';
import ImageEditor from '@react-native-community/image-editor';

export default function ImageEditorScreen({route}: any) {
  const {image} = route.params;
  const [editedUri, setEditedUri] = useState<string | null>(null);
  const window = Dimensions.get('window');
  const [cropBox, setCropBox] = useState({
    x: 50, y: 50, width: 200, height: 200,
  });
  const animCrop = React.useRef(new Animated.ValueXY({ x: 200, y: 200 })).current;
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // PanResponder for moving the crop box
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isResizing,
    onPanResponderMove: (e, gesture) => {
      if (!isResizing) {
        setCropBox(box => ({
          ...box,
          x: Math.max(0, Math.min(box.x + gesture.dx, window.width - box.width)),
          y: Math.max(0, Math.min(box.y + gesture.dy, window.height - box.height)),
        }));
      }
    },
    onPanResponderRelease: () => {},
  });

  /*
  // PanResponder for resizing the crop box (bottom right corner)
  const resizeResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsResizing(true);
      resizeStart.current = {
        x: cropBox.x,
        y: cropBox.y,
        width: cropBox.width,
        height: cropBox.height,
      };
    },
    onPanResponderMove: (e, gesture) => {
      setCropBox(box => {
        const newWidth = Math.max(50, Math.min(resizeStart.current.width + gesture.dx, window.width - box.x));
        const newHeight = Math.max(50, Math.min(resizeStart.current.height + gesture.dy, window.height - box.y));
        animCrop.setValue({ x: newWidth, y: newHeight });
        return {
          ...box,
          width: newWidth,
          height: newHeight,
        };
      });
    },
    onPanResponderRelease: () => {
      setIsResizing(false);
    },
  });
  */

  const handleCrop = async () => {
    try {
      const uri = typeof image === 'string' ? image : image.uri;
      // Ensure crop values are integers and within image bounds
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
      const croppedUri = await ImageEditor.cropImage(uri, cropData);
      setEditedUri(croppedUri);
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to crop image');
    }
  };

  // Animation for crop box resizing
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

  // Aspect ratio buttons
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

  return (
    <View style={styles.container}>
      <Image
        source={{uri: editedUri || (typeof image === 'string' ? image : image.uri)}}
        style={styles.image}
        resizeMode="contain"
      />
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
      >
        {/* Bottom right resize handle */}
        {/*
        <View
          style={{
            position: 'absolute',
            right: -15,
            bottom: -15,
            width: 30,
            height: 30,
            backgroundColor: 'rgba(255,0,0,0.5)',
            borderRadius: 15,
            zIndex: 10,
          }}
          {...resizeResponder.panHandlers}
        />
        */}
      </Animated.View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
        <Button title="Square" onPress={setSquare} />
        <View style={{ width: 10 }} />
        <Button title="16:9" onPress={set16x9} />
        <View style={{ width: 10 }} />
        <Button title="4:3" onPress={set4x3} />
      </View>
      <Button title="Crop" onPress={handleCrop} />
    </View>
  );
}
