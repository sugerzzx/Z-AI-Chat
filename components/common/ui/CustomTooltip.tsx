"use client";
import { FC, forwardRef } from 'react';
import Tooltip, { TooltipProps } from '@mui/joy/Tooltip';
import { cn } from '@/lib/utils';

interface CustomTooltipProps extends TooltipProps {

}

type BlurPlaceMemt = 'top' | 'bottom' | 'left' | 'right';

const CustomTooltip: FC<CustomTooltipProps> = ({ children, enterDelay, ...props }) => {
  return <Tooltip size='lg' enterDelay={enterDelay || 300} enterNextDelay={300}  {...props} arrow slots={{ arrow: CustomArrow }} slotProps={{ arrow: ({ placement }) => ({ placement }) }}>
    {children}
  </Tooltip>;
};

export default CustomTooltip;

const CustomArrow = forwardRef<HTMLSpanElement>((props: any, ref) => {
  const { ownerState, className, placement, ...other } = props;
  const blurPlacement: BlurPlaceMemt = placement.split('-')[0];
  const positionMap = {
    top: 'bottom-0',
    bottom: 'top-0',
    left: 'right-0',
    right: 'left-0',
  };
  const rotateMap = {
    top: 'rotate-[45deg]',
    bottom: 'rotate-[-135deg]',
    left: 'rotate-[135deg]',
    right: 'rotate-[135deg]',
  };
  const childPositionMap = {
    top: 'bottom-[-4px]',
    bottom: 'top-[-4px]',
    left: 'right-[-4px]',
    right: 'left-[-4px]',
  };
  return <span ref={ref} {...other} className={cn('absolute origin-center rotate-180', positionMap[blurPlacement])} >
    <div className={cn('relative h-2 w-2 rotate-[-135deg] transform shadow-xs dark:border-r dark:border-b border-white/10 bg-[#0d0d0d]', rotateMap[blurPlacement], childPositionMap[blurPlacement])} />
  </span>;
});
