"use client";
import { FC } from "react";
import { useAppContext } from "../../AppContextProvider";
import SidebarControler from "./SidebarController";
import NewChatBtn from "./NewChatBtn";

interface SwitchAndNewChatProps {}

const SwitchAndNewChat: FC<SwitchAndNewChatProps> = ({}) => {
  const {
    state: { isSidebarOpen },
  } = useAppContext();
  return isSidebarOpen ? (
    <></>
  ) : (
    <div className="flex items-center">
      <SidebarControler className="hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary" title="Open sidebar" />
      <NewChatBtn className="hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary" />
    </div>
  );
};

export default SwitchAndNewChat;
