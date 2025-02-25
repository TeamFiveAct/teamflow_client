import React, { useEffect, useState, useCallback, useRef, MouseEvent } from 'react';
import { io, Socket } from 'socket.io-client';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Prism from 'prismjs';
import { Message as MessageType, ChatProps } from '../../types/chat';
import '../../style/chat.scss';

// 아이콘 컴포넌트 (불필요한 리렌더링 방지를 위해 React.memo 사용)
const PaperClipIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
));

const SendIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
));

const EmojiIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
));

const CodeIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
));

const FileIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
));

// 지원하는 코드 언어 목록
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

// 고유 ID 생성 헬퍼 함수
const generateId = (user_id: number) =>
  `${user_id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const Chat: React.FC<ChatProps> = ({ user_id, workspace_id, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  // hasBeenDragged 상태를 추가하여 사용자가 드래그한 경우에만 인라인 스타일을 적용합니다.
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 환경 감지 (화면 너비 768px 이하이면 모바일로 간주)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // PC 최초 로드시 중앙에 위치하도록 설정 (인라인 스타일 적용 전에는 기존 SCSS가 적용되어 중앙정렬됨)
  useEffect(() => {
    if (!isMobile && chatRef.current && !hasBeenDragged) {
      // 별도 인라인 스타일을 적용하지 않으면 기존 CSS (top:50%, left:50%, transform: translate(-50%, -50%))가 그대로 적용됩니다.
      // 최초 드래그 전까지는 기존 중앙 배치 상태를 유지합니다.
      // 만약 최초 위치를 인라인 스타일로 관리하고 싶다면 아래처럼 계산할 수 있습니다.
      // const { offsetWidth, offsetHeight } = chatRef.current;
      // setPosition({ x: (window.innerWidth - offsetWidth) / 2, y: (window.innerHeight - offsetHeight) / 2 });
    }
  }, [isMobile, hasBeenDragged]);

  // 채팅 내역 스크롤 자동 이동
  const scrollToBottom = useCallback(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, []);

  // 소켓 연결 및 이벤트 설정
  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    newSocket.emit('joinRoom', { user_id, workspace_id });

    newSocket.on('chatHistory', (msgs: MessageType[]) => {
      const formatted = msgs.map(msg => ({
        ...msg,
        id: generateId(msg.user_id),
        timestamp: msg.timestamp || Date.now(),
      }));
      setMessages(formatted);
      setTimeout(scrollToBottom, 100);
    });

    newSocket.on('receiveMessage', (message: MessageType) => {
      const formattedMsg = {
        ...message,
        id: generateId(message.user_id),
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, formattedMsg]);
      setTimeout(scrollToBottom, 100);
    });

    newSocket.on('error', (errorMessage: string) => {
      alert('Error: ' + errorMessage);
    });

    return () => {
      newSocket.close();
    };
  }, [user_id, workspace_id, scrollToBottom]);

  // 코드 하이라이트 적용
  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  // 메시지 전송 함수 (텍스트, 코드, 이모지 등)
  const sendMessage = useCallback(
    (content: string, content_type: MessageType['content_type'] = 'text') => {
      if (!socket || !content.trim()) return;
      const baseMessage = {
        id: generateId(user_id),
        user_id,
        workspace_id,
        content: content.trim(),
        content_type,
        timestamp: Date.now(),
      };
      const message =
        content_type === 'code'
          ? { ...baseMessage, code_language: selectedLanguage }
          : baseMessage;
      socket.emit('sendMessage', message);
      setMessageInput('');
      setShowEmojiPicker(false);
      setShowCodeEditor(false);
      setCodeInput('');
    },
    [socket, user_id, workspace_id, selectedLanguage],
  );

  // 파일 업로드 핸들러
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!socket || !event.target.files?.[0]) return;
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('파일 업로드 실패');
        const data = await response.json();
        const fileUrl = data.url;
        const content_type = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
          ? 'video'
          : 'file';
        const message: MessageType = {
          id: generateId(user_id),
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
    },
    [socket, user_id, workspace_id],
  );

  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      sendMessage(emojiData.emoji, 'emoji');
    },
    [sendMessage],
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey && messageInput.trim()) {
        event.preventDefault();
        sendMessage(messageInput);
      }
    },
    [messageInput, sendMessage],
  );

  // 메시지 렌더링 함수
  const renderMessage = useCallback(
    (message: MessageType) => {
      const isCurrentUser = message.user_id === user_id;
      return (
        <div key={message.id} className={`message-wrapper ${isCurrentUser ? 'current-user' : ''}`}>
          <span className="user-name">User {message.user_id}</span>
          <div className={`message-content ${isCurrentUser ? 'current-user' : ''}`}>
            {message.content_type === 'text' && message.content}
            {message.content_type === 'emoji' && <span className="emoji">{message.content}</span>}
            {message.content_type === 'image' && (
              <img src={message.content} alt={message.filename || 'Uploaded image'} />
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
                <code className={`language-${message.code_language}`}>{message.content}</code>
              </pre>
            )}
          </div>
        </div>
      );
    },
    [user_id],
  );

  // 드래그 핸들러 (모바일에서는 비활성)
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (isMobile) return;
      if (chatRef.current && !(e.target instanceof HTMLElement && e.target.closest('.window-controls'))) {
        setIsDragging(true);
        setHasBeenDragged(true); // 드래그 시작 시 인라인 스타일 적용을 위해 true로 변경
        const { left, top } = chatRef.current.getBoundingClientRect();
        setDragOffset({ x: e.clientX - left, y: e.clientY - top });
      }
    },
    [isMobile],
  );

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (isDragging && chatRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        const maxX = window.innerWidth - chatRef.current.offsetWidth;
        const maxY = window.innerHeight - chatRef.current.offsetHeight;
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    },
    [isDragging, dragOffset],
  );

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
      <div className="chat-minimized" onClick={() => setIsMinimized(false)}>
        <span>Chat</span>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className={`chat-container ${isMobile ? 'mobile' : 'desktop'}`}
      // PC에서만, 사용자가 드래그한 경우 인라인 스타일로 위치를 업데이트
      style={
        !isMobile && hasBeenDragged
          ? {
              left: position.x,
              top: position.y,
              transform: 'none',
            }
          : {}
      }
    >
      <div className="chat-header" onMouseDown={!isMobile ? handleMouseDown : undefined}>
        <h2>Workspace Chat</h2>
        <div className="window-controls">
          <button onClick={() => setIsMinimized(true)} className="minimize-btn">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M20 12H4" strokeWidth="2" stroke="currentColor" />
            </svg>
          </button>
          <button onClick={onClose} className="close-btn">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M18 6L6 18M6 6l12 12" strokeWidth="2" stroke="currentColor" />
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
          <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
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
            <button type="button" className="action-button" onClick={() => setShowEmojiPicker(prev => !prev)}>
              <EmojiIcon />
            </button>
            <button type="button" className="action-button" onClick={() => setShowCodeEditor(prev => !prev)}>
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

          <button className="send-button" onClick={() => sendMessage(messageInput)} disabled={!messageInput.trim()}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
