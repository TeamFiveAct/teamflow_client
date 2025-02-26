//src\components\chattingComp\ChatButton.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import ChatModal from '../chatcomp/ChatModal';
import '../../style/chatButton.scss';

export default function ChatButton() {
  const location = useLocation();
  const { space_id } = useParams<{ space_id: string }>();

  // API를 통해 현재 사용자 정보를 가져옴
  const [user, setUser] = useState<{ user_id: number } | null>(null);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/user/info`,
          { withCredentials: true },
        );
        if (response.data.status === 'SUCCESS') {
          setUser(response.data.data);
        } else {
          console.error(
            '사용자 정보를 불러오지 못했습니다:',
            response.data.message,
          );
        }
      } catch (error) {
        console.error('사용자 정보 요청 중 오류가 발생했습니다:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positionY, setPositionY] = useState(window.innerHeight - 80);
  const [dragging, setDragging] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [isClick, setIsClick] = useState(true);

  const getDefaultPosition = () => {
    const savedPosition = localStorage.getItem('chatButtonY');
    return savedPosition ? Number(savedPosition) : window.innerHeight - 80;
  };

  useEffect(() => {
    setPositionY(getDefaultPosition());
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffsetY(e.clientY - positionY);
    setDragStartY(e.clientY);
    setIsClick(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    let newY = e.clientY - offsetY;
    newY = Math.max(50, Math.min(window.innerHeight - 100, newY));
    setPositionY(newY);

    if (Math.abs(e.clientY - dragStartY) > 5) {
      setIsClick(false);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    localStorage.setItem('chatButtonY', String(positionY));
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, positionY]);

  // 워크스페이스 페이지가 아니면 렌더링하지 않음
  if (!location.pathname.includes('/v1/workspace')) {
    return null;
  }

  return (
    <>
      <button
        className={`chat-button ${dragging ? 'dragging' : ''}`}
        style={{
          position: 'fixed',
          right: '20px',
          top: `${positionY}px`,
          transition: dragging ? 'none' : 'top 0.3s ease-in-out',
        }}
        onMouseDown={handleMouseDown}
        onClick={() => {
          if (isClick) setIsModalOpen(true);
        }}
      >
        {/* SVG 아이콘은 background-image로 표시됩니다 */}
      </button>

      {/* 사용자 정보와 workspace_id가 있을 때만 ChatModal 렌더링 */}
      {user && space_id && (
        <ChatModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user_id={user.user_id}
          workspace_id={Number(space_id)}
        />
      )}
    </>
  );
}
