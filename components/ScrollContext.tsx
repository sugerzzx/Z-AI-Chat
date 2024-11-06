"use client";
import { createContext, ReactNode, FC, useRef, useContext, useEffect, useCallback } from "react";

type ScrollContextType = {
  scrollToBottom: () => void;
  registerObserverElement: (element: HTMLElement) => void;
  enableScroll: () => void;
  disableScroll: () => void;
};

const ScrollContext = createContext<ScrollContextType>(null!);

export const useScrollContext = () => useContext(ScrollContext);

interface ScrollContextProviderProps {
  children: ReactNode;
}

export const ScrollContextProvider: FC<ScrollContextProviderProps> = ({ children }) => {
  const targetNodeRef = useRef<HTMLElement | null>(null);
  const isScrollEnabled = useRef(false);
  const observer = useRef<ResizeObserver>(null!);

  const enableScroll = () => {
    isScrollEnabled.current = true;
    document.querySelector("main")?.addEventListener("wheel", disableScroll);
  };

  const disableScroll = () => {
    isScrollEnabled.current = false;
    document.querySelector("main")?.removeEventListener("wheel", disableScroll);
  };

  const scrollToBottom = () => {
    targetNodeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    observer.current = new ResizeObserver(() => {
      if (isScrollEnabled.current) {
        scrollToBottom();
      }
    });
  }, []);

  const registerObserverElement = useCallback((element: HTMLElement) => {
    if (targetNodeRef.current) observer.current.unobserve(targetNodeRef.current);
    if (observer.current) {
      observer.current.observe(element);
      targetNodeRef.current = element;
    }
  }, []);

  return (
    <ScrollContext.Provider
      value={{ scrollToBottom, enableScroll, disableScroll, registerObserverElement }}
    >
      {children}
    </ScrollContext.Provider>
  );
};
