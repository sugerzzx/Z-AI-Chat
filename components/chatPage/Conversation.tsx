import { FC } from "react";
import PageHeader from "../page/PageHeader";
import MsgList from "./MsgList";

interface ConversationProps {
  conversationId?: string;
}

const Conversation: FC<ConversationProps> = ({ conversationId }) => {
  return (
    <div className="h-full">
      <div className="relative h-full">
        <div className="h-full overflow-y-auto w-full">
          <div className="flex flex-col text-sm md:pb-9">
            <PageHeader />
            <MsgList conversationId={conversationId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
