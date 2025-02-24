import styled from 'styled-components';

export const ChatContainer = styled.div`
  max-width: 800px;
  height: 90vh;
  margin: 20px auto;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

export const ChatHeader = styled.div`
  background-color: #2c3e50;
  color: white;
  padding: 16px 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

export const ChatHistory = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
`;

export const MessageWrapper = styled.div<{ $isCurrentUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.$isCurrentUser ? 'flex-end' : 'flex-start')};
  margin: 2px 0;
  max-width: 85%;
  align-self: ${props => (props.$isCurrentUser ? 'flex-end' : 'flex-start')};
`;

export const MessageContent = styled.div<{ $isCurrentUser: boolean }>`
  max-width: 100%;
  padding: 10px 14px;
  border-radius: ${props =>
    props.$isCurrentUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  background-color: ${props => (props.$isCurrentUser ? '#2c3e50' : '#e9ecef')};
  color: ${props => (props.$isCurrentUser ? '#fff' : '#2c3e50')};
  font-size: 0.95rem;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  img {
    max-width: 300px;
    max-height: 300px;
    border-radius: 8px;
    margin: 4px 0;
  }

  video {
    max-width: 300px;
    max-height: 300px;
    border-radius: 8px;
    margin: 4px 0;
  }

  pre {
    margin: 4px 0;
    padding: 12px;
    background: ${props => (props.$isCurrentUser ? '#1a252f' : '#dee2e6')};
    border-radius: 8px;
    overflow-x: auto;

    code {
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
    }
  }

  .emoji {
    font-size: 2rem;
    line-height: 1;
    margin: 4px 0;
  }

  .file-attachment {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: ${props => (props.$isCurrentUser ? '#1a252f' : '#dee2e6')};
    border-radius: 8px;
    margin: 4px 0;

    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .file-info {
      overflow: hidden;

      .filename {
        font-size: 0.9rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .file-size {
        font-size: 0.8rem;
        color: ${props => (props.$isCurrentUser ? '#8ce99a' : '#1971c2')};
      }
    }
  }
`;

export const UserName = styled.span`
  font-size: 0.75rem;
  color: #868e96;
  margin-bottom: 2px;
  padding: 0 4px;
`;

export const ChatInputContainer = styled.div`
  padding: 16px;
  background: #fff;
  border-top: 1px solid #e9ecef;
  position: relative;
`;

export const ChatInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  border-radius: 24px;
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #2c3e50;
  }
`;

export const InputButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #2c3e50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  &:disabled {
    color: #adb5bd;
    cursor: not-allowed;
  }
`;

export const FileInputLabel = styled(ActionButton).attrs({ as: 'label' })`
  input {
    display: none;
  }
`;

export const TextInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  padding: 8px;
  min-height: 24px;

  &::placeholder {
    color: #adb5bd;
  }
`;

export const SendButton = styled(ActionButton)`
  color: #2c3e50;
`;

export const EmojiPickerContainer = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 100%;
  right: 16px;
  display: ${props => (props.$isVisible ? 'block' : 'none')};
  z-index: 1000;

  .emoji-picker-react {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

export const CodeEditorContainer = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 16px;
  right: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${props => (props.$isVisible ? 'flex' : 'none')};
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  z-index: 1000;

  textarea {
    width: 100%;
    min-height: 150px;
    padding: 8px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
    resize: vertical;
  }

  select {
    padding: 8px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    background: #fff;
  }

  .button-group {
    display: flex;
    gap: 8px;
    justify-content: flex-end;

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;

      &.cancel {
        background: #e9ecef;
        color: #495057;
      }

      &.send {
        background: #2c3e50;
        color: #fff;
      }

      &:hover {
        opacity: 0.9;
      }
    }
  }
`;
