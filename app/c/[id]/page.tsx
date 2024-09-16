import { FC } from "react";
import MsgAndExamContainer from "@/components/page/MsgAndExamContainer";
import { ConversationFetcher } from "@/components/chatPage/Conversation";

interface PageProps {
  params: { id: string; };
}

const Page: FC<PageProps> = async ({ params }) => {
  return (
    <MsgAndExamContainer conversationId={params.id}>
      <ConversationFetcher conversationId={params.id} />
    </MsgAndExamContainer>
  );
};

export default Page;
