import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/chat/chat.scss';

export default function ChatButton() {
  const navigate = useNavigate();

  const getDefaultPosition = () => {
    const savedPosition = localStorage.getItem('chatButtonY');
    return savedPosition ? Number(savedPosition) : window.innerHeight - 80; // ✅ 기본 위치를 항상 오른쪽 하단으로 조정
  };

  const [positionY, setPositionY] = useState(window.innerHeight - 80);
  const [dragging, setDragging] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [isClick, setIsClick] = useState(true); // ✅ 클릭 가능 여부

  useEffect(() => {
    setPositionY(getDefaultPosition()); // ✅ 새로고침 시 기본 위치를 오른쪽 하단으로 복귀
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffsetY(e.clientY - positionY);
    setDragStartY(e.clientY); // ✅ 드래그 시작 위치 저장
    setIsClick(true); // ✅ 초기 클릭 가능 상태
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    let newY = e.clientY - offsetY;
    newY = Math.max(50, Math.min(window.innerHeight - 100, newY)); // ✅ 이동 범위 제한
    setPositionY(newY);

    if (Math.abs(e.clientY - dragStartY) > 5) {
      setIsClick(false); // ✅ 5px 이상 이동하면 클릭 비활성화
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    localStorage.setItem('chatButtonY', String(positionY)); // ✅ 위치 저장
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
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
        if (isClick) navigate('/chat'); // ✅ 드래그가 아닌 경우에만 이동
      }}
    >
      💬 Chat
    </button>
  );
}
