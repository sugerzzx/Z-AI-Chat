import { FC } from "react";
import SidebarControler from "../page/SidebarController";
import NewChatBtn from "../page/NewChatBtn";

interface SwitchAndNewChatProps {}

const SwitchAndNewChat: FC<SwitchAndNewChatProps> = ({}) => {
  return (
    <div className="flex justify-between h-14 items-center">
      <SidebarControler title="关闭边栏" side="right" />
      <NewChatBtn />
    </div>
  );
};

export default SwitchAndNewChat;
