import { FC, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Arrow } from "./Tooltip";

export interface ArrowTooltipProps {
  children: ReactNode;
  title: string;
  delay?: number;
  side?: "top" | "right" | "bottom" | "left";
}

const ArrowTooltip: FC<ArrowTooltipProps> = ({ children, title, delay = 300, side }) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>
          <p>{title}</p>
          <Arrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ArrowTooltip;
