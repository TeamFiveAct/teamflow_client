// src/store/modules/taskSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../../types/types';
import axios from 'axios';
import websocketService from '../../services/websocketService';

// API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_SERVER;

// 비동기 액션 생성자
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (spaceId: number, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/workspace/${spaceId}/todos`,
        {},
        { withCredentials: true }
      );
      
      console.log('API 응답 데이터:', response.data);
      
      if (response.data.status === 'SUCCESS') {
        const data = response.data.data;
        console.log('Tasks 데이터 구조:', data);
        console.log('Tasks 데이터 타입:', typeof data);
        console.log('배열 여부:', Array.isArray(data));
        
        // 데이터 구조 확인 및 변환
        if (Array.isArray(data)) {
          // 이미 배열인 경우 그대로 반환
          return data;
        } 
        // 데이터가 plan, progress, done 속성을 가진 객체인 경우
        else if (data && typeof data === 'object') {
          const transformedTasks = [];
          
          // plan 배열 처리 (plan -> open으로 매핑)
          if (Array.isArray(data.plan)) {
            transformedTasks.push(
              ...data.plan.map((task: any) => ({
                ...task,
                state: 'open' // status -> state로 변환
              }))
            );
          }
          
          // progress 배열 처리 (progress -> in_progress로 매핑)
          if (Array.isArray(data.progress)) {
            transformedTasks.push(
              ...data.progress.map((task: any) => ({
                ...task,
                state: 'in_progress' // status -> state로 변환
              }))
            );
          }
          
          // done 배열 처리 (done은 그대로 유지)
          if (Array.isArray(data.done)) {
            transformedTasks.push(
              ...data.done.map((task: any) => ({
                ...task,
                state: 'done' // status -> state로 변환
              }))
            );
          }
          
          console.log('변환된 Tasks:', transformedTasks);
          return transformedTasks;
        }
        // 데이터가 객체이고 tasks 속성이 있는 경우
        else if (data && typeof data === 'object' && Array.isArray(data.tasks)) {
          return data.tasks;
        }
        // 그 외의 경우 빈 배열 반환
        return [];
      } else {
        return rejectWithValue(response.data.message || '업무 목록을 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('API 요청 오류:', error);
      return rejectWithValue('업무 목록 요청 중 오류가 발생했습니다.');
    }
  }
);

export const fetchTasksByState = createAsyncThunk(
  'tasks/fetchTasksByState',
  async ({ spaceId, state, limit = 5, offset = 0 }: { spaceId: number; state: string; limit?: number; offset?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/workspace/${spaceId}/todos/statelodeed`,
        { state, limit, offset },
        { withCredentials: true }
      );
      
      if (response.data.status === 'SUCCESS') {
        return { state, tasks: response.data.data };
      } else {
        return rejectWithValue(response.data.message || '업무 목록을 불러오지 못했습니다.');
      }
    } catch (error) {
      return rejectWithValue('업무 목록 요청 중 오류가 발생했습니다.');
    }
  }
);

export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async ({ spaceId, task }: { spaceId: number; task: Omit<Task, 'todo_id'> }, { rejectWithValue }) => {
    try {
      // 원본 상태 로깅
      console.log('원본 task 데이터:', task);
      console.log('task.state 값:', task.state);
      
      // API 요청을 위해 state 필드를 status 필드로 변환
      // state 필드를 제외한 나머지 필드를 복사하고, status 필드 추가
      const { state, ...restTask } = task;
      
      // 상태 변환 로직 확인
      const statusValue = state === 'open' ? 'plan' : 
                          state === 'in_progress' ? 'progress' : 'done';
      console.log('변환된 status 값:', statusValue);
      
      const apiTask = {
        ...restTask,
        status: statusValue
      };
      
      console.log('최종 API 요청 데이터:', apiTask);
      
      // API 요청 URL 로깅
      const url = `${API_BASE_URL}/workspace/${spaceId}/todos/add`;
      console.log('API 요청 URL:', url);
      
      // 요청 데이터 로깅
      console.log('API 요청 데이터 (JSON):', JSON.stringify(apiTask, null, 2));
      
      // 요청 헤더 로깅
      const config = { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      console.log('API 요청 헤더:', config);
      
      const response = await axios.post(
        url,
        apiTask,
        config
      );
      
      console.log('API 응답 데이터:', response.data);
      
      if (response.data.status === 'SUCCESS') {
        // API 응답에 state 필드 추가
        const responseData = response.data.data;
        console.log('응답 데이터의 status 값:', responseData.status);
        
        const convertedState = responseData.status === 'plan' ? 'open' : 
                               responseData.status === 'progress' ? 'in_progress' : 'done';
        console.log('변환된 state 값:', convertedState);
        
        const taskWithState = {
          ...responseData,
          state: convertedState
        };
        
        // WebSocket 이벤트 발신
        websocketService.emitTaskCreated(spaceId, taskWithState);
        
        return taskWithState;
      } else {
        return rejectWithValue(response.data.message || '업무 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('업무 생성 오류:', error);
      return rejectWithValue('업무 생성 요청 중 오류가 발생했습니다.');
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ spaceId, taskId, updates }: { spaceId: number; taskId: number; updates: Partial<Task> }, { rejectWithValue }) => {
    try {
      // state 필드가 있으면 status로 변환
      const { state, ...restUpdates } = updates;
      const apiUpdates = {
        ...restUpdates,
        ...(state && {
          status: state === 'open' ? 'plan' : 
                  state === 'in_progress' ? 'progress' : 'done'
        })
      };
      
      console.log('API 업데이트 요청 데이터:', apiUpdates);
      
      const response = await axios.patch(
        `${API_BASE_URL}/workspace/${spaceId}/todos/${taskId}`,
        apiUpdates,
        { withCredentials: true }
      );
      
      if (response.data.status === 'SUCCESS') {
        // 원래 업데이트 내용 반환 (프론트엔드 상태 업데이트용)
        const updatedTask = { todo_id: taskId, ...updates };
        
        // WebSocket 이벤트 발신
        websocketService.emitTaskUpdated(spaceId, updatedTask);
        
        return updatedTask;
      } else {
        return rejectWithValue(response.data.message || '업무 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('업무 수정 오류:', error);
      return rejectWithValue('업무 수정 요청 중 오류가 발생했습니다.');
    }
  }
);

export const updateTaskStateAsync = createAsyncThunk(
  'tasks/updateTaskState',
  async ({ spaceId, taskId, state }: { spaceId: number; taskId: number; state: 'open' | 'in_progress' | 'done' }, { rejectWithValue }) => {
    try {
      // 프론트엔드 state를 API status로 변환
      const status = state === 'open' ? 'plan' : 
                     state === 'in_progress' ? 'progress' : 'done';
      
      console.log('API 상태 변경 요청 데이터:', { status });
      
      const response = await axios.patch(
        `${API_BASE_URL}/workspace/${spaceId}/todos/state/${taskId}`,
        { status }, // API는 status 필드를 사용
        { withCredentials: true }
      );
      
      if (response.data.status === 'SUCCESS') {
        // WebSocket 이벤트 발신
        websocketService.emitTaskStateChanged(spaceId, taskId, state);
        
        // 프론트엔드 상태 업데이트를 위해 원래 state 값 반환
        return { todo_id: taskId, state };
      } else {
        return rejectWithValue(response.data.message || '업무 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('업무 상태 변경 오류:', error);
      return rejectWithValue('업무 상태 변경 요청 중 오류가 발생했습니다.');
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async ({ spaceId, taskId }: { spaceId: number; taskId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/workspace/${spaceId}/todos/${taskId}`,
        { withCredentials: true }
      );
      
      if (response.data.status === 'SUCCESS') {
        // WebSocket 이벤트 발신
        websocketService.emitTaskDeleted(spaceId, taskId);
        
        return taskId;
      } else {
        return rejectWithValue(response.data.message || '업무 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('업무 삭제 오류:', error);
      return rejectWithValue('업무 삭제 요청 중 오류가 발생했습니다.');
    }
  }
);

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  nextID: number;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  nextID: 1,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    initializeTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.nextID =
        action.payload.length > 0
          ? Math.max(...action.payload.map((task: Task) => task.todo_id)) + 1
          : 1;
    },
    createTask: (state, action: PayloadAction<Omit<Task, 'todo_id'>>) => {
      const newTask: Task = {
        ...action.payload,
        todo_id: state.nextID,
      };
      state.tasks.push(newTask);
      state.nextID += 1;
    },
    updateTask: (
      state,
      action: PayloadAction<{
        todo_id: number;
        title?: string;
        description?: string;
        priority?: 'small' | 'medium' | 'high' | 'very_high';
        state?: 'open' | 'in_progress' | 'done';
        start_date?: string;
        due_date?: string;
      }>,
    ) => {
      const taskIndex = state.tasks.findIndex(
        task => task.todo_id === action.payload.todo_id,
      );
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...action.payload,
        };
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.todo_id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchTasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      // 데이터가 배열인지 확인하고, 아니면 빈 배열로 설정
      state.tasks = Array.isArray(action.payload) ? action.payload : [];
      state.nextID = state.tasks.length > 0
        ? Math.max(...state.tasks.map((task: Task) => task.todo_id)) + 1
        : 1;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchTasksByState
    builder.addCase(fetchTasksByState.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasksByState.fulfilled, (state, action) => {
      state.loading = false;
      // 기존 다른 상태의 태스크는 유지하고, 해당 상태의 태스크만 업데이트
      const otherTasks = state.tasks.filter((task: Task) => task.state !== action.payload.state);
      state.tasks = [...otherTasks, ...action.payload.tasks];
      
      if (action.payload.tasks.length > 0) {
        const maxId = Math.max(...action.payload.tasks.map((task: Task) => task.todo_id));
        state.nextID = Math.max(state.nextID, maxId + 1);
      }
    });
    builder.addCase(fetchTasksByState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createTaskAsync
    builder.addCase(createTaskAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTaskAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks.push(action.payload);
      state.nextID = Math.max(state.nextID, action.payload.todo_id + 1);
    });
    builder.addCase(createTaskAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateTaskAsync
    builder.addCase(updateTaskAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTaskAsync.fulfilled, (state, action) => {
      state.loading = false;
      const taskIndex = state.tasks.findIndex(
        task => task.todo_id === action.payload.todo_id
      );
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...action.payload,
        };
      }
    });
    builder.addCase(updateTaskAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateTaskStateAsync
    builder.addCase(updateTaskStateAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTaskStateAsync.fulfilled, (state, action) => {
      state.loading = false;
      const taskIndex = state.tasks.findIndex(
        task => task.todo_id === action.payload.todo_id
      );
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          state: action.payload.state,
        };
      }
    });
    builder.addCase(updateTaskStateAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // deleteTaskAsync
    builder.addCase(deleteTaskAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTaskAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter(task => task.todo_id !== action.payload);
    });
    builder.addCase(deleteTaskAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { 
  initializeTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  setError,
  clearError
} = taskSlice.actions;
export default taskSlice.reducer;
