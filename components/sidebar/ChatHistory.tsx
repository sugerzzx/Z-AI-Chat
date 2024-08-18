"use client";
import { groupByDate } from "@/lib/utils";
import { ConversationTitle } from "@/types/conversation";
import { FC, useEffect, useMemo, useState } from "react";
import BootstrapTooltip from "../common/ui/BootstrapTooltip";
import Link from "next/link";
import { useEventBusContext } from "../EventBusContext";

interface ChatHistoryProps { }

const ChatHistory: FC<ChatHistoryProps> = ({ }) => {
  const [chatList, setChatList] = useState<ConversationTitle[]>([]);
  const historyList = useMemo(() => groupByDate(chatList), [chatList]);
  const { subscribe, unsubscribe } = useEventBusContext();

  const fetchConversations = async () => {
    const response = await fetch("/api/conversations");
    const { items } = await response.json();
    setChatList(items);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const callback = (conversationId: string) => {
      setChatList((prev) => {
        return [...prev, { id: conversationId, title: "New Chat", updateTime: Date.now() }];
      });
    };
    subscribe("updateConversationTitle", callback);
    return () => {
      unsubscribe("updateConversationTitle", callback);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 pb-2 text-token-text-primary text-sm juice:mt-5">
      <div>
        {historyList.map(([date, chatList]) => (
          <div key={date} className="relative mt-5 empty:mt-0 empty:hidden juice:first:mt-0 juice:last:mb-5" style={{ height: "auto", opacity: 1 }}>
            <div className="juice:sticky juice:top-0 juice:z-20 juice:bg-token-sidebar-surface-primary">
              <span className="flex h-9 items-center">
                <h3 className="pb-2 pt-3 px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all text-token-text-secondary">{date}</h3>
              </span>
            </div>
            <ol>
              {chatList.map(({ id, title }: ConversationTitle) => (
                <li className="relative" style={{ opacity: 1, height: "auto" }} key={id}>
                  <div className="group relative rounded-lg active:opacity-90 hover:bg-token-sidebar-surface-secondary">
                    <Link href={`/c/${id}`} className="flex items-center gap-2 p-2">
                      <div className="relative grow overflow-hidden whitespace-nowrap" dir="auto">
                        {title}
                        <div className="absolute bottom-0 top-0 to-transparent ltr:right-0 ltr:bg-gradient-to-l rtl:left-0 rtl:bg-gradient-to-r from-token-sidebar-surface-primary from-token-sidebar-surface-primary can-hover:group-hover:from-token-sidebar-surface-secondary w-8 from-0% can-hover:group-hover:w-20 can-hover:group-hover:from-60% juice:can-hover:group-hover:w-10"></div>
                      </div>
                    </Link>
                    <BootstrapTooltip title="Options" placement="top">
                      <div className="absolute bottom-0 top-0 items-center gap-1.5 pr-2 ltr:right-0 rtl:left-0 hidden can-hover:group-hover:flex">
                        <span className="" data-state="closed">
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
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
