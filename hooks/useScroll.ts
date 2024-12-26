import { useCallback, useState, useRef } from "react";

enum ScrollDirection {
  Up = "up",
  Down = "down",
}

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

let scrollTop = 0;
let scrollHeight = 0;
const getScrollDirection = (event: Event) => {
  const target = event.target as HTMLElement;
  const currentScrollTop = target.scrollTop;
  const currentScrollHeight = target.scrollHeight;
  let offset = 0;
  if (currentScrollHeight < scrollHeight) {
    const tolerance = 1;
    offset = scrollHeight - currentScrollHeight + tolerance;
  }
  const direction =
    currentScrollTop + offset >= scrollTop ? ScrollDirection.Down : ScrollDirection.Up;
  scrollTop = currentScrollTop;
  scrollHeight = currentScrollHeight;
  return direction;
};

const throttle = (callback: (event: Event) => void) => {
  let ticking = false;

  return (event: Event) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;
        callback(event);
      });
      ticking = true;
    }
  };
};

const handleScroll = throttle((event: Event) => {
  const direction = getScrollDirection(event);
  const isBottom = getIsBottom(event);
  if (direction === ScrollDirection.Up) {
    pauseAutoScroll();
  } else if (isBottom) {
    resumeAutoScroll();
  }
});

export const startAutoScroll = () => {
  scrollElement?.addEventListener("scroll", handleScroll);
  isAutoScroll = true;
};

export const endAutoScroll = () => {
  scrollElement?.removeEventListener("scroll", handleScroll);
  isAutoScroll = false;
};

const getIsBottom = (event: Event) => {
  const target = event.target as HTMLElement;
  const tolerance = 1;
  return target.clientHeight + target.scrollTop >= target.scrollHeight - tolerance;
};

export const useScroll: () => [
  (node: HTMLElement | null) => void,
  (node: HTMLElement | null) => void,
  boolean,
  () => void,
] = () => {
  const [isShowButton, setIsShowButton] = useState(false);
  const requestId = useRef<number | null>(null);

  const registerScrollElement = useCallback((node: HTMLElement | null) => {
    const handleScroll = throttle((event: Event) => {
      if (requestId.current || isAutoScroll) {
        return;
      }

      const isBottom = getIsBottom(event);
      if (isBottom) {
        setIsShowButton(false);
      } else {
        setIsShowButton(true);
      }
    });
    if (node) {
      scrollElement = node;
      scrollTop = scrollElement.scrollTop;
      scrollHeight = scrollElement.scrollHeight;

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

    const controller = new AbortController();
    const scrollStep = (timestamp: DOMHighResTimeStamp) => {
      const elapsedTime = timestamp - startTime;

      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutCubic(progress);
      scrollElement?.scrollTo(0, start + distance * easedProgress);

      if (progress < 1) {
        requestId.current = requestAnimationFrame(scrollStep);
      } else {
        requestId.current = null;
        controller.abort();
      }
    };

    const stopScroll = () => {
      cancelAnimation();
      controller.abort();
    };
    const signal = controller.signal;
    scrollElement.addEventListener(
      "wheel",
      (event) => {
        if (!event.shiftKey && !event.ctrlKey) {
          stopScroll();
        }
      },
      { signal },
    );
    scrollElement.addEventListener(
      "mousedown",
      (event) => {
        if (event.button === 1) {
          stopScroll();
        }
      },
      { signal },
    );
    scrollElement.addEventListener("touchstart", stopScroll, { signal });

    requestId.current = requestAnimationFrame(scrollStep);
    setIsShowButton(false);
  };

  return [registerScrollElement, registerObservedElement, isShowButton, smoothScrollToBottom];
};
