import { FC } from "react";
import SwitchAndNewChat from "./SwitchAndNewChat";
import ChatGpt from "./ChatGpt";
import ClickTrans from "../common/ui/ClickTrans";
import ChatHistory from "./ChatHistory";
import Container from "./Container";

interface SideBarProps { }

const SideBar: FC<SideBarProps> = ({ }) => {
  return (
    <Container>
      <div className="h-full w-[260px]">
        <nav className="flex h-full w-full flex-col px-3 pb-3.5 juice:pb-0">
          <SwitchAndNewChat />
          <div className="flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto">
            <ChatGpt />
            <div>
              <ClickTrans>
                <a href="/gpts">
                  <button className="flex h-10 w-full items-center gap-2 rounded-lg px-2 font-medium text-token-text-primary hover:bg-token-sidebar-surface-secondary juice:gap-2.5 juice:font-normal">
                    <div className="flex items-center justify-center text-token-text-secondary h-6 w-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-md">
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M6.75 4.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M2.5 6.75a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0M17.25 4.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M13 6.75a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0M6.75 15a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M2.5 17.25a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0M17.25 15a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M13 17.25a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-sm">Explore GPTs</span>
                  </button>
                </a>
              </ClickTrans>
            </div>
            <ChatHistory></ChatHistory>
          </div>
          <div className="flex flex-col pt-2 empty:hidden juice:py-2 dark:border-white/20">
            <a className="group flex gap-2 p-2.5 text-sm cursor-pointer focus:ring-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group items-center hover:bg-token-sidebar-surface-secondary m-0 rounded-lg px-2">
              <span className="flex w-full flex-row flex-wrap-reverse justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-token-border-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-sm shrink-0">
                      <path
                        fill="#fff"
                        d="M6.394 4.444c.188-.592 1.024-.592 1.212 0C8.4 8.9 9.1 9.6 13.556 10.394c.592.188.592 1.024 0 1.212C9.1 12.4 8.4 13.1 7.606 17.556c-.188.592-1.024.592-1.212 0C5.6 13.1 4.9 12.4.444 11.606c-.592-.188-.592-1.024 0-1.212C4.9 9.6 5.6 8.9 6.394 4.444m8.716 9.841a.41.41 0 0 1 .78 0c.51 2.865.96 3.315 3.825 3.826.38.12.38.658 0 .778-2.865.511-3.315.961-3.826 3.826a.408.408 0 0 1-.778 0c-.511-2.865-.961-3.315-3.826-3.826a.408.408 0 0 1 0-.778c2.865-.511 3.315-.961 3.826-3.826Zm2.457-12.968a.454.454 0 0 1 .866 0C19 4.5 19.5 5 22.683 5.567a.454.454 0 0 1 0 .866C19.5 7 19 7.5 18.433 10.683a.454.454 0 0 1-.866 0C17 7.5 16.5 7 13.317 6.433a.454.454 0 0 1 0-.866C16.5 5 17 4.5 17.567 1.317"
                      ></path>
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <span>Upgrade plan</span>
                    <span className="line-clamp-1 text-xs text-token-text-tertiary">Get GPT-4, DALL·E, and more</span>
                  </div>
                </div>
              </span>
            </a>
            <div className="flex w-full items-center md:hidden">
              <div className="max-w-[100%] grow">
                <div className="group relative" data-headlessui-state="">
                  <button
                    data-testid="profile-button"
                    className="flex w-full max-w-[100%] items-center gap-2 rounded-lg p-2 text-sm  hover:bg-token-sidebar-surface-secondary group-ui-open:bg-token-sidebar-surface-secondary"
                    id="headlessui-menu-button-:rcdh:"
                    type="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-headlessui-state=""
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center overflow-hidden rounded-full">
                        <div className="relative flex">
                          <img
                            alt="User"
                            loading="lazy"
                            width="32"
                            height="32"
                            decoding="async"
                            data-nimg="1"
                            className="rounded-sm"
                            src="https://lh3.googleusercontent.com/a/AGNmyxbBoJwrMEP2BdskZQJRJYk6maUJDsgQYU2QxiTo=s96-c"
                            style={{ color: "transparent" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative -top-px grow -space-y-px truncate text-start text-token-text-primary">
                      <div dir="auto">User Name</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </Container>
  );
};

export default SideBar;
