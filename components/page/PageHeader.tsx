import { FC, memo } from "react";
import SwitchAndNewChat from "./SwitchAndNewChat";
import ThemeSwitcher from "./ThemeSwitcher";

interface PageHeaderProps {}

const PageHeader: FC<PageHeaderProps> = memo(function PageHeader({}) {
  return (
    <div className="sticky top-0 p-3 mb-1.5 flex items-center justify-between z-10 h-14 font-semibold">
      <SwitchAndNewChat />
      <div className="justify-self-end">
        <ThemeSwitcher />
      </div>
    </div>
  );
});

export default PageHeader;
