import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkspaceUser } from '../../services/websocketService';

interface OnlineUsersState {
  users: WorkspaceUser[];
}

const initialState: OnlineUsersState = {
  users: []
};

const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<WorkspaceUser[]>) => {
      console.log('[onlineUsersSlice] setOnlineUsers 액션:', action.payload);
      state.users = action.payload;
      console.log('[onlineUsersSlice] 업데이트된 상태:', state.users);
    }
  }
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
