"use client";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";

const ClickTrans: FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => {
  const [isTransition, setIsTransition] = useState(false);

  return (
    <div
      className={cn("transition-all", className)}
      onClick={() => setIsTransition(true)}
      style={{ transform: isTransition ? "scale(0.98)" : "none" }}
      onTransitionEnd={() => setIsTransition(false)}
    >
      {children}
    </div>
  );
};

export default ClickTrans;
