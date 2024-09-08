"use client";
import { FC, useEffect } from "react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import { useAppContext } from "../AppContextProvider";
import { MessageWithChildren, ConversationWithMapping } from "@/types/conversation";
import { ActionType } from "@/lib/appReducer";
import { Response } from "@/types/respons";
import { Role } from "@/constant/conversation.enum";

interface MsgListProps {
  conversationId?: string;
}

const MsgList: FC<MsgListProps> = ({ conversationId }) => {
  const {
    state: { messageList },
    dispatch,
  } = useAppContext();

  const fetchConversation: (id: string) => Promise<Response> = async id => {
    const response = await fetch(`/api/conversation/${id}`);
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    return await response.json();
  };

  useEffect(() => {
    conversationId &&
      fetchConversation(conversationId)
        .then(res => {
          return res.code === 0 ? res.data.conversation : new Error(res.data);
        })
        .then(conversation => {
          handleConversation(conversation);
        })
        .catch(err => {
          console.log(err);
        });
    return () => {
    };
  }, [conversationId]);

  const handleConversation = (conversation: ConversationWithMapping) => {
    const currentNode = conversation.currentNode!;
    const lastMessage = conversation.mapping[currentNode];
    const messageList: MessageWithChildren[] = [lastMessage];
    let parentId = lastMessage.parent;
    while (parentId) {
      const parentMessage = conversation.mapping[parentId];
      messageList.unshift(parentMessage);
      parentId = parentMessage.parent;
    }
    dispatch({ type: ActionType.UPDATE, field: "messageList", value: messageList });
  };

  return (
    <>
      {messageList.length === 0 ? (
        <div className="flex items-center justify-center w-full h-[200px] text-lg text-token-text-secondary">No messages yet</div>
      ) : (
        messageList.map(message => {
          if (message) {
            const { id, role, content } = message;
            return role === Role.SYSTEM ? null : (
              <div className="w-full text-token-text-primary" key={id}>
                <div className="text-base py-[18px] px-3 m-auto md:px-5 lg:px-1 xl:px-5">
                  <div className="mx-auto flex flex-1 gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
                    {role === "user" ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })
      )}
    </>
  );
};

export default MsgList;
