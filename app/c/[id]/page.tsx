import { FC } from "react";
import MsgAndExamContainer from "@/components/page/MsgAndExamContainer";
import Conversation from "@/components/chatPage/Conversation";

interface PageProps {
  params: { id: string; };
}

const Page: FC<PageProps> = async ({ params }) => {
  return (
    <MsgAndExamContainer conversationId={params.id}>
      <Conversation conversationId={params.id} />
    </MsgAndExamContainer>
  );
};

export default Page;
