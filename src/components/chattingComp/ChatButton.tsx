import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../style/chat.scss';
import ChatModal from '../chatcomp/ChatModal';

export default function ChatButton() {
  const location = useLocation();
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
  }, [dragging, handleMouseMove, handleMouseUp]);

  // Only render on workspace pages
  if (!location.pathname.includes('/v1/workspace')) {
    return null;
  }

  return (
    <>
      <button
        className={`chat-button ${dragging ? 'dragging' : ''}`}
        style={{
          position: 'fixed',
          right: '20px', // ✅ 오른쪽 하단 고정
          top: `${positionY}px`,
          transition: dragging ? 'none' : 'top 0.3s ease-in-out',
        }}
        onMouseDown={handleMouseDown}
        onClick={() => {
          if (isClick) setIsModalOpen(true);
        }}
      >
        💬 Chat
      </button>

      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user_id={1}
        workspace_id={1}
      />
    </>
  );
}
