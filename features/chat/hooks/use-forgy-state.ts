import { useEffect, useRef, useState } from "react";
import type { ForgyState } from "../components/forgy";

/**
 * Maps the AI SDK chat status onto Forgy's expressions.
 *
 * `submitted` (request sent, no tokens yet) = thinking; `streaming` = busy at
 * the anvil; a finished turn flashes success for ~1.6s before settling back to
 * idle. Any error takes precedence.
 */
export function useForgyState(status: string, hasError: boolean): ForgyState {
  const [flashSuccess, setFlashSuccess] = useState(false);
  const prev = useRef(status);

  useEffect(() => {
    const wasActive =
      prev.current === "submitted" || prev.current === "streaming";
    prev.current = status;
    if (wasActive && status === "ready") {
      setFlashSuccess(true);
      const t = setTimeout(() => setFlashSuccess(false), 1600);
      return () => clearTimeout(t);
    }
  }, [status]);

  if (hasError || status === "error") return "error";
  if (status === "streaming") return "busy";
  if (status === "submitted") return "thinking";
  if (flashSuccess) return "success";
  return "idle";
}
