"use client";
import { FC } from "react";
import { useAppContext } from "../AppContextProvider";

interface ContainerProps {
  children?: React.ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
  const {
    state: { isSidebarOpen },
  } = useAppContext();
  return (
    <div
      className="flex-shrink-0 overflow-x-hidden transition-all bg-background border-r border-border"
      style={{ width: isSidebarOpen ? "260px" : "0px", visibility: isSidebarOpen ? "visible" : "hidden" }}
    >
      <div className="h-full w-[260px]">
        <nav className="flex h-full w-full flex-col px-3 pb-0">
          {children}
        </nav>
      </div>
    </div>
  );
};

export default Container;
