import MsgAndExamContainer from "@/components/common/page/MsgAndExamContainer";
import ExampleArea from "@/components/examplePage/ExampleArea";
import PageHeader from "@/components/common/page/PageHeader";

export default function Home() {
  return (
    <>
      <MsgAndExamContainer>
        <div className="relative h-full">
          <PageHeader />
          <ExampleArea />
        </div>
      </MsgAndExamContainer>
      <div className="group fixed bottom-3 end-3 z-10 hidden gap-1 juice:bottom-2 juice:end-2 md:flex juice:lg:bottom-3 juice:lg:end-3">
        <button
          className="flex h-6 w-6 items-center justify-center rounded-full border border-token-border-light text-xs text-token-text-secondary"
          type="button"
          id="radix-:rph:"
          aria-haspopup="menu"
          aria-expanded="false"
          data-state="closed"
        >
          ?
        </button>
      </div>
    </>
  );
}
