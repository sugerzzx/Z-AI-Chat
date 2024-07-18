import MsgAndExamContainer from "@/components/common/page/MsgAndExamContainer";
import ExampleArea from "@/components/examplePage/ExampleArea";
import PageHeader from "@/components/common/page/PageHeader";

export default function Home() {
  return (
    <>
      <MsgAndExamContainer>
        <div className="relative h-full">
          <div className="absolute left-0 right-0">
            <PageHeader />
          </div>
          <ExampleArea />
        </div>
      </MsgAndExamContainer>
    </>
  );
}
