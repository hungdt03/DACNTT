import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserResource } from "../../types/user";
import { AuthResponse } from "../../types/response";
import { RootState } from "../../app/store";

export type AuthState = {
    user?: UserResource;
    accessToken?: string;
    refreshToken?: string;
    isAuthenticated: boolean;
    isInitialized: boolean;
}

export type InititalState = {
    isAuthenticated: boolean;
    user?: UserResource
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: undefined,
        refreshToken: undefined,
        isAuthenticated: false,
        user: undefined,
        isInitialized: false
    } as AuthState,
    reducers: {
        signIn: (state, action: PayloadAction<AuthResponse>) => {
            localStorage.setItem('accessToken', action.payload.token.accessToken)
            localStorage.setItem('refreshToken', action.payload.token.refreshToken)
            state.user = action.payload.user
            state.accessToken = action.payload.token.accessToken
            state.refreshToken = action.payload.token.refreshToken
            state.isAuthenticated = true
        },
        signOut: (state) => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            state.user = undefined
            state.accessToken = undefined
            state.refreshToken = undefined
            state.isAuthenticated = false
        },
        initialize: (state, action: PayloadAction<InititalState>) => {
            state.user = action.payload.user
            state.isAuthenticated = action.payload.isAuthenticated;
            state.isInitialized = true;
        },
        setUserDetails: (state, action: PayloadAction<UserResource>) => {
            state.user = action.payload
        }
    }
});

export const selectAuth = (state: RootState) => state.auth;
export const { signIn, signOut,  initialize, setUserDetails } = authSlice.actions;
export default authSlice.reducer;