import Main from '@navigation';
import { store } from '@store/store';
import {Provider } from 'react-redux';

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
