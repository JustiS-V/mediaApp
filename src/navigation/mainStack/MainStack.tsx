import {createStackNavigator} from '@react-navigation/stack';
import { GalleryScreen, ImageEditorScreen,  } from '@screens';

const MainStackNav = createStackNavigator();

export default function MainStack() {
  return (
    <MainStackNav.Navigator>
      <MainStackNav.Screen name="Gallery" component={GalleryScreen} />
      <MainStackNav.Screen name="ImageEditor" component={ImageEditorScreen} />
    </MainStackNav.Navigator>
  );
}
