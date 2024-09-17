import { FC } from "react";
import PageHeader from "../page/PageHeader";
import MsgList from "./MsgList";
import { ConversationWithMapping, MessageWithChildren } from "@/types/conversation";
import ConversationNotFound from "./ConversationNotFound";

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

interface ConversationFetcher {
  conversationId: string;
}

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
  return messageList;
};

export const ConversationFetcher: FC<ConversationFetcher> = async ({ conversationId }) => {
  const getConversation = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversation/${conversationId}`,
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Failed to fetch conversation", error);
      return null;
    }
  };
  const conversation = await getConversation();
  const fetchedMessageList = conversation && handleConversation(conversation);

  return fetchedMessageList ? (
    <Conversation fetchedMessageList={fetchedMessageList} />
  ) : (
    <ConversationNotFound />
  );
};
