import { NextRequest } from "next/server";
import { setGlobalDispatcher, ProxyAgent } from "undici";
import EventEmitter from "events";
import prisma from "@/lib/db";
import { googleGenAI } from "@/lib/googleGen";
import { sleep } from "@/lib/utils";
import { env } from "process";
import { ConversationPayload } from "@/types/conversation";
import { Message } from "@prisma/client";
import { DEFAULT_TYPE, ConversationAction, ModelType, Role } from "@/constant/conversation.enum";
import { GenerateContentStreamResult } from "@google/generative-ai";

enum Event {
  UPDATE_MESSAGE = "updateMessage",
  STOP_GENERATE = "stopGenerate",
}
const DEFAULT_DELAY = 10;

const eventEmitter = new EventEmitter();

setProxyAgent();

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

  // 监听更新消息事件
  onUpdateMessage();

  // 更新对话的当前节点
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

async function getResponse(result: GenerateContentStreamResult | ReturnType<typeof getMockStream>, message: Message) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  (async function () {
    // 监听停止生成事件
    let isStop = false;
    eventEmitter.on(Event.STOP_GENERATE, () => {
      isStop = true;
    });
    let content = "";
    writer.write(encoder.encode(`event: start\ndata: ${JSON.stringify({ ...message, content })}\n\n`));
    for await (const chunk of result.stream) {
      if (isStop) {
        break;
      }
      const text = chunk.text();
      for (const char of text) {
        content += char;
        writer.write(
          encoder.encode(
            `event: message\ndata: ${JSON.stringify({ ...message, content })}\n\n`
          )
        );
        await sleep(DEFAULT_DELAY); // 延迟 10 毫秒发送每个字符
      }
    }
    writer.write(encoder.encode(`event: end\ndata: [DONE]\n\n`));
    eventEmitter.emit(Event.UPDATE_MESSAGE, message.id, content);
    writer.close();
  })();

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

function setProxyAgent() {
  // 如果有设置 LOCAL_PROXY_URL 环境变量，则使用代理
  if (env.LOCAL_PROXY_URL) {
    const dispatcher = new ProxyAgent({ uri: new URL(env.LOCAL_PROXY_URL).toString() });
    setGlobalDispatcher(dispatcher);
  }
}

async function getAssistantResponse(requestMessage: string, modelType: ModelType) {
  const model = googleGenAI.getGenerativeModel({ model: modelType === ModelType.AUTO ? DEFAULT_TYPE : modelType });

  const result = env.MOCK_MESSAGE ? getMockStream(env.MOCK_MESSAGE) : await model.generateContentStream(requestMessage);

  return result;
}

function getMockStream(content: string) {
  const getChunk = (char: string) => ({
    text: () => char,
  });

  // 生成一个异步迭代器
  const stream = {
    [Symbol.asyncIterator]: async function* () {
      for (const char of content) {
        // 每次迭代返回一个包含 text 方法的对象
        yield getChunk(char);
      }
    }
  };

  return { stream };
}

function onUpdateMessage() {
  eventEmitter.on(Event.UPDATE_MESSAGE, async (id: string, content: string) => {
    await prisma.message.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
  });
}

export async function GET() {
  eventEmitter.emit(Event.STOP_GENERATE);
}