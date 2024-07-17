import React, { FC } from "react";
import MsgInput from "./MsgInput";

interface MsgAndExamContainerProps {
  children?: React.ReactNode;
}

const MsgAndExamContainer: FC<MsgAndExamContainerProps> = ({ children }) => {
  return (
    <div className="flex h-full flex-col focus-visible:outline-0">
      <div className="flex-1 overflow-hidden">{children}</div>
      <MsgInput />
    </div>
  );
};

export default MsgAndExamContainer;
