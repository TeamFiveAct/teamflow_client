// src/components/chatcomp/ChatModal.tsx
import React from 'react';
import '../../style/chatModal.scss';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user_id: number;
  workspace_id: number;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, user_id, workspace_id }) => {
  if (!isOpen) return null;

  return (
    <div className="chat-modal">
      <button onClick={onClose}>Close</button>
      {/* 여기에 채팅 모달의 나머지 UI를 구현 */}
      <div>
        <p>User ID: {user_id}</p>
        <p>Workspace ID: {workspace_id}</p>
      </div>
    </div>
  );
};

export default ChatModal;
