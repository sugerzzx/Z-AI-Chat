import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ConversationWithMapping, MessageWithChildren } from "@/types/conversation";
import { Message } from "@prisma/client";

type MessageWithChildrenNodes = Message & {
  children: {
    id: string;
  }[];
};

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "No conversation id found" }, { status: 500 });
  }

  const conversationWithMessages = await prisma.conversation.findUnique({
    where: {
      id: id,
    },
    include: {
      messages: {
        orderBy: {
          createTime: "asc",
        },
        include: {
          children: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!conversationWithMessages) {
    return NextResponse.json({ error: "No conversation found" }, { status: 500 });
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
    return NextResponse.json({ error: "No root message found" }, { status: 500 });
  } else {
    const mapping = createMapping(rootMessage);
    const conversationWithMapping: ConversationWithMapping = {
      ...conversation,
      createTime: conversation.createTime.getTime(),
      updateTime: conversation.updateTime.getTime(),
      mapping,
    };
    return NextResponse.json(conversationWithMapping);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "No conversation id found" }, { status: 500 });
  }

  try {
    await prisma.conversation.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params, body }: { params: { id: string }; body: { title: string } },
) {
  const id = params.id;
  const { title } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "No conversation id found" }, { status: 500 });
  }

  try {
    await prisma.conversation.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
