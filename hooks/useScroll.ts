import { useCallback, useState, useRef } from "react";

let scrollElement: HTMLElement | null = null;
let isAutoScroll = false;

const scrollToBottom = () => {
  if (scrollElement) {
    scrollElement.scrollTo(0, scrollElement.scrollHeight);
  }
};

const pauseAutoScroll = () => {
  if (isAutoScroll) {
    isAutoScroll = false;
  }
};

const resumeAutoScroll = () => {
  if (!isAutoScroll) {
    isAutoScroll = true;
  }
};

const getIsBottom = (event: Event) => {
  const target = event.target as HTMLElement;
  const tolerance = 1;
  return target.clientHeight + target.scrollTop >= target.scrollHeight - tolerance;
};

const handleScroll = (event: Event) => {
  const isBottom = getIsBottom(event);
  if (!isBottom) {
    pauseAutoScroll();
  } else {
    resumeAutoScroll();
  }
};

export const startAutoScroll = () => {
  scrollElement?.addEventListener("scroll", handleScroll);
  isAutoScroll = true;
};

export const endAutoScroll = () => {
  scrollElement?.removeEventListener("scroll", handleScroll);
  isAutoScroll = false;
};

export const useScroll: () => [
  (node: HTMLElement | null) => void,
  (node: HTMLElement | null) => void,
  boolean,
  () => void,
] = () => {
  const [isShowButton, setIsShowButton] = useState(false);
  const requestId = useRef<number | null>(null);

  const handleScroll = (event: Event) => {
    if (requestId.current || isAutoScroll) {
      return;
    }

    const isBottom = getIsBottom(event);
    if (isBottom) {
      setIsShowButton(false);
    } else {
      setIsShowButton(true);
    }
  };

  const registerScrollElement = useCallback((node: HTMLElement | null) => {
    if (node) {
      scrollElement = node;

      scrollElement.addEventListener("scroll", handleScroll);

      const observer = new ResizeObserver(() => {
        scrollToBottom();
        observer.disconnect();
      });
      observer.observe(scrollElement);
    }

    return () => {
      scrollElement?.removeEventListener("scroll", handleScroll);
      scrollElement = null;
    };
  }, []);

  const registerObservedElement = useCallback((node: HTMLElement | null) => {
    let observer: ResizeObserver | null;
    if (node) {
      observer = new ResizeObserver(() => {
        if (isAutoScroll) {
          scrollToBottom();
        }
      });
      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
    };
  }, []);

  const cancelAnimation = () => {
    if (requestId.current) {
      cancelAnimationFrame(requestId.current);
      requestId.current = null;
    }
  };

  const smoothScrollToBottom = () => {
    if (!scrollElement) {
      return;
    }

    cancelAnimation();

    const start = scrollElement.scrollTop;
    const distance = scrollElement.scrollHeight - start;
    const duration = distance / 15;

    const startTime = performance.now();

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    const scrollStep = (timestamp: DOMHighResTimeStamp) => {
      const elapsedTime = timestamp - startTime;

      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutCubic(progress);
      scrollElement?.scrollTo(0, start + distance * easedProgress);

      if (progress < 1) {
        requestId.current = requestAnimationFrame(scrollStep);
      } else {
        requestId.current = null;
      }
    };

    scrollElement.addEventListener("wheel", cancelAnimation, { once: true });
    scrollElement.addEventListener("touchstart", cancelAnimation, { once: true });
    scrollElement.addEventListener(
      "mousedown",
      (event) => {
        if (event.button === 1) {
          cancelAnimation();
        }
      },
      { once: true },
    );

    requestId.current = requestAnimationFrame(scrollStep);
    setIsShowButton(false);
  };

  return [registerScrollElement, registerObservedElement, isShowButton, smoothScrollToBottom];
};
