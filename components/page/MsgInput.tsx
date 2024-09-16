"use client";
import { FC, useState, useRef } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { v4 as uuid } from "uuid";
import { SSE } from "sse.js";
import { useAppContext } from "@/components/AppContextProvider";
import { ActionType } from "@/lib/appReducer";
import { Message } from "@prisma/client";
import { ConversationAction, ModelType, Role } from "@/constant/conversation.enum";
import { Event } from "@/constant/event.enum";
import { ConversationPayload, MessageWithChildren, PayloadMessage } from "@/types/conversation";
import { ReplaceFieldType } from "@/types/typeUtils";
import { useEventBusContext } from "@/components/EventBusContext";
import { useRouter } from "next/navigation";

interface MsgInputProps {
  conversationId?: string;
}

const MsgInput: FC<MsgInputProps> = ({ conversationId = "" }) => {
  const [userInput, setUserInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const isStop = useRef(false);
  const isDiabled = isGenerating ? false : userInput.length === 0;
  const {
    state: { messageList },
    dispatch,
  } = useAppContext();
  const { publish } = useEventBusContext();
  const router = useRouter();
  const isNewConversation = conversationId === "";

  const upsertMessage = async (message: Omit<Message, "createTime">) => {
    const response = await fetch("/api/message/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { data } = await response.json();
    return data.message;
  };

  const sendMessage = async () => {
    const message: PayloadMessage = {
      id: uuid(),
      role: Role.USER,
      content: userInput,
      createTime: Date.now(),
    };

    const parentMessage = isNewConversation ? null : messageList[messageList.length - 1];

    const payload: ConversationPayload = {
      action: ConversationAction.NEXT,
      messages: [message],
      parentMessageId: parentMessage?.id ?? "",
      conversationId,
      model: ModelType.AUTO,
    };

    // 如果为新对话，发布Event.NewConversation
    isNewConversation && publish(Event.NewConversation);

    // 如果有父消息，更新父消息的children
    parentMessage &&
      dispatch({
        type: ActionType.UPDATE_MESSAGE,
        message: { ...parentMessage, children: [...parentMessage.children, message.id] },
      });

    // 构造添加的新消息
    const newMessage = {
      ...message,
      conversationId,
      parent: payload.parentMessageId,
      children: [],
    };
    dispatch({ type: ActionType.ADD_MESSAGE, message: newMessage });

    setUserInput("");
    doSend(payload);
  };

  const doSend = async (payload: ConversationPayload) => {
    const source = new SSE("/api/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      payload: JSON.stringify(payload),
    });

    const parseMessage = (data: string): MessageWithChildren => {
      try {
        const message: ReplaceFieldType<Message, "createTime", string> = JSON.parse(data);
        return { ...message, createTime: Date.parse(message.createTime), children: [] };
      } catch (e) {
        console.log(e);
        return {
          id: "",
          content: "",
          role: "",
          conversationId: "",
          parent: "",
          children: [],
          createTime: 0,
        };
      }
    };

    let newMessage: MessageWithChildren;
    source.addEventListener("start", (event: MessageEvent) => {
      setIsGenerating(true);

      newMessage = parseMessage(event.data);

      const message = payload.messages[0]; // 原消息
      const parentMessage: MessageWithChildren = {
        ...message,
        conversationId,
        parent: payload.parentMessageId,
        children: [],
      }; //  新消息的父消息

      // 更新父消息的children
      dispatch({
        type: ActionType.UPDATE_MESSAGE,
        message: { ...parentMessage, children: [...parentMessage.children, newMessage.id] },
      });

      // 将新的消息添加到消息列表
      dispatch({ type: ActionType.ADD_MESSAGE, message: newMessage });

      // 如果为新对话，更新对话标题
      isNewConversation && publish(Event.UpdateConversationTitle);
    });

    source.addEventListener("message", (event: MessageEvent) => {
      if (isStop.current) {
        isStop.current = false;
        setIsGenerating(false);
        source.close();
        return;
      }
      dispatch({ type: ActionType.UPDATE_MESSAGE, message: parseMessage(event.data) });
    });

    source.addEventListener("end", () => {
      setIsGenerating(false);
      isNewConversation && router.push(`/c/${newMessage.conversationId}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey || isGenerating) {
        return;
      }
      e.preventDefault();
      sendMessage();
    }
  };

  const stopGenerate = async () => {
    await fetch("/api/conversation", {
      method: "GET",
    });
    isStop.current = true;
  };

  return (
    <div className="text-base px-3 m-auto w-full md:px-5 lg:px-1 xl:px-5">
      <div className="mx-auto flex flex-1 gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
        <div className="relative flex h-full max-w-full flex-1 flex-col">
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col gap-1.5 rounded-[26px] p-1.5 transition-colors bg-secondary">
              <div className="flex items-end gap-1.5 md:gap-2">
                <div className="flex flex-col">
                  <button
                    className="flex items-center justify-center h-8 w-8 dark:text-white rounded-full focus-visible:outline-black dark:focus-visible:outline-white mb-1 ml-1.5"
                    aria-disabled="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <div
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-:rqe:"
                    data-state="closed"
                  ></div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Textarea
                    id="prompt-textarea"
                    tabIndex={0}
                    data-id="root"
                    dir="auto"
                    rows={1}
                    placeholder="发送消息"
                    className="m-0 resize-none border-0 bg-transparent px-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 max-h-52 min-h-[auto] text-base"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={(ref) => {
                      ref?.focus();
                      ref?.addEventListener("input", (e) => {
                        ref.style.height = "auto";
                        ref.style.height = ref.scrollHeight + "px";
                      });
                    }}
                  />
                </div>
                <button
                  disabled={isDiabled}
                  className="mb-1 me-1 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background disabled:bg-muted-foreground disabled:text-muted transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-black disabled:hover:opacity-100 dark:focus-visible:outline-white"
                  onClick={isGenerating ? stopGenerate : sendMessage}
                >
                  {isGenerating ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="icon-lg"
                    >
                      <rect width="10" height="10" x="7" y="7" fill="currentColor" rx="1.25"></rect>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="none"
                      viewBox="0 0 32 32"
                      className="icon-2xl"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative px-2 py-2 text-center text-xs text-token-text-secondary md:px-[60px]">
        <span>AI 也可能会犯错。请核查重要信息。</span>
      </div>
    </div>
  );
};

export default MsgInput;
