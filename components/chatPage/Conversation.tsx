"use client";
import { FC } from "react";
import PageHeader from "../page/PageHeader";
import MsgList from "./MsgList";
import { MessageWithChildren } from "@/types/conversation";
import { useScroll } from "@/hooks/useScroll";
import { Button } from "../ui/Button";
import { MoveDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationProps {
  fetchedMessageList?: MessageWithChildren[] | null;
}

const Conversation: FC<ConversationProps> = ({ fetchedMessageList = null }) => {
  const [registerScrollElement, registerObservedElement, isShowButton, smoothScrollToBottom] =
    useScroll();
  return (
    <div className="h-full">
      <div className="relative h-full">
        <div className="h-full overflow-y-auto w-full" ref={registerScrollElement}>
          <div className="flex flex-col text-sm md:pb-9" ref={registerObservedElement}>
            <PageHeader />
            <MsgList fetchedMessageList={fetchedMessageList} />
          </div>
          <Button
            variant={"secondary"}
            size={"icon"}
            className={cn(
              "absolute right-10 bottom-0 transition-all duration-250 rounded-full",
              isShowButton ? "opacity-100" : "opacity-0 -right-10",
            )}
            onClick={smoothScrollToBottom}
          >
            <MoveDown className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
