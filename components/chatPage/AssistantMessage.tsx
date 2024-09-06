import { FC } from "react";
import Markdown from "../ui/Markdown";
import { BotMessageSquare } from "lucide-react";

interface AssistantMessageProps {
  content: string | null;
}

const AssistantMessage: FC<AssistantMessageProps> = ({ content = "" }) => {
  return (
    <>
      <div className="flex-shrink-0 flex flex-col relative items-end">
        <div>
          <div className="pt-0">
            <div className="gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
              <div className="relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8">
                <BotMessageSquare />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="group/conversation-turn relative flex w-full min-w-0 flex-col agent-turn">
        <div className="flex-col gap-1 md:gap-3">
          <div className="flex flex-grow flex-col max-w-full">
            <div className="min-h-[20px] text-message flex w-full flex-col items-end gap-2 whitespace-pre-wrap break-words [.text-message+&]:mt-5 overflow-x-auto">
              <div className="flex w-full flex-col gap-1 empty:hidden first:pt-[3px]">
                <Markdown className="prose w-full break-words dark:prose-invert dark">{content}</Markdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantMessage;
