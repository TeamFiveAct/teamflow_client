import React, { useState } from 'react';
import ProjectInfo from '../components/dashboardComp/ProjectInfo';
import ToDoBoard from '../components/dashboardComp/ToDoBoard';
import { Task } from '../types/types';
import '../style/dashboard.scss';
import ChatButton from '../components/chattingComp/ChatButton';

// ✅ 예제 데이터 추가
const dummyTasks: Task[] = [
  {
    todo_id: 1,
    title: 'UI 디자인 개선',
    description: '메인 페이지 UI 변경',
    priority: 'high',
    state: 'open',
    start_date: '2024-02-10',
    due_date: '2024-02-20',
  },
  {
    todo_id: 2,
    title: 'API 연결',
    description: '백엔드 API 연동',
    priority: 'medium',
    state: 'in_progress',
    start_date: '2024-02-11',
    due_date: '2024-02-21',
  },
  {
    todo_id: 3,
    title: '리팩토링',
    description: '코드 정리',
    priority: 'small',
    state: 'done',
    start_date: '2024-02-12',
    due_date: '2024-02-22',
  },
  {
    todo_id: 4,
    title: '리팩토링',
    description: '코드 정리',
    priority: 'small',
    state: 'done',
    start_date: '2024-02-12',
    due_date: '2024-02-22',
  },
  {
    todo_id: 5,
    title: '리팩토링',
    description: '코드 정리',
    priority: 'small',
    state: 'done',
    start_date: '2024-02-12',
    due_date: '2024-02-22',
  },
  {
    todo_id: 6,
    title: '리팩토링',
    description: '코드 정리',
    priority: 'small',
    state: 'in_progress',
    start_date: '2024-02-12',
    due_date: '2024-02-22',
  },
  {
    todo_id: 7,
    title: '리팩토링',
    description: '코드 정리',
    priority: 'small',
    state: 'in_progress',
    start_date: '2024-02-12',
    due_date: '2024-02-22',
  },
  {
    todo_id: 8,
    title: '리팩토링',
    description: '코드 정리',
    priority: 'small',
    state: 'in_progress',
    start_date: '2024-02-12',
    due_date: '2024-02-22',
  },
  {
    todo_id: 9,
    title: '리팩토링',
    description: '코드 정리',
    priority: 'small',
    state: 'in_progress',
    start_date: '2024-02-12',
    due_date: '2024-02-22',
  },
  {
    todo_id: 10,
    title: '리팩토링',
    description: '코드 정리',
    priority: 'small',
    state: 'in_progress',
    start_date: '2024-02-12',
    due_date: '2024-02-22',
  },
  {
    todo_id: 11,
    title: '리팩토링',
    description: '코드 정리',
    priority: 'small',
    state: 'in_progress',
    start_date: '2024-02-12',
    due_date: '2024-02-22',
  },
];

// ✅ 예제 워크스페이스 정보
const dummyWorkspace = {
  space_id: 1,
  space_title: 'Team Project',
  space_description: '이 프로젝트는 팀 협업을 위한 작업 관리 시스템입니다.',
  created_at: '2024-02-01',
  end_date: '2024-06-01',
};

export default function DashBoard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleEditTask = (task: Task) => {
    console.log('수정 버튼 클릭:', task);
  };

  const handleDeleteTask = (task: Task) => {
    console.log('삭제 버튼 클릭:', task);
    if (window.confirm(`"${task.title}" 할 일을 삭제하시겠습니까?`)) {
      console.log('삭제됨');
    }
  };

  const handleCreateTask = (state: 'open' | 'in_progress' | 'done') => {
    console.log(`${state} 할 일 생성`);
  };

  const handleFilterTasks = (
    filterType: 'priority' | 'due_date' | 'start_date',
  ) => {
    console.log(`할 일 조회 - 기준: ${filterType}`);
  };

  return (
    <div className="dashboard">
      <ProjectInfo
        workspace={dummyWorkspace}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(prev => !prev)}
      />
      <ToDoBoard
        tasks={dummyTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onCreate={handleCreateTask}
        onFilter={handleFilterTasks}
      />
      <ChatButton /> {/* ✅ Chat 버튼 추가 */}
    </div>
  );
}
