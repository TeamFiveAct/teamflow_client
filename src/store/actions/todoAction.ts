// // actions/todoActions.ts
// import { createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const updateTodoStatus = createAsyncThunk(
//   'todos/updateStatus',
//   async (
//     { todoId, newStatus }: { todoId: number; newStatus: string },
//     { dispatch },
//   ) => {
//     try {
//       // 서버에 상태 변경 요청을 보냄
//       await axios.put(`/api/todos/${todoId}/status`, { status: newStatus });

//       // 상태 업데이트 후, 해당 투두의 상태를 Redux 상태에서 업데이트
//       dispatch(updateTodoStatusSuccess({ todoId, newStatus }));
//     } catch (error) {
//       console.error('Error updating todo status', error);
//     }
//   },
// );

// // 상태 변경 성공 후, 상태를 업데이트하는 액션
// const updateTodoStatusSuccess = payload => ({
//   type: 'todos/updateStatusSuccess',
//   payload,
// });

// // reducers/todoReducer.ts
// const todoReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'todos/updateStatusSuccess':
//       // 상태 변경 후, 해당 투두 상태를 직접 수정
//       return {
//         ...state,
//         todos: state.todos.map(todo =>
//           todo.id === action.payload.todoId
//             ? { ...todo, status: action.payload.newStatus }
//             : todo,
//         ),
//       };
//     default:
//       return state;
//   }
// };
