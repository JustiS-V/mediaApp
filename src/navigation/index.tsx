import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';

import {setUser} from '@store/authSlice';
import {RootState} from '@store/store';

import AuthStack from './authStack/AuthStack';
import MainStack from './mainStack/MainStack';

function Main() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => {
      dispatch(setUser(u ? {uid: u.uid, email: u.email} : null));
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default Main;