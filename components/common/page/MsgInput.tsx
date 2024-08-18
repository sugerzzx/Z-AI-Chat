"use client";
import { FC, useState, useRef } from "react";
import { TextareaAutosize } from "@mui/material";
import { v4 as uuid } from "uuid";
import { SSE } from "sse.js";
import { useAppContext } from "@/components/AppContextProvider";
import { ActionType } from "@/lib/appReducer";
import { Message } from "@prisma/client";
import { ConversationAction, ModelType, Role } from "@/constant/conversation.enum";
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

    const parentMessage = conversationId === "" ? null : messageList[messageList.length - 1];

    const payload: ConversationPayload = {
      action: ConversationAction.NEXT,
      messages: [message],
      parentMessageId: parentMessage?.id || uuid(),
      conversationId: conversationId,
      model: ModelType.AUTO,
    };

    publish("newConversation", payload.conversationId);
    parentMessage && dispatch({ type: ActionType.UPDATE_MESSAGE, message: { ...parentMessage, children: [...parentMessage.children, message.id] } });
    const newMessage = { ...message, conversationId, parent: payload.parentMessageId, children: [] };
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

    const getMessage = (data: string): MessageWithChildren => {
      const message: ReplaceFieldType<Message, "createTime", string> = JSON.parse(data);
      return { ...message, createTime: Date.parse(message.createTime), children: [] };
    };

    let newConversationId = '';
    source.addEventListener("start", (event: MessageEvent) => {
      setIsGenerating(true);
      const newMessage = getMessage(event.data);
      newConversationId = newMessage.conversationId;
      const message = payload.messages[0];
      const parentMessage = { ...message, conversationId, parent: payload.parentMessageId, children: [] };
      dispatch({ type: ActionType.UPDATE_MESSAGE, message: { ...parentMessage, children: [...parentMessage.children, newMessage.id] } });
      dispatch({ type: ActionType.ADD_MESSAGE, message: newMessage });
      if (!conversationId) {
        publish("updateConversationTitle", newMessage.conversationId);
      }
    });

    source.addEventListener("message", (event: MessageEvent) => {
      if (isStop.current) {
        isStop.current = false;
        setIsGenerating(false);
        source.close();
        return;
      }
      dispatch({ type: ActionType.UPDATE_MESSAGE, message: getMessage(event.data) });
    });

    source.addEventListener("end", () => {
      setIsGenerating(false);
      !conversationId && router.push(`/c/${newConversationId}`);
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
    <div className="w-full md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)] juice:w-full">
      <div className="px-3 text-base md:px-4 m-auto md:px-5 lg:px-1 xl:px-5">
        <div className="mx-auto flex flex-1 gap-3 text-base juice:gap-4 juice:md:gap-5 juice:lg:gap-6 md:max-w-3xl">
          <div className="relative flex h-full max-w-full flex-1 flex-col">
            <div className="absolute bottom-full left-0 right-0 z-20"></div>
            <div className="flex w-full items-center">
              <div className="flex w-full flex-col gap-1.5 rounded-[26px] p-1.5 transition-colors bg-[#f4f4f4] dark:bg-token-main-surface-secondary">
                <div className="flex items-end gap-1.5 md:gap-2">
                  <div>
                    <div className="flex flex-col">
                      <button
                        className="flex items-center justify-center text-token-text-primary juice:h-8 juice:w-8 dark:text-white juice:rounded-full focus-visible:outline-black dark:focus-visible:outline-white juice:mb-1 juice:ml-1.5"
                        aria-disabled="false"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      <div aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:rqe:" data-state="closed"></div>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <TextareaAutosize
                      id="prompt-textarea"
                      tabIndex={0}
                      data-id="root"
                      dir="auto"
                      placeholder="给“ChatGPT”发送消息"
                      className="m-0 resize-none border-0 bg-transparent px-0 text-token-text-primary focus:ring-0 focus-visible:ring-0 max-h-[25dvh] max-h-52 "
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <button
                    disabled={isDiabled}
                    data-testid="fruitjuice-send-button"
                    className="mb-1 me-1 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-black disabled:bg-[#D7D7D7] disabled:text-[#f4f4f4] disabled:hover:opacity-100 dark:bg-white dark:text-black dark:focus-visible:outline-white disabled:dark:bg-token-text-quaternary dark:disabled:text-token-main-surface-secondary"
                    onClick={isGenerating ? stopGenerate : sendMessage}
                  >
                    {isGenerating ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-lg">
                        <rect width="10" height="10" x="7" y="7" fill="currentColor" rx="1.25"></rect>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" className="icon-2xl">
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
      </div>
      <div className="relative px-2 py-2 text-center text-xs text-token-text-secondary md:px-[60px]">
        <span>ChatGPT 也可能会犯错。请核查重要信息。</span>
      </div>
    </div>
  );
};

export default MsgInput;
