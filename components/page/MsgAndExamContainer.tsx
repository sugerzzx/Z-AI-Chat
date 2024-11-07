import React, { FC } from "react";
import MsgInput from "./MsgInput";
import { ScrollContextProvider } from "../ScrollContextProvider";

interface MsgAndExamContainerProps {
  children?: React.ReactNode;
  conversationId?: string;
}

const MsgAndExamContainer: FC<MsgAndExamContainerProps> = ({ children, conversationId }) => {
  return (
    <>
      <div className="flex h-full flex-col focus-visible:outline-0">
        <ScrollContextProvider>
          <div className="flex-1 overflow-hidden">{children}</div>
          <MsgInput conversationId={conversationId} />
        </ScrollContextProvider>
      </div>
      <div className="group fixed z-10 hidden gap-1 bottom-2 end-2 md:flex lg:bottom-3 lg:end-3">
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
};

export default MsgAndExamContainer;
