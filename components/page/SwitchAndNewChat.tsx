"use client";
import { useAppContext } from "../AppContextProvider";
import SidebarControler from "./SidebarController";
import NewChatBtn from "./NewChatBtn";

const SwitchAndNewChat = () => {
  const {
    state: { isSidebarOpen },
  } = useAppContext();
  return isSidebarOpen ? (
    <div></div>
  ) : (
    <div className="flex items-center gap-2">
      <SidebarControler title="打开边栏" side="bottom" />
      <NewChatBtn />
    </div>
  );
};

export default SwitchAndNewChat;
