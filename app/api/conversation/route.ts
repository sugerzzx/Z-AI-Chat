import { NextRequest } from "next/server";
import { setGlobalDispatcher, ProxyAgent } from "undici";
import { sleep } from "@/lib/utils";
import { env } from "process";
import { googleGenAI } from "@/lib/googleGen";
import { ConversationPayload } from "@/types/conversation";
import { DEFAULT_TYPE, ConversationAction, ModelType, Role } from "@/constant/conversation.enum";
import prisma from "@/lib/db";
import { Message } from "@prisma/client";


export async function POST(request: NextRequest) {
  const payload: ConversationPayload = await request.json();

  let userMessage: Message | null = null;

  switch (payload.action) {
    case ConversationAction.NEXT:
      try {
        userMessage = await createUserMessage(payload);
      } catch (error) {
        return { status: -1, body: `Error creating user message: ${error}` };
      }
      break;
    case ConversationAction.VARIANT:
      try {
        userMessage = await findMessage(payload.parentMessageId);
      } catch (error) {
        return { status: -1, body: `Error finding message: ${error}` };
      }
      break;
    default:
      return { status: -1, body: "Invalid action" };
  }

  if (!userMessage) {
    return { status: -1, body: "Message not found" };
  }

  const assistantMessage = await prisma.message.create({
    data: {
      content: "",
      role: Role.ASSISTANT,
      conversationId: userMessage.conversationId,
      parent: userMessage.id,
    }
  });

  const assistantResponse = await getAssistantResponse(userMessage.content!, payload.model);

  await prisma.message.update({
    where: {
      id: assistantMessage.id,
    },
    data: {
      content: assistantResponse,
    },
  });
  await prisma.conversation.update({
    where: {
      id: assistantMessage.conversationId,
    },
    data: {
      currentNode: assistantMessage.id,
    },
  });
  return await getResponse(assistantResponse, assistantMessage);
}

async function createUserMessage(payload: ConversationPayload) {
  const { messages, parentMessageId, conversationId } = payload;
  const { id, content, role, createTime } = messages[messages.length - 1];

  if (conversationId) {
    return prisma.message.create({
      data: {
        id,
        content,
        role,
        createTime: new Date(createTime),
        conversationId: conversationId,
        parent: parentMessageId,
      },
    });
  } else {
    const newConversation = await prisma.conversation.create({ data: {} });
    const newRootMessage = await prisma.message.create({
      data: {
        role: Role.SYSTEM,
        conversationId: newConversation.id,
      },
    });
    return await prisma.message.create({
      data: {
        id,
        content,
        role,
        createTime: new Date(createTime),
        conversationId: newConversation.id,
        parent: newRootMessage.id,
      },
    });
  }
}

async function findMessage(id: string) {
  return prisma.message.findUnique({
    where: { id },
  });
}

async function getResponse(context: string, message: Message) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  (async function () {
    let content = "";
    writer.write(encoder.encode(`event: start\ndata: ${JSON.stringify({ ...message, content })}\n\n`));
    for (let i = 0; i < context.length; i++) {
      await sleep(10);
      content += context[i];
      writer.write(
        encoder.encode(
          `event: message\ndata: ${JSON.stringify({ ...message, content })}\n\n`
        )
      );
    }
    writer.write(encoder.encode(`event: end\ndata: [DONE]\n\n`));
    writer.close();
  })();

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

async function getAssistantResponse(requestMessage: string, modelType: ModelType) {
  // 如果有设置 LOCAL_PROXY_URL 环境变量，则使用代理
  if (env.LOCAL_PROXY_URL) {
    const dispatcher = new ProxyAgent({ uri: new URL(env.LOCAL_PROXY_URL).toString() });
    setGlobalDispatcher(dispatcher);
  }

  const model = googleGenAI.getGenerativeModel({ model: modelType === ModelType.AUTO ? DEFAULT_TYPE : modelType });

  const result = await model.generateContent(requestMessage);

  return result.response.text();
}