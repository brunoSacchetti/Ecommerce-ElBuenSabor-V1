import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cliente } from '../../types/Cliente';

interface UserState {
  isLoggedIn: boolean;
  cliente: Cliente | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  cliente: null,
};

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Cliente>) => {
      state.isLoggedIn = true;
      state.cliente = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.cliente = null;
    },
  },
});

export const { login, logout } = userReducer.actions;

export default userReducer.reducer;
