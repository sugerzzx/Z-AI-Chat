import { IconButton } from "@mui/material";
import { FC } from "react";
import { useAppContext } from "../AppContextProvider";
import SidebarControler from "../common/SidebarControler";
import NewChatBtn from "../common/NewChatBtn";

interface ControlerBtnsProps {}

const ControlerBtns: FC<ControlerBtnsProps> = ({}) => {
  const { dispatch } = useAppContext();
  return (
    <div className="flex justify-between h-14 items-center">
      <SidebarControler className="hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary" title="Close sidebar" />
      <NewChatBtn />
    </div>
  );
};

export default ControlerBtns;
