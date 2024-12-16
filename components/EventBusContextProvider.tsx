"use client";
import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useRef } from "react";

export type EventListener = (data: unknown) => void;

type EventBusProps = {
  subscribe: (eventName: string, callback: EventListener) => void;
  unsubscribe: (eventName: string, callback: EventListener) => void;
  publish: (eventName: string, data?: unknown) => void;
};

const EventBusContext = createContext<EventBusProps>(null!);

export const useEventBusContext = () => {
  return useContext(EventBusContext);
};

interface EventBusContextProviderProps {
  children: ReactNode;
}

export const EventBusContextProvider: FC<EventBusContextProviderProps> = ({ children }) => {
  const listenersRef = useRef<{ [key: string]: EventListener[] }>({});

  const subscribe = useCallback((eventName: string, callback: EventListener) => {
    if (!listenersRef.current[eventName]) {
      listenersRef.current[eventName] = [];
    }
    listenersRef.current[eventName].push(callback);
  }, []);

  const unsubscribe = useCallback((eventName: string, callback: EventListener) => {
    if (listenersRef.current[eventName]) {
      listenersRef.current[eventName] = listenersRef.current[eventName].filter(
        (cb) => cb !== callback,
      );
    }
  }, []);

  const publish = useCallback((eventName: string, data?: unknown) => {
    if (listenersRef.current[eventName]) {
      listenersRef.current[eventName].forEach((cb) => cb(data));
    }
  }, []);

  const contextValue = useMemo(
    () => ({ subscribe, unsubscribe, publish }),
    [subscribe, unsubscribe, publish],
  );

  return <EventBusContext.Provider value={contextValue}>{children}</EventBusContext.Provider>;
};
