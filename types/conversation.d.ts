import { Message, Conversation } from "@prisma/client";
import { ModelType } from "@/constant/conversation.enum";
import { ReplaceFieldType } from "./typeUtils";

export interface ConversationTitle {
  id: string;
  title: string;
  updateTime: number;
}

export type MessageWithChildren = Omit<Message, 'createTime'> & { children: string[] | never[], createTime: number; };

export type ConversationWithMapping = ReplaceFieldType<Conversation, 'createTime' | 'updateTime', number> & { mapping: Record<string, FormattedMessage>; };

export type PayloadMessage = {
  id: string;
  content: string;
  role: string;
  createTime: number;
};

export interface ConversationPayload {
  action: ConversationAction;
  messages: PayloadMessage[];
  conversationId?: string;
  parentMessageId: string;
  model: ModelType;
}
