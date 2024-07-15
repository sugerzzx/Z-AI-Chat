import { groupByDate } from "@/lib/utils";
import { Chat } from "@/types/chat";
import { FC, useMemo, useState } from "react";
import BootstrapTooltip from "../common/BootstrapTooltip";

interface ChatHistoryProps {}

const ChatHistory: FC<ChatHistoryProps> = ({}) => {
  const [chatList] = useState<Chat[]>([
    {
      id: "1",
      title: "Life isn’t about getting and having, it’s about giving and being.",
      updateTime: Date.now(),
    },
    {
      id: "2",
      title: "Whatever the mind of man can conceive and believe, it can achieve.",
      updateTime: Date.now() - 100,
    },
    {
      id: "3",
      title: "Strive not to be a success, but rather to be of value.",
      updateTime: Date.now() - 200,
    },
    {
      id: "4",
      title: "Life isn’t about getting and having, it’s about giving and being.",
      updateTime: Date.now() - 300,
    },
    {
      id: "5",
      title: "Whatever the mind of man can conceive and believe, it can achieve.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: "6",
      title: "Strive not to be a success, but rather to be of value.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "7",
      title: "Life isn’t about getting and having, it’s about giving and being.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: "8",
      title: "Whatever the mind of man can conceive and believe, it can achieve.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 4,
    },
    {
      id: "9",
      title: "Strive not to be a success, but rather to be of value.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 5,
    },
    {
      id: "10",
      title: "Life isn’t about getting and having, it’s about giving and being.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 6,
    },
    {
      id: "11",
      title: "Whatever the mind of man can conceive and believe, it can achieve.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 7,
    },
    {
      id: "12",
      title: "Strive not to be a success, but rather to be of value.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 8,
    },
    {
      id: "13",
      title: "Life isn’t about getting and having, it’s about giving and being.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 9,
    },
    {
      id: "14",
      title: "Whatever the mind of man can conceive and believe, it can achieve.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 10,
    },
    {
      id: "15",
      title: "Strive not to be a success, but rather to be of value.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 11,
    },
    {
      id: "16",
      title: "Life isn’t about getting and having, it’s about giving and being.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 12,
    },
    {
      id: "17",
      title: "Whatever the mind of ",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 13,
    },
    {
      id: "18",
      title: "Strive not to be a success, but rather to be of value.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 14,
    },
    {
      id: "19",
      title: "Life isn’t about getting and having, it’s about giving and being.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 15,
    },
    {
      id: "20",
      title: "Whatever the mind ",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 16,
    },
    {
      id: "21",
      title: "Strive not to be a success, but rather to be of value.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 14,
    },
    {
      id: "22",
      title: "Life isn’t about getting and having, it’s about giving and being.",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 15,
    },
    {
      id: "23",
      title: "Whatever the mind ",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 16,
    },
    {
      id: "24",
      title: "Whatever the mind ",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 16,
    },
    {
      id: "25",
      title: "Whatever the mind ",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 16,
    },
    {
      id: "26",
      title: "Whatever the mind ",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 16,
    },
    {
      id: "27",
      title: "Whatever the mind ",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 16,
    },
    {
      id: "28",
      title: "Whatever the mind ",
      updateTime: Date.now() - 1000 * 60 * 60 * 24 * 16,
    },
  ]);
  const historyList = useMemo(() => groupByDate(chatList), [chatList]);
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
              {chatList.map(({ id, title }: Chat) => (
                <li className="relative" style={{ opacity: 1, height: "auto" }} key={id}>
                  <div className="group relative rounded-lg active:opacity-90 hover:bg-token-sidebar-surface-secondary">
                    <a href="/c/4486ae81-eff8-4784-adb7-832da99febaa" className="flex items-center gap-2 p-2">
                      <div className="relative grow overflow-hidden whitespace-nowrap" dir="auto">
                        {title}
                        <div className="absolute bottom-0 top-0 to-transparent ltr:right-0 ltr:bg-gradient-to-l rtl:left-0 rtl:bg-gradient-to-r from-token-sidebar-surface-primary from-token-sidebar-surface-primary can-hover:group-hover:from-token-sidebar-surface-secondary w-8 from-0% can-hover:group-hover:w-20 can-hover:group-hover:from-60% juice:can-hover:group-hover:w-10"></div>
                      </div>
                    </a>
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
