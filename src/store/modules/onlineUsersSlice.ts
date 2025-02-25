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
      
      // 중복 제거: userId를 기준으로 중복 사용자 제거
      const uniqueUsers = Array.from(
        new Map(action.payload.map(user => [user.userId, user])).values()
      );
      
      state.users = uniqueUsers;
      console.log('[onlineUsersSlice] 업데이트된 상태 (중복 제거 후):', state.users);
    }
  }
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
