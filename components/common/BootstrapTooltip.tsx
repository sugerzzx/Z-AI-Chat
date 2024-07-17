"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

const BootstrapTooltip = styled(({ className, enterDelay, ...props }: TooltipProps) => <Tooltip {...props} arrow classes={{ popper: className }} enterDelay={enterDelay || 500} />)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#0d0d0d",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#0d0d0d",
    fontSize: "1rem",
    fontWeight: 600,
    fontFamily: "Inter",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #242424",
  },
}));

export default BootstrapTooltip;
