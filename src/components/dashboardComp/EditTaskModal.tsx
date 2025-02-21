import React, { Dispatch, SetStateAction } from 'react';
import { Task } from '../../types/types'; // ✅ 전역 타입 사용

interface EditTaskModalProps {
  task: Task;
  setTask: Dispatch<SetStateAction<Task | null>>; // ✅ null 허용
  updateTask: () => void;
  deleteTask: () => void;
  setShowModal: (show: boolean) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  setTask,
  updateTask,
  deleteTask,
  setShowModal,
}) => {
  return (
    <div>
      <h2>Edit Task</h2>
      <input
        type="text"
        value={task.title}
        onChange={e =>
          setTask(prev => ({
            ...(prev ?? {
              todo_id: 0,
              title: '',
              description: '',
              state: 'open',
              priority: 'medium',
              start_date: '',
              due_date: '',
            }),
            title: e.target.value,
          }))
        }
      />
      <button onClick={updateTask}>Update</button>
      <button onClick={deleteTask}>Delete</button>
      <button onClick={() => setShowModal(false)}>Close</button>
    </div>
  );
};

export default EditTaskModal;
