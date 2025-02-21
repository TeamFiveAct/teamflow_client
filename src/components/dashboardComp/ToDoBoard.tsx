import React, { useState, Dispatch, SetStateAction } from 'react';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';
import '../../style/todoBoard.scss'; // ✅ 스타일 경로 유지
import { Task } from '../../types/types'; // ✅ 전역 타입 사용

const TaskColumn = ({
  title,
  state,
  tasks,
  openModal,
}: {
  title: string;
  state: string;
  tasks: Task[];
  openModal: () => void;
}) => {
  return (
    <div className="task-column">
      <div className="column-header">
        <h4>{title}</h4>
        <button className="add-task-btn" onClick={openModal}>
          +
        </button>
      </div>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.todo_id} className="task-item">
            <h5>{task.title}</h5>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ToDoBoard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Task>({
    todo_id: 0,
    title: '',
    description: '',
    priority: 'medium',
    start_date: '',
    due_date: '',
    state: 'open',
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      todo_id: 1,
      title: 'Task 1',
      description: 'Do something',
      priority: 'high',
      state: 'open',
    },
    {
      todo_id: 2,
      title: 'Task 2',
      description: 'Fix bug',
      priority: 'medium',
      state: 'in_progress',
    },
    {
      todo_id: 3,
      title: 'Task 3',
      description: 'Deploy app',
      priority: 'very_high',
      state: 'done',
    },
  ]);

  return (
    <div className="todo-board">
      <div className="task-columns">
        <TaskColumn
          title="Open"
          state="open"
          tasks={tasks.filter(task => task.state === 'open')}
          openModal={() => setShowCreateModal(true)}
        />
        <TaskColumn
          title="In Progress"
          state="in_progress"
          tasks={tasks.filter(task => task.state === 'in_progress')}
          openModal={() => setShowCreateModal(true)}
        />
        <TaskColumn
          title="Done"
          state="done"
          tasks={tasks.filter(task => task.state === 'done')}
          openModal={() => setShowCreateModal(true)}
        />
      </div>

      {showCreateModal && (
        <CreateTaskModal
          newTask={newTask}
          setNewTask={setNewTask} // ✅ 올바른 타입 전달
          createTask={() => {}}
          setShowModal={setShowCreateModal}
        />
      )}

      {showEditModal && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          setTask={setSelectedTask} // ✅ 강제 타입 캐스팅 제거
          updateTask={() => {}}
          deleteTask={() => {}}
          setShowModal={setShowEditModal}
        />
      )}
    </div>
  );
}
