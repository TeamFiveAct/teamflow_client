import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types/types';
import axios from 'axios';

interface TaskState {
  tasks: Task[];
  nextID: number;
  loadedTasks: number;
}

const initialState: TaskState = {
  tasks: [],
  nextID: 1,
  loadedTasks: 5,
};

// ✅ 투두 생성 (서버에서 응답받아 반영)
// export const createTaskAsync = createAsyncThunk(
//   'tasks/createTask',
//   async (taskData: Omit<Task, 'todo_id'>) => {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/add`,
//       taskData,
//       { withCredentials: true },
//     );
//     return response.data; // 서버에서 생성된 Task 반환 (todo_id 포함)
//   },
// );
export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async ({ spaceId, newTask }: { spaceId: string; newTask: Task }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${spaceId}/todos`,
        newTask,
        { withCredentials: true },
      );
      if (response.data.status === 'SUCCESS') {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('업무 생성 실패:', error);
      throw error;
    }
  },
);

// ✅ 투두 수정 (서버에서 응답받아 반영)
// export const updateTaskAsync = createAsyncThunk(
//   'tasks/updateTask',
//   async (updatedTask: { todo_id: number } & Partial<Task>) => {
//     const response = await axios.patch(
//       `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/${updatedTask.todo_id}`,
//       updatedTask,
//       { withCredentials: true },
//     );
//     return response.data; // 서버에서 업데이트된 Task 반환
//   },
// );
export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ spaceId, updatedTask }: { spaceId: string; updatedTask: Task }) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_SERVER}/workspace/${spaceId}/todos/${updatedTask.todo_id}`,
      updatedTask,
      { withCredentials: true },
    );
    return response.data; // 서버에서 업데이트된 Task 반환
  },
);

// ✅ 투두 삭제 (서버에서 응답받아 반영)
// export const deleteTaskAsync = createAsyncThunk(
//   'tasks/deleteTask',
//   async (todo_id: number) => {
//     await axios.delete(
//       `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/${todo_id}`,
//       {
//         withCredentials: true,
//       },
//     );
//     return todo_id; // 삭제된 todo_id 반환
//   },
// );
export const deleteTaskAsync = createAsyncThunk<
  number, // 반환 타입을 number로 지정
  { spaceId: string; taskId: number }
>('tasks/deleteTask', async ({ spaceId, taskId }, { rejectWithValue }) => {
  try {
    if (!spaceId) {
      return rejectWithValue('space_id가 존재하지 않습니다.');
    }

    const response = await axios.delete(
      `${process.env.REACT_APP_API_SERVER}/workspace/${spaceId}/todos/${taskId}`,
      { withCredentials: true },
    );
    if (response.data.status === 'SUCCESS') {
      return taskId; // 삭제된 taskId 반환
    } else {
      return rejectWithValue(response.data.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('삭제 실패');
  }
});

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    initializeTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.nextID =
        action.payload.length > 0
          ? action.payload[action.payload.length - 1].todo_id + 1
          : 1;
    },
  },
  extraReducers: builder => {
    // ✅ 생성 요청 후 상태 업데이트
    builder.addCase(createTaskAsync.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    });

    // ✅ 수정 요청 후 상태 업데이트
    builder.addCase(updateTaskAsync.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(
        task => task.todo_id === action.payload.todo_id,
      );
      if (index !== -1) {
        state.tasks[index] = action.payload; // 서버에서 받은 최신 데이터로 업데이트
      }
    });

    // ✅ 삭제 요청 후 상태 업데이트
    builder.addCase(deleteTaskAsync.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(task => task.todo_id !== action.payload);
    });
  },
});

export const { initializeTasks } = taskSlice.actions;
export default taskSlice.reducer;

// ========================================== ver2, 수정과 생성이 ui에 반영되지만 즉각반영이 안되 에러가 생김.
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { Task } from '../../types/types';
// import axios from 'axios';

// interface TaskState {
//   tasks: Task[];

//   nextID: number;
//   loadedTasks: number;
// }

// const initialState: TaskState = {
//   tasks: [],

//   nextID: 1,
//   loadedTasks: 5,
// };

// export const moveTaskAsync = createAsyncThunk(
//   'tasks/moveTask',
//   async ({
//     todo_id,
//     newState,
//   }: {
//     todo_id: number;
//     newState: 'plan' | 'progress' | 'done';
//   }) => {
//     // 서버에 요청을 보내서 상태를 업데이트하고, 업데이트된 상태를 반환하는 코드 작성
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_SERVER}/tasks/${todo_id}/move`,
//       { newState },
//       { withCredentials: true },
//     );
//     return response.data; // 서버에서 반환한 업데이트된 데이터
//   },
// );

// export const loadTasksAsync = createAsyncThunk(
//   'tasks/loadTasksAsync',
//   async (space_id: string) => {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos`,
//       {},
//       { withCredentials: true },
//     );
//     return response.data.data;
//   },
// );

// export const taskSlice = createSlice({
//   name: 'tasks',
//   initialState,
//   reducers: {
//     initializeTasks: (state, action: PayloadAction<Task[]>) => {
//       state.tasks = action.payload;
//       state.nextID =
//         action.payload.length > 0
//           ? action.payload[action.payload.length - 1].todo_id + 1
//           : 1;
//     },
//     createTask: (state, action: PayloadAction<Omit<Task, 'todo_id'>>) => {
//       const newTask: Task = {
//         ...action.payload,
//         todo_id: state.nextID,
//       };
//       state.tasks.push(newTask);
//       state.nextID += 1;
//     },
//     updateTask: (
//       state,
//       action: PayloadAction<{
//         todo_id: number;
//         title?: string;
//         description?: string;
//         priority?: 'low' | 'medium' | 'high';
//         status?: 'plan' | 'progress' | 'done';
//         start_date?: string;
//         due_date?: string;
//       }>,
//     ) => {
//       const taskIndex = state.tasks.findIndex(
//         task => task.todo_id === action.payload.todo_id,
//       );
//       if (taskIndex !== -1) {
//         state.tasks[taskIndex] = {
//           ...state.tasks[taskIndex],
//           ...action.payload,
//         };
//       }
//     },
//     deleteTask: (state, action: PayloadAction<number>) => {
//       console.log('삭제 액션 실행됨, 삭제할 ID:', action.payload);
//       return state.filter(task => task.todo_id !== action.payload); // ✅ return 방식 사용
//     }
//     },
//     // ✅ 추가: 무한 스크롤을 위한 로드 기능
//     loadMoreTasks: state => {
//       const allTasks = [...state.tasks]; // 전체 데이터 (DB에서 가져온다고 가정)
//       const nextBatch = allTasks.slice(
//         state.loadedTasks,
//         state.loadedTasks + 10,
//       );
//       state.tasks = [...state.tasks, ...nextBatch];
//       state.loadedTasks += nextBatch.length;
//     },
//     // 🟢 추가: 드래그 & 드랍을 위한 상태 변경 액션
//     moveTask: (
//       state,
//       action: PayloadAction<{
//         todo_id: number;
//         newState: 'plan' | 'progress' | 'done';
//       }>,
//     ) => {
//       const task = state.tasks.find(
//         task => task.todo_id === action.payload.todo_id,
//       );
//       if (task) {
//         task.status = action.payload.newState; // 상태 업데이트
//       }
//     },
//     loadTasksAsync: (state, action) => {
//       state.tasks = action.payload;
//     },
//   },
//   extraReducers: builder => {
//     builder.addCase(moveTaskAsync.fulfilled, (state, action) => {
//       const updatedTask = action.payload;
//       const index = state.tasks.findIndex(
//         task => task.todo_id === updatedTask.todo_id,
//       );
//       if (index !== -1) {
//         state.tasks[index] = updatedTask;
//       }
//     });
//   },
// });

// export const { initializeTasks, createTask, updateTask, deleteTask, moveTask } =
//   taskSlice.actions;
// export default taskSlice.reducer;

// ========================================== ver1

// import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// import { Task } from '../../types/types';

// // 비동기 액션을 위한 createAsyncThunk 정의
// // export const moveTaskAsync = createAsyncThunk(
// //   'tasks/moveTaskStatusAsync', // 액션 이름
// //   async (
// //     {
// //       todo_id,
// //       newState,
// //     }: { todo_id: number; newState: 'plan' | 'progress' | 'done' },
// //     { rejectWithValue },
// //   ) => {
// //     try {
// //       // 여기서 비동기 작업을 할 수 있습니다 (예: 서버에 업데이트 요청)
// //       // 예시로 서버와 통신할 수 있다고 가정한 로직입니다.

// //       // const response = await api.moveTaskStatus(todo_id, newState);
// //       // return response.data;

// //       // 여기서는 상태 변경만 가정하므로, 그냥 task 정보와 새로운 상태를 리턴
// //       return { todo_id, newState };
// //     } catch (error) {
// //       return rejectWithValue(error); // 실패 시 에러 반환
// //     }
// //   },
// // );
// // 비동기 액션을 위한 createAsyncThunk 정의
// export const moveTaskAsync = createAsyncThunk<
//   { todo_id: number; newState: 'plan' | 'progress' | 'done' },
//   { todo_id: number; newState: 'plan' | 'progress' | 'done' }
// >(
//   'tasks/moveTaskAsync', // 액션 이름
//   async ({ todo_id, newState }) => {
//     // 여기에 비동기 작업을 추가할 수 있습니다 (예: API 호출 등)
//     return { todo_id, newState }; // 상태 변경 정보 반환
//   },
// );

// interface TaskState {
//   tasks: Task[];
//   nextID: number;
//   loadedTasks: number;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: TaskState = {
//   tasks: [],
//   nextID: 1,
//   loadedTasks: 5,
//   loading: false,
//   error: null,
// };

// const taskSlice = createSlice({
//   name: 'tasks',
//   initialState,
//   reducers: {
//     initializeTasks: (state, action: PayloadAction<Task[]>) => {
//       state.tasks = action.payload;
//       state.nextID =
//         action.payload.length > 0
//           ? action.payload[action.payload.length - 1].todo_id + 1
//           : 1;
//     },
//     createTask: (state, action: PayloadAction<Omit<Task, 'todo_id'>>) => {
//       const newTask: Task = {
//         ...action.payload,
//         todo_id: state.nextID,
//       };
//       state.tasks.push(newTask);
//       state.nextID += 1;
//     },
//     updateTask: (
//       state,
//       action: PayloadAction<{
//         todo_id: number;
//         title?: string;
//         description?: string;
//         priority?: 'low' | 'medium' | 'high';
//         status?: 'plan' | 'progress' | 'done';
//         start_date?: string;
//         due_date?: string;
//       }>,
//     ) => {
//       const taskIndex = state.tasks.findIndex(
//         task => task.todo_id === action.payload.todo_id,
//       );
//       if (taskIndex !== -1) {
//         state.tasks[taskIndex] = {
//           ...state.tasks[taskIndex],
//           ...action.payload,
//         };
//       }
//     },
//     deleteTask: (state, action: PayloadAction<number>) => {
//       state.tasks = state.tasks.filter(task => task.todo_id !== action.payload);
//     },
//     // ✅ 추가: 무한 스크롤을 위한 로드 기능
//     loadMoreTasks: state => {
//       const allTasks = [...state.tasks]; // 전체 데이터 (DB에서 가져온다고 가정)
//       const nextBatch = allTasks.slice(
//         state.loadedTasks,
//         state.loadedTasks + 10,
//       );
//       state.tasks = [...state.tasks, ...nextBatch];
//       state.loadedTasks += nextBatch.length;
//     },
//     // 🟢 추가: 드래그 & 드랍을 위한 상태 변경 액션
//     moveTask: (
//       state,
//       action: PayloadAction<{
//         todo_id: number;
//         newState: 'plan' | 'progress' | 'done';
//       }>,
//     ) => {
//       const task = state.tasks.find(
//         task => task.todo_id === action.payload.todo_id,
//       );
//       if (task) {
//         task.status = action.payload.newState; // 상태 업데이트
//       }
//     },
//     // extraReducers: builder => {
//     //   builder
//     //     .addCase(moveTaskAsync.pending, state => {
//     //       state.loading = true;
//     //     })
//     //     .addCase(
//     //       moveTaskAsync.fulfilled,
//     //       (
//     //         state,
//     //         action: PayloadAction<{
//     //           todo_id: number;
//     //           newState: 'plan' | 'progress' | 'done';
//     //         }>,
//     //       ) => {
//     //         state.loading = false;
//     //         const { todo_id, newState } = action.payload;

//     //         // 태스크 상태 변경
//     //         const taskIndex = state.tasks.findIndex(
//     //           task => task.todo_id === todo_id,
//     //         );
//     //         if (taskIndex !== -1) {
//     //           state.tasks[taskIndex].status = newState;
//     //         }
//     //       },
//     //     )
//     //     .addCase(moveTaskAsync.rejected, (state, action) => {
//     //       state.loading = false;
//     //       state.error = action.payload as string; // 오류 처리
//     //     });
//     // },
//   },
// });

// export const { initializeTasks, createTask, updateTask, deleteTask, moveTask } =
//   taskSlice.actions;
// export default taskSlice.reducer;
