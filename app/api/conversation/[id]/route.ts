import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ConversationWithMapping, MessageWithChildren } from "@/types/conversation";
import { Message } from "@prisma/client";

type MessageWithChildrenNodes = Message & {
  children: {
    id: string;
  }[];
};

export async function GET(request: NextRequest, { params }: { params: { id: string; }; }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ code: -1, data: 'No conversation id found' });
  }

  const conversationWithMessages = await prisma.conversation.findUnique({
    where: {
      id: id,
    },
    include: {
      messages: {
        orderBy: {
          createTime: 'asc',
        },
        include: {
          children: {
            select: {
              id: true
            }
          }
        }
      }
    }
  });

  if (!conversationWithMessages) {
    return NextResponse.json({ code: -1, data: 'No conversation found' });
  }

  const { messages, ...conversation } = conversationWithMessages;

  const rootMessage = messages.find((message) => message.parent === null);

  const createMapping = (rootMessage: MessageWithChildrenNodes) => {
    const mapping: Record<string, MessageWithChildren> = {};
    const dfs = (node: MessageWithChildrenNodes) => {
      const childrenIds = node.children.map((child) => child.id);
      mapping[node.id] = { ...node, children: childrenIds, createTime: node.createTime.getTime() };
      const childrenMessages = messages.filter((message) => childrenIds.includes(message.id));
      childrenMessages.forEach(dfs);
    };
    dfs(rootMessage);
    return mapping;
  };

  if (!rootMessage) {
    return NextResponse.json({ code: -1, data: 'No root message found' });
  } else {
    const mapping = createMapping(rootMessage);
    const conversationWithMapping: ConversationWithMapping = {
      ...conversation,
      createTime: conversation.createTime.getTime(),
      updateTime: conversation.updateTime.getTime(),
      mapping
    };
    return NextResponse.json({ code: 0, data: { conversation: conversationWithMapping } });
  }
}