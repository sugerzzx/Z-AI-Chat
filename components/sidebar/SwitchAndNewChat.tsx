import { FC } from "react";
import SidebarControler from "../common/SidebarController";
import NewChatBtn from "../common/NewChatBtn";

interface SwitchAndNewChatProps {}

const SwitchAndNewChat: FC<SwitchAndNewChatProps> = ({}) => {
  return (
    <div className="flex justify-between h-14 items-center">
      <SidebarControler className="hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary" title="Close sidebar" />
      <NewChatBtn className="hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary" />
    </div>
  );
};

export default SwitchAndNewChat;
