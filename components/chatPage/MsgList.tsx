"use client";
import { FC } from "react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import { useAppContext } from "../AppContextProvider";

interface MsgListProps {}

const MsgList: FC<MsgListProps> = ({}) => {
  const {
    state: { messageList },
  } = useAppContext();

  return (
    <>
      {messageList.map(({ role, content, id }) => (
        <div className="w-full text-token-text-primary" key={id}>
          <div className="text-base py-[18px] px-3 md:px-4 m-auto md:px-5 lg:px-1 xl:px-5">
            <div className="mx-auto flex flex-1 gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
              {role === "user" ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MsgList;
