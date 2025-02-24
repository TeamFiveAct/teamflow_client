import React from 'react';

interface ServerMessageProps {
  successMessage?: string; // 성공 메시지
  errorMessage?: string; // 에러 메시지
}

const ServerMessage = ({
  successMessage,
  errorMessage,
}: ServerMessageProps) => {
  return (
    <>
      {successMessage && (
        <div style={{ color: 'green', fontSize: '0.9rem', marginTop: '5px' }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default ServerMessage;
