// ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string; // 메시지 텍스트
  type: 'ERROR' | 'SUCCESS'; // 메시지 타입
}

const ServerMessage = ({ message, type }: ErrorMessageProps) => {
  const messageStyle = {
    color: type === 'ERROR' ? 'red' : 'green', // 에러일 경우 빨강, 성공일 경우 초록
    fontSize: '0.9rem',
    marginTop: '5px',
  };

  return message ? <div style={messageStyle}>{message}</div> : null;
};

export default ServerMessage;
