import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/slices/auth-slice'
import chatPopupReducer from '../features/slices/chat-popup-slice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        chatPopup: chatPopupReducer
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export default store