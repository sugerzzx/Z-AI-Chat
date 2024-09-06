"use client";
import { groupByDate } from "@/lib/utils";
import { ConversationTitle } from "@/types/conversation";
import { FC, useEffect, useMemo, useState } from "react";
import { useEventBusContext } from "../EventBusContext";
import Title from "./Title";
import { usePathname } from "next/navigation";
import { Event } from "@/constant/event.event";

interface ChatHistoryProps { }

const ChatHistory: FC<ChatHistoryProps> = ({ }) => {
  const [chatList, setChatList] = useState<ConversationTitle[]>([]);
  const historyList = useMemo(() => groupByDate(chatList), [chatList]);
  const { subscribe, unsubscribe } = useEventBusContext();
  const pathname = usePathname();

  const fetchConversations = async () => {
    const response = await fetch("/api/conversations");
    const { items } = await response.json();
    setChatList(items);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const callback = ({ conversationId, title }: { conversationId: string, title: string; }) => {
      setChatList((prev) => {
        return [...prev, { id: conversationId, title, updateTime: Date.now() }];
      });
    };
    subscribe(Event.UpdateConversationTitle, callback);
    return () => {
      unsubscribe(Event.UpdateConversationTitle, callback);
    };
  }, []);

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
                return <Title key={id} isCurrent={isCurrent} id={id} title={title} />;
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
