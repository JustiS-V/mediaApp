import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import CameraRoll, { PhotoIdentifier, GetPhotosReturnType } from '@react-native-camera-roll/camera-roll';

export default function GalleryScreen() {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  async function hasAndroidPermission() {
    // ... ваша проверка разрешений без изменений ...
  }

  async function savePicture() {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
    // CameraRoll.save(tag, { type, album })
  }

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Gallery Permission',
          message: 'App needs access to your gallery',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS: запрос идет автоматически
  };

  const fetchPhotos = useCallback(async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);

    try {
      const res: GetPhotosReturnType = await CameraRoll.getPhotos({
        first: 30,
        after: after,
        assetType: 'Photos',
      });

      console.log('Loaded photos: ', res.edges.length);

      setPhotos(prev => [...prev, ...res.edges]);
      setAfter(res.pageInfo.endCursor);
      setHasNextPage(res.pageInfo.hasNextPage);
    } catch (error) {
      console.warn('Error loading photos', error);
    } finally {
      setLoading(false);
    }
  }, [after, hasNextPage, loading]);

  useEffect(() => {
    const load = async () => {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        fetchPhotos();
      } else {
        console.warn('Permission denied');
      }
    };
    load();
  }, []);

  const handleSelect = (img: PhotoIdentifier) => {
    console.log('Selected image:', img.node.image.uri);
    // navigation.navigate('ImageEditor' as never, { image: img.node.image.uri } as never);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
            <Image source={{ uri: item.node.image.uri }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        )}
        onEndReached={fetchPhotos}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
}
