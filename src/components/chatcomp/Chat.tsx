import React, { useEffect, useState, useCallback, useRef, MouseEvent } from 'react';
import { io, Socket } from 'socket.io-client';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Prism from 'prismjs';
import { Message as MessageType, ChatProps, FileMessage } from '../../types/chat';
import '../../style/chat.scss';

// Icons as SVG components
const PaperClipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
    />
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const EmojiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const SUPPORTED_CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'swift',
  'go',
];

interface Position {
  x: number;
  y: number;
}

const Chat: React.FC<ChatProps> = ({ user_id, workspace_id, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 100, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const chatRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    newSocket.emit('joinRoom', { user_id, workspace_id });

    newSocket.on('chatHistory', (messages: MessageType[]) => {
      const messagesWithIds = messages.map(msg => ({
        ...msg,
        id: `${msg.user_id}-${msg.timestamp || Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        timestamp: msg.timestamp || Date.now(),
      }));
      setMessages(messagesWithIds);
      setTimeout(scrollToBottom, 100);
    });

    newSocket.on('receiveMessage', (message: MessageType) => {
      const messageWithId = {
        ...message,
        id: `${message.user_id}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, messageWithId]);
      setTimeout(scrollToBottom, 100);
    });

    newSocket.on('error', (errorMessage: string) => {
      alert('Error: ' + errorMessage);
    });

    return () => {
      newSocket.close();
    };
  }, [user_id, workspace_id]);

  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  const sendMessage = useCallback(
    (content: string, content_type: MessageType['content_type'] = 'text') => {
      if (!socket || !content.trim()) return;

      const baseMessage = {
        id: `${user_id}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        user_id,
        workspace_id,
        content: content.trim(),
        content_type,
        timestamp: Date.now(),
      };

      let message: MessageType;
      if (content_type === 'code') {
        message = {
          ...baseMessage,
          content_type: 'code',
          code_language: selectedLanguage,
        };
      } else {
        message = baseMessage;
      }

      socket.emit('sendMessage', message);
      setMessageInput('');
      setShowEmojiPicker(false);
      setShowCodeEditor(false);
      setCodeInput('');
    },
    [socket, user_id, workspace_id, selectedLanguage],
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!socket || !event.target.files?.[0]) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('파일 업로드 실패');
      }

      const data = await response.json();
      const fileUrl = data.url;

      const content_type = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : 'file';

      const message: MessageType = {
        id: `${user_id}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        user_id,
        workspace_id,
        content: fileUrl,
        content_type,
        filename: file.name,
        mime_type: file.type,
        timestamp: Date.now(),
      };

      socket.emit('sendMessage', message);
      event.target.value = '';
    } catch (error) {
      console.error('파일 전송 중 오류:', error);
      alert('파일 전송 중 오류가 발생했습니다.');
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    sendMessage(emojiData.emoji, 'emoji');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (messageInput.trim()) {
        sendMessage(messageInput);
      }
    }
  };

  const renderMessage = (message: MessageType) => {
    const isCurrentUser = message.user_id === user_id;

    return (
      <div key={message.id} className={`message-wrapper ${isCurrentUser ? 'current-user' : ''}`}>
        <span className="user-name">User {message.user_id}</span>
        <div className={`message-content ${isCurrentUser ? 'current-user' : ''}`}>
          {message.content_type === 'text' && message.content}
          {message.content_type === 'emoji' && (
            <span className="emoji">{message.content}</span>
          )}
          {message.content_type === 'image' && (
            <img
              src={message.content}
              alt={message.filename || 'Uploaded image'}
            />
          )}
          {message.content_type === 'video' && (
            <video controls>
              <source src={message.content} type={message.mime_type} />
              Your browser does not support the video tag.
            </video>
          )}
          {message.content_type === 'file' && (
            <a
              href={message.content}
              target="_blank"
              rel="noopener noreferrer"
              className={`file-attachment ${isCurrentUser ? 'current-user' : ''}`}
            >
              <FileIcon />
              <div className="file-info">
                <div className="filename">{message.filename}</div>
              </div>
            </a>
          )}
          {message.content_type === 'code' && (
            <pre className={isCurrentUser ? 'current-user' : ''}>
              <code className={`language-${message.code_language}`}>
                {message.content}
              </code>
            </pre>
          )}
        </div>
      </div>
    );
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (chatRef.current && e.target instanceof HTMLElement && e.target.closest('.window-controls') === null) {
      setIsDragging(true);
      const rect = chatRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (isDragging && chatRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep window within viewport bounds
      const maxX = window.innerWidth - chatRef.current.offsetWidth;
      const maxY = window.innerHeight - chatRef.current.offsetHeight;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (isMinimized) {
    return (
      <div 
        className="chat-minimized"
        style={{ left: `${position.x}px` }}
        onClick={() => setIsMinimized(false)}
      >
        <span>Chat</span>
      </div>
    );
  }

  return (
    <div 
      ref={chatRef}
      className="chat-container"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
        margin: 0
      }}
    >
      <div className="chat-header" onMouseDown={handleMouseDown}>
        <h2>Workspace Chat</h2>
        <div className="window-controls">
          <button onClick={() => setIsMinimized(true)} className="minimize-btn">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M20 12H4" strokeWidth="2" stroke="currentColor"/>
            </svg>
          </button>
          <button onClick={onClose} className="close-btn">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M18 6L6 18M6 6l12 12" strokeWidth="2" stroke="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map(renderMessage)}
      </div>

      <div className="chat-input-container">
        <div className={`emoji-picker-container ${showEmojiPicker ? 'visible' : ''}`}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>

        <div className={`code-editor-container ${showCodeEditor ? 'visible' : ''}`}>
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
          >
            {SUPPORTED_CODE_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          <textarea
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
            placeholder="코드를 입력하세요..."
          />
          <div className="button-group">
            <button className="cancel" onClick={() => setShowCodeEditor(false)}>
              취소
            </button>
            <button
              className="send"
              onClick={() => sendMessage(codeInput, 'code')}
              disabled={!codeInput.trim()}
            >
              전송
            </button>
          </div>
        </div>

        <div className="chat-input-wrapper">
          <div className="input-button-group">
            <label className="file-input-label">
              <input type="file" onChange={handleFileUpload} />
              <PaperClipIcon />
            </label>
            <button
              type="button"
              className="action-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <EmojiIcon />
            </button>
            <button
              type="button"
              className="action-button"
              onClick={() => setShowCodeEditor(!showCodeEditor)}
            >
              <CodeIcon />
            </button>
          </div>

          <input
            className="text-input"
            type="text"
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
          />

          <button
            className="send-button"
            onClick={() => sendMessage(messageInput)}
            disabled={!messageInput.trim()}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
