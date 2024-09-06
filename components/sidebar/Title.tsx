import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC, memo, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Ellipsis } from 'lucide-react';
import ArrowTooltip from '../ui/ArrowTooltip';
interface TitleProps {
  id: string;
  title: string;
  isCurrent: boolean;
}

const Title: FC<TitleProps> = ({ id, title, isCurrent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  return <li className="relative h-auto">
    <div className={cn("group relative rounded-lg active:opacity-90", isCurrent || isOpen ? 'bg-secondary' : 'hover:bg-secondary')}>
      <Link href={`/c/${id}`} className="flex items-center gap-2 p-2">
        <div className="relative grow overflow-hidden whitespace-nowrap" dir="auto">
          {title}
        </div>
      </Link>
      <div className={cn("absolute bottom-0 top-0 items-center gap-1.5 pr-2 ltr:right-0 rtl:left-0", isCurrent || isOpen ? 'flex' : 'hidden group-hover:flex', isEdit && 'flex left-0')}>
        {
          isEdit ?
            <div className='absolute bottom-0 left-[7px] right-2 top-0 flex items-center'>
              <Input defaultValue={title} onBlur={() => setIsEdit(false)} autoFocus={true} className='h-auto w-full p-0 focus:border focus:border-chart-2 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none' />
            </div>
            :
            <DropdownMenu onOpenChange={(newVal) => setIsOpen(newVal)}>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'icon'} className='flex items-center justify-center text-muted-foreground transition hover:text-foreground focus-visible:ring-0'>
                  <ArrowTooltip title="选项" side="top">
                    <Ellipsis size={20} />
                  </ArrowTooltip>
                </Button>
              </DropdownMenuTrigger>
              {
                <DropdownMenuContent align="start" className={isOpen ? '' : 'opacity-0'} onCloseAutoFocus={() => setIsOpen(false)}>
                  <DropdownMenuItem className='cursor-pointer' onClick={() => setIsEdit(true)}>
                    编辑
                  </DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer text-destructive data-[highlighted]:text-destructive'>
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              }
            </DropdownMenu>}
      </div>
    </div>
  </li>;
};

export default memo(Title);