import { FC } from "react";
import PageHeader from "../page/PageHeader";
import MsgList from "./MsgList";
import { MessageWithChildren } from "@/types/conversation";

interface ConversationProps {
  fetchedMessageList?: MessageWithChildren[] | null;
}

const Conversation: FC<ConversationProps> = ({ fetchedMessageList = null }) => {
  return (
    <div className="h-full">
      <div className="relative h-full">
        <div className="h-full overflow-y-auto w-full">
          <div className="flex flex-col text-sm md:pb-9">
            <PageHeader />
            <MsgList fetchedMessageList={fetchedMessageList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
