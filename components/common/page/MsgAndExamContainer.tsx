import React, { FC } from "react";
import MsgInput from "./MsgInput";

interface MsgAndExamContainerProps {
  children?: React.ReactNode;
}

const MsgAndExamContainer: FC<MsgAndExamContainerProps> = ({ children }) => {
  return (
    <>
      <div className="flex h-full flex-col focus-visible:outline-0">
        <div className="flex-1 overflow-hidden">{children}</div>
        <MsgInput />
      </div>
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
};

export default MsgAndExamContainer;
