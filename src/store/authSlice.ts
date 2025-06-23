import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface User {
  uid: string;
  email: string | null;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
});

export const {setUser} = authSlice.actions;
export default authSlice.reducer;
