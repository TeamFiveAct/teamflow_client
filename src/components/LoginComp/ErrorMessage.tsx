// ErrorMessage.tsx
import React from 'react';

interface errorMessageProps {
  error: string;
  //   setError: React.Dispatch<React.SetStateAction<string>>;
}

const ErrorMessage = ({ error }: errorMessageProps) => {
  return error ? (
    <div
      style={{
        color: 'red',
        fontSize: '0.9rem',
        marginTop: '5px',
      }}
    >
      {error}
    </div>
  ) : null;
};

export default ErrorMessage;
