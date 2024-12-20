import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ChatRoomResource } from "../../types/chatRoom";

export type ChatPopupState = {
    chatRooms: ChatRoomResource[]
}

const chatPopupSlice = createSlice({
    name: 'chatPopup',
    initialState: {
        chatRooms: []
    } as ChatPopupState,
    reducers: {
        add: (state, action: PayloadAction<ChatRoomResource>) => {
            if(!state.chatRooms.some(s => s.id === action.payload.id)) {
                state.chatRooms.push(action.payload);
            }
        },
        remove: (state, action: PayloadAction<string>) => {
            if(state.chatRooms.some(s => s.id === action.payload)) {
                state.chatRooms = state.chatRooms.filter(s => s.id !== action.payload)
            }
        }
    }
});

export const selectChatPopup = (state: RootState) => state.chatPopup;
export const { add, remove } = chatPopupSlice.actions;
export default chatPopupSlice.reducer;