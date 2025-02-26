import React from 'react';
import Chat from './Chat';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user_id: number;
  workspace_id: number;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, user_id, workspace_id }) => {
  if (!isOpen) return null;
  return <Chat user_id={user_id} workspace_id={workspace_id} onClose={onClose} />;
};

export default React.memo(ChatModal);
