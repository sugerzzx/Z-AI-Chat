import { FC } from "react";
import Conversation from "@/components/chatPage/Conversation";
import { ConversationWithMapping, MessageWithChildren } from "@/types/conversation";
import { redirect } from "next/navigation";

interface PageProps {
  params: { id: string };
}

const Page: FC<PageProps> = async ({ params }) => {
  const conversationId = params.id;
  const getConversation = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversation/${conversationId}`,
        { cache: "no-cache" },
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

  if (fetchedMessageList) {
    return <Conversation fetchedMessageList={fetchedMessageList} />;
  } else {
    redirect("/");
  }
};

export default Page;

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
