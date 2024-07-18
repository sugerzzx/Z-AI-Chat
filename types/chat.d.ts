export interface Chat {
  id: string;
  title: string;
  updateTime: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}