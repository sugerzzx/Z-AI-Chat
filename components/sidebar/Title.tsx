import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC, memo } from 'react';
import BootstrapTooltip from '../common/ui/BootstrapTooltip';

interface TitleProps {
  id: string;
  title: string;
  isCurrent: boolean;
}

const Title: FC<TitleProps> = ({ id, title, isCurrent }) => {
  return <li className="relative" style={{ opacity: 1, height: "auto" }}>
    <div className={cn("group relative rounded-lg active:opacity-90 ", isCurrent ? 'bg-token-sidebar-surface-secondary' : 'hover:bg-token-sidebar-surface-secondary')}>
      <Link href={`/c/${id}`} className="flex items-center gap-2 p-2">
        <div className="relative grow overflow-hidden whitespace-nowrap" dir="auto">
          {title}
          <div className={cn("absolute bottom-0 top-0 to-transparent ltr:right-0 ltr:bg-gradient-to-l rtl:left-0 rtl:bg-gradient-to-r", isCurrent ? 'from-token-sidebar-surface-secondary w-10 from-60%' : 'from-token-sidebar-surface-primary from-token-sidebar-surface-primary can-hover:group-hover:from-token-sidebar-surface-secondary w-8 from-0% can-hover:group-hover:w-10 can-hover:group-hover:from-60%')}></div>
        </div>
      </Link>
      <BootstrapTooltip title="选项" placement="top">
        <div className={cn("absolute bottom-0 top-0 items-center gap-1.5 pr-2 ltr:right-0 rtl:left-0", isCurrent ? 'flex' : 'hidden can-hover:group-hover:flex')}>
          <span data-state="closed">
            <button
              className="flex items-center justify-center text-token-text-primary transition hover:text-token-text-secondary radix-state-open:text-token-text-secondary juice:text-token-text-secondary juice:hover:text-token-text-primary"
              type="button"
              id="radix-:rc2f:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-md">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M3 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </span>
        </div>
      </BootstrapTooltip>
    </div>
  </li>;
};

export default memo(Title);