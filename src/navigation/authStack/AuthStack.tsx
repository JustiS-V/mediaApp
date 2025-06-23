import {createStackNavigator} from '@react-navigation/stack';
import { SignInScreen, SignUpScreen } from '@screens';

const AuthStackNav = createStackNavigator();

export default function AuthStack() {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen name="SignIn" component={SignInScreen} />
      <AuthStackNav.Screen name="SigтUp" component={SignUpScreen} />
    </AuthStackNav.Navigator>
  );
}
