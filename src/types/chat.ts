export interface Message {
  id: string;
  user_id: number;
  workspace_id: number;
  content: string;
  content_type: 'text' | 'file' | 'image' | 'video' | 'code' | 'emoji';
  filename?: string;
  mime_type?: string;
  code_language?: string;
  timestamp: number;
}

export interface ChatProps {
  user_id: number;
  workspace_id: number;
  onClose?: () => void;
}

export interface FileMessage {
  url: string;
  filename: string;
  mime_type: string;
}
