import { FC } from "react";
import SwitchAndNewChat from "./SwitchAndNewChat";

interface PageHeaderProps {}

const PageHeader: FC<PageHeaderProps> = ({}) => {
  return (
    <div className="sticky top-0 juice:p-3 mb-1.5 flex items-center justify-between z-10 h-14 p-2 font-semibold bg-token-main-surface-primary">
      <div className="flex items-center gap-2 overflow-hidden juice:gap-0">
        <SwitchAndNewChat />
      </div>
      <div className="flex gap-2 pr-1"></div>
    </div>
  );
};

export default PageHeader;
