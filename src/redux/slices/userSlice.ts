import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICliente } from '../../types/Cliente';

interface UserState {
  isLoggedIn: boolean;
  cliente: ICliente | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  cliente: null,
};

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ICliente>) => {
      state.isLoggedIn = true;
      state.cliente = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.cliente = null;
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout  } = userReducer.actions;

export default userReducer.reducer;
