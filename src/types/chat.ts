//src\types\chat.ts
export interface Message {
  id: string;
  user_id: number;
  workspace_id: number;
  content: string;
  content_type: 'text' | 'emoji' | 'image' | 'video' | 'file' | 'code';
  timestamp: number;
  // 서버에서 include로 전달하는 사용자 정보 (선택적)
  user?: {
    nickname: string;
    profile_image: string;
  };
  code_language?: string;
  filename?: string;
  mime_type?: string;
}

export interface ChatProps {
  user_id: number;
  workspace_id: number;
  onClose: () => void;
}
