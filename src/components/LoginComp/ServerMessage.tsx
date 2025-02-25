import React from 'react';

interface ServerMessageProps {
  message: { text: string; type: 'error' | 'success' | null };
}

const ServerMessage = ({ message }: ServerMessageProps) => {
  if (!message.text) return null;

  return (
    <div
      style={{
        color: message.type === 'error' ? 'red' : 'green',
        fontSize: '0.9rem',
        marginTop: '5px',
      }}
    >
      {message.text}
    </div>
  );
};

export default ServerMessage;
