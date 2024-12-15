"use client";
import { FC, memo, useEffect } from "react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import { useAppContext } from "../AppContextProvider";
import { MessageWithChildren } from "@/types/conversation";
import { ActionType } from "@/lib/appReducer";
import { Role } from "@/constant/conversation.enum";

interface MsgListContainerProps {
  fetchedMessageList: MessageWithChildren[] | null;
}

const MsgListContainer: FC<MsgListContainerProps> = memo(function MsgListContainer({
  fetchedMessageList,
}) {
  const {
    state: { messageList },
    dispatch,
  } = useAppContext();

  useEffect(() => {
    if (fetchedMessageList) {
      dispatch({ type: ActionType.UPDATE, field: "messageList", value: fetchedMessageList });
    }
  }, [dispatch, fetchedMessageList]);

  return messageList?.length ? (
    <MsgList messageList={messageList} />
  ) : (
    <div className="flex items-center justify-center w-full h-[200px] text-lg">No messages yet</div>
  );
});
interface MsgListProps {
  messageList: MessageWithChildren[];
}

const MsgList: FC<MsgListProps> = ({ messageList }) => {
  return messageList.map((message) => {
    if (message) {
      const { id, role, content } = message;
      return role === Role.SYSTEM ? null : (
        <div className="w-full" key={id}>
          <div className="text-base py-[18px] px-3 m-auto md:px-5 lg:px-1 xl:px-5">
            <div className="mx-auto flex flex-1 gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
              {role === "user" ? (
                <UserMessage content={content} />
              ) : (
                <AssistantMessage content={content} />
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  });
};

export default MsgListContainer;
