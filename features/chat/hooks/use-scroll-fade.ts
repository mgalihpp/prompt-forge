import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// How much of each edge dissolves, and how close to an edge counts as "resting"
// against it (avoids a flicker from sub-pixel scroll offsets).
const FADE_LENGTH = "3.5rem";
const EDGE_THRESHOLD = 8;

/**
 * Find the nearest scrollable ancestor (overflow-y auto/scroll).
 */
function findScrollParent(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement;
  while (node) {
    const style = getComputedStyle(node);
    const overflowY = style.overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * Scroll-aware edge fade for a scroll container.
 *
 * Returns `scrollRef` for the element whose edges should fade, `contentRef`
 * for its inner content wrapper, an `onScroll` handler, and a `maskStyle`
 * that softly dissolves the top/bottom edge — but only while there is still
 * content hidden past that edge, so a hard clip never looks abrupt and a
 * fully-scrolled edge stays crisp.
 *
 * Detects the nearest scrollable ancestor automatically, so the scroll
 * container can live outside this component (e.g. a parent chat wrapper).
 */
export function useScrollFade() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scroller = findScrollParent(el) ?? el;
    const { scrollTop, scrollHeight, clientHeight } = scroller;
    setEdges({
      top: scrollTop > EDGE_THRESHOLD,
      bottom: scrollTop + clientHeight < scrollHeight - EDGE_THRESHOLD,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scroller = findScrollParent(el) ?? el;
    const observer = new ResizeObserver(onScroll);
    observer.observe(scroller);
    if (contentRef.current) observer.observe(contentRef.current);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  const start = edges.top ? "transparent" : "black";
  const end = edges.bottom ? "transparent" : "black";
  const mask = `linear-gradient(to bottom, ${start} 0, black ${FADE_LENGTH}, black calc(100% - ${FADE_LENGTH}), ${end} 100%)`;

  const maskStyle: CSSProperties = { maskImage: mask, WebkitMaskImage: mask };

  return { scrollRef, contentRef, onScroll, maskStyle };
}
