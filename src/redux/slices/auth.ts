import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { UserRole } from "../../types/UserRole"

interface IInitalState{
    user: string | null,
    rol: UserRole | null,
    isLogged: boolean
}

interface LoginPayload {
    user: string,
    rol:  UserRole | null,
}

const initialState: IInitalState = {
    user: null,
    isLogged: false,
    rol: null,
}


const AuthUser = createSlice({
    name: 'authUser',
    initialState,
    reducers: {
        setLogin: (state, action: PayloadAction<LoginPayload>) => {
            state.user = action.payload.user;
            state.isLogged = true;
            state.rol = action.payload.rol;
        },
        setLogout: (state) => {
            state.user = null;
            state.isLogged = false;
            state.rol = null;
        }
    }
})

export const { setLogin, setLogout } = AuthUser.actions;

export default AuthUser.reducer;