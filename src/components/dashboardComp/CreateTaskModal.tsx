import React, { Dispatch, SetStateAction } from 'react';
import { Task } from '../../types/types'; // ✅ 전역 타입 사용

interface CreateTaskModalProps {
  newTask: Task;
  setNewTask: Dispatch<SetStateAction<Task>>;
  createTask: () => void;
  setShowModal: (show: boolean) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  newTask,
  setNewTask,
  createTask,
  setShowModal,
}) => {
  return (
    <div>
      <h2>Create Task</h2>
      <input
        type="text"
        value={newTask.title}
        onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
      />
      <button onClick={createTask}>Create</button>
      <button onClick={() => setShowModal(false)}>Close</button>
    </div>
  );
};

export default CreateTaskModal;
