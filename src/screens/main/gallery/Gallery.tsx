import React, {useEffect, useState, useCallback} from 'react';
import {View, FlatList, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CameraRoll, {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {styles} from './styles';

export default function GalleryScreen() {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    if (loading || !hasNextPage) return;
    setLoading(true);
    try {
      const res = await CameraRoll.getPhotos({
        first: 30,
        after: after,
        assetType: 'Photos',
      });
      setPhotos(prev => [...prev, ...res.edges]);
      setAfter(res.page_info.end_cursor);
      setHasNextPage(res.page_info.has_next_page);
    } finally {
      setLoading(false);
    }
  }, [after, hasNextPage, loading]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleSelect = (img: PhotoIdentifier) => {
   // navigation.navigate('ImageEditor' as never, {image: img.node.image.uri} as never);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={3}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
            <Image source={{uri: item.node.image.uri}} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        )}
        onEndReached={fetchPhotos}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
}
