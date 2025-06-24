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
import { CameraRoll, PhotoIdentifier, GetPhotosReturnType } from '@react-native-camera-roll/camera-roll';

export default function GalleryScreen() {

  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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

      setPhotos(prev => {
        // Avoid duplicates if after is the same
        if (after && prev.length && res.edges.length && prev[prev.length - 1].node.image.uri === res.edges[0].node.image.uri) {
          return prev;
        }
        return [...prev, ...res.edges];
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (img: PhotoIdentifier) => {
    console.log('Selected image:', img.node.image.uri);
    navigation.navigate('ImageEditor', { image: img.node.image.uri });
  };

  const handleEndReached = () => {
    if (!loading && hasNextPage) {
      fetchPhotos();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
            <Image
              source={{ uri: item.node.image.uri }}
              style={styles.image}
              resizeMode="cover"
              // Use cache for better performance
              cache="force-cache"
            />
          </TouchableOpacity>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        initialNumToRender={30}
        windowSize={15} // Increase window size for smoother scroll
        removeClippedSubviews
        maxToRenderPerBatch={15} // Limit batch rendering
        updateCellsBatchingPeriod={50}
        getItemLayout={(_, index) => ({
          length: styles.image.height,
          offset: styles.image.height * index,
          index,
        })}
        // Avoid unnecessary re-renders
        extraData={photos.length}
      />
    </View>
  );
}

// Optionally, you can use a library like 'react-native-fast-image' for better caching.
// import FastImage from 'react-native-fast-image';

// To use FastImage for better caching, replace Image with FastImage:
/*
renderItem={({ item }) => (
  <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
    <FastImage
      source={{ uri: item.node.image.uri, priority: FastImage.priority.normal }}
      style={styles.image}
      resizeMode={FastImage.resizeMode.cover}
    />
  </TouchableOpacity>
)}
*/
// Otherwise, continue using Image with cache prop (works only on iOS/Expo):
