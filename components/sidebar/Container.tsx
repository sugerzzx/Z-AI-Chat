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
      className="flex-shrink-0 overflow-x-hidden transition-all bg-token-sidebar-surface-primary"
      style={{ width: isSidebarOpen ? "260px" : "0px", visibility: isSidebarOpen ? "visible" : "hidden" }}
    >
      {children}
    </div>
  );
};

export default Container;
