import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ChatRoomResource } from "../../types/chatRoom";

export type ChatPopupState = {
    chatRoom: ChatRoomResource;
    state: 'open' | 'minimize'
}

export type ChatWindowsState = {
    chatRooms: ChatPopupState[];
}

const MAX_OPEN_POPUPS = 3;  

const chatPopupSlice = createSlice({
    name: 'chatPopup',
    initialState: {
        chatRooms: [],
    } as ChatWindowsState,
    reducers: {
        add: (state, action: PayloadAction<ChatRoomResource>) => {
            const index = state.chatRooms.findIndex(s => s.chatRoom.id === action.payload.id)
            if (index < 0) {
                const openPopups = state.chatRooms.filter(s => s.state === 'open');
                if (openPopups.length >= MAX_OPEN_POPUPS) {
                    const oldestOpen = openPopups[0]; 
                    const oldestIndex = state.chatRooms.findIndex(s => s.chatRoom.id === oldestOpen.chatRoom.id);
                    if (oldestIndex !== -1) {
                        state.chatRooms[oldestIndex].state = 'minimize';
                    }
                }

                // Thêm popup mới và đặt trạng thái là 'open'
                state.chatRooms.push({
                    chatRoom: action.payload,
                    state: 'open',
                });
            } else {
                state.chatRooms[index].state = 'open'
            }
        },
        remove: (state, action: PayloadAction<string>) => {
            if(state.chatRooms.some(s => s.chatRoom.id === action.payload)) {
                state.chatRooms = state.chatRooms.filter(s => s.chatRoom.id !== action.payload)
            }
        },
        expand: (state, action: PayloadAction<string>) => {
            const chat = state.chatRooms.find(s => s.chatRoom.id === action.payload);
            if (chat) {
                const openPopups = state.chatRooms.filter(s => s.state === 'open');
                if (openPopups.length >= MAX_OPEN_POPUPS) {
                    const oldestOpen = openPopups[0]; 
                    const oldestIndex = state.chatRooms.findIndex(s => s.chatRoom.id === oldestOpen.chatRoom.id);
                    if (oldestIndex !== -1) {
                        state.chatRooms[oldestIndex].state = 'minimize';
                    }
                }

                chat.state = 'open';
            }
        },
        minimize:  (state, action: PayloadAction<string>) => {
            const chat = state.chatRooms.find(s => s.chatRoom.id === action.payload);
            if (chat) {
                chat.state = 'minimize';
            }
        },
    }
});

export const selectChatPopup = (state: RootState) => state.chatPopup;
export const { add, remove, expand, minimize } = chatPopupSlice.actions;
export default chatPopupSlice.reducer;