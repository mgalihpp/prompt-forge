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
 * Scroll-aware edge fade for a scroll container.
 *
 * Returns `scrollRef` for the scrollable element, `contentRef` for its inner
 * content wrapper, an `onScroll` handler, and a `maskStyle` that softly
 * dissolves the top/bottom edge — but only while there is still content hidden
 * past that edge, so a hard clip never looks abrupt and a fully-scrolled edge
 * stays crisp.
 *
 * A `ResizeObserver` on both elements re-measures the edges when content
 * changes height without firing a scroll event (new messages, streaming
 * growth, viewport resize).
 */
export function useScrollFade() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setEdges({
      top: scrollTop > EDGE_THRESHOLD,
      bottom: scrollTop + clientHeight < scrollHeight - EDGE_THRESHOLD,
    });
  }, []);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const observer = new ResizeObserver(onScroll);
    observer.observe(scroller);
    if (contentRef.current) observer.observe(contentRef.current);
    onScroll();
    return () => observer.disconnect();
  }, [onScroll]);

  const start = edges.top ? "transparent" : "black";
  const end = edges.bottom ? "transparent" : "black";
  const mask = `linear-gradient(to bottom, ${start} 0, black ${FADE_LENGTH}, black calc(100% - ${FADE_LENGTH}), ${end} 100%)`;

  const maskStyle: CSSProperties = { maskImage: mask, WebkitMaskImage: mask };

  return { scrollRef, contentRef, onScroll, maskStyle };
}
