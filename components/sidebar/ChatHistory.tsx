"use client";
import { cn, groupByDate } from "@/lib/utils";
import { ConversationTitle } from "@/types/conversation";
import { FC, useEffect, useMemo, useRef } from "react";
import { useEventBusContext } from "../EventBusContext";
import Title from "./Title";
import { usePathname } from "next/navigation";
import { Event } from "@/constant/event.event";
import { Loader } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatHistoryProps { }

const ChatHistory: FC<ChatHistoryProps> = ({ }) => {
  const { subscribe, unsubscribe } = useEventBusContext();
  const pathname = usePathname();
  const limit = 20;
  const lastTitle = useRef<HTMLLIElement>(null);

  const fetchConversations = ({ pageParam = 0 }) => fetch(`/api/conversations?offset=${pageParam}&limit=${limit}`).then((res) => res.json());

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.items.length; // 下一页的offset
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
  });

  const observeLastTitle = () => {
    if (!lastTitle.current || !hasNextPage) {
      return;
    }
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        await fetchNextPage();
        observer.disconnect();
      }
    }, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    });
    observer.observe(lastTitle.current!);
  };
  useEffect(observeLastTitle, [data]);

  useEffect(() => {
    const callback = () => {
      refetch();
    };
    subscribe(Event.UpdateConversationTitle, callback);
    return () => {
      unsubscribe(Event.UpdateConversationTitle, callback);
    };
  }, []);

  const historyList = useMemo(() => data && groupByDate(data.pages.map((page) => page.items).flat()), [data]);

  if (status === 'pending') return <Loading className="h-screen" />;
  if (status === 'error' || !historyList) return <div>Error loading titles</div>;

  return (
    <div className="flex flex-col gap-2 pb-2 text-token-text-primary text-sm mt-5">
      <div>
        {historyList.map(([date, chatList]) => (
          <div key={date} className="relative mt-5 empty:mt-0 empty:hidden first:mt-0 last:mb-5" style={{ height: "auto", opacity: 1 }}>
            <div className="sticky top-0 z-20 bg-background">
              <span className="flex h-9 items-center">
                <h3 className="pb-2 pt-3 px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all text-token-text-secondary">{date}</h3>
              </span>
            </div>
            <ol>
              {chatList.map(({ id, title }: ConversationTitle) => {
                const isCurrent = pathname === `/c/${id}`;
                const isLast = chatList[chatList.length - 1].id === id;
                return <Title key={id} isCurrent={isCurrent} id={id} title={title} ref={isLast ? lastTitle : null} />;
              })}
            </ol>
          </div>
        ))}
      </div>
      {
        isFetchingNextPage && <Loading className="pb-5" />
      }
    </div>
  );
};

export default ChatHistory;

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> { }

const Loading: FC<LoadingProps> = ({ className }) => {
  return (
    <div className={cn('w-full flex items-center justify-center', className)}>
      <Loader className="animate-spin" />
    </div>
  );
};