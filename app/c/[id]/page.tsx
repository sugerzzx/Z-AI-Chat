import { FC } from "react";
import MsgAndExamContainer from "@/components/common/page/MsgAndExamContainer";
import PageHeader from "@/components/common/page/PageHeader";
import MsgList from "@/components/chatPage/MsgList";

interface PageProps {
  params: { id: string };
}

const Page: FC<PageProps> = ({ params }) => {
  return (
    <MsgAndExamContainer>
      <div className="h-full">
        <div className="relative h-full">
          <div className="h-full overflow-y-auto w-full">
            <div className="flex flex-col text-sm md:pb-9">
              <PageHeader />
              <MsgList />
            </div>
          </div>
        </div>
      </div>
    </MsgAndExamContainer>
  );
};

export default Page;
