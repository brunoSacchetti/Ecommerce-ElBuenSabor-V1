import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IArticulo from '../../types/IArticulo';

interface CartState {
  totalCount: number;
  productsList: IArticulo[];
  productQuantities: { [id: number]: number };
}

const initialState: CartState = {
  totalCount: 0,
  productsList: [],
  productQuantities: {},
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    addProductToCart: (state, action: PayloadAction<IArticulo>) => {
      const { id } = action.payload;
      if (!state.productsList.find((product) => product.id === id)) {
        state.productsList.push(action.payload);
        state.totalCount += 1;
      }
      state.productQuantities[id] = Math.max(state.productQuantities[id] || 0, 1); // Al añadir, asegura que la cantidad mínima sea 1
    },
    removeProductFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.totalCount -= 1;
      state.productsList = state.productsList.filter((product) => product.id !== productId);
      state.productQuantities[productId] = 0; // Al quitar, la cantidad se establece en 0
    },
    updateProductQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      state.productQuantities[id] = Math.max(quantity, 1); // Asegura que la cantidad no sea menor que 1
    },
    resetCart: (state) => {
      state.totalCount = 0;
      state.productsList = [];
      state.productQuantities = {};
    },
  },
});

export const { addProductToCart, removeProductFromCart, updateProductQuantity, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
