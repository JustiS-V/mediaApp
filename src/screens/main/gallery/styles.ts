import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {flex: 1, padding: 8, backgroundColor: '#fff'},
  item: {margin: 4},
  image: {width: Dimensions.get('window').width / 3 - 12
, height: Dimensions.get('window').width / 3 - 12
, borderRadius: 8},
});