import { FC } from "react";

interface UserMessageProps {
  content: string | null;
}

const UserMessage: FC<UserMessageProps> = ({ content = "" }) => {
  return (
    <div className="group/conversation-turn relative flex w-full min-w-0 flex-col">
      <div className="flex-col gap-1 md:gap-3">
        <div className="flex flex-grow flex-col max-w-full">
          <div className="min-h-[20px] text-message flex w-full flex-col items-end gap-2 whitespace-pre-wrap break-words [.text-message+&]:mt-5 overflow-x-auto">
            <div className="flex w-full flex-col gap-1 empty:hidden items-end rtl:items-start">
              <div className="relative max-w-[70%] rounded-3xl bg-secondary px-5 py-2.5">
                <div>{content}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
