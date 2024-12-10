import { useCallback, useRef } from "react";

let scrollElement: HTMLElement | null = null;
let isScrollEnabled = false;

export const enableScroll = () => {
  scrollElement?.addEventListener("scroll", handleScrollEnd);
  isScrollEnabled = true;
};

export const disableScroll = () => {
  scrollElement?.removeEventListener("scroll", handleScrollEnd);
  isScrollEnabled = false;
};

let scrollTimeout: number | null = null;
const smoothScrollToBottom = (element: HTMLElement, duration: number) => {
  if (scrollTimeout) {
    cancelAnimationFrame(scrollTimeout);
  }

  const distance = element.scrollHeight - element.scrollTop;
  const startTime = performance.now();

  const scrollStep = (timestamp: DOMHighResTimeStamp) => {
    const elapsedTime = timestamp - startTime;
    console.log(elapsedTime);

    const progress = Math.min(elapsedTime / duration, 1);
    element.scrollTo(0, element.scrollTop + distance * progress);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  };

  scrollTimeout = requestAnimationFrame(scrollStep);
};

const handleScrollEnd = (e: Event) => {
  const target = e.target as HTMLElement;
  const tolerance = 1;
  const isBottom = target.clientHeight + target.scrollTop >= target.scrollHeight - tolerance;
  if (!isBottom) {
    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    isScrollEnabled = false;
  } else {
    isScrollEnabled = true;
  }
};

export const useRegisterScrollElement = () => {
  const registerCallback = useCallback((node: HTMLElement | null) => {
    if (node) {
      scrollElement = node;
    }
  }, []);

  return registerCallback;
};

export const useRegisterObservedElement = () => {
  const preObserver = useRef<ResizeObserver | null>(null);

  const registerCallback = useCallback((node: HTMLElement | null) => {
    if (preObserver.current) {
      preObserver.current.disconnect();
      preObserver.current = null;
    }

    if (node) {
      const observer = new ResizeObserver(() => {
        if (isScrollEnabled && scrollElement) {
          const duration = 500;
          smoothScrollToBottom(scrollElement, duration);
        }
      });

      observer.observe(node);
      preObserver.current = observer;
    }
  }, []);

  return registerCallback;
};
