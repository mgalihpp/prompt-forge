import type { UIMessage } from "ai";

export function collectText(message: UIMessage, kind: "text" | "reasoning") {
  return message.parts
    .map((part) => {
      if (part.type === "text" && kind === "text") return part.text;
      if (part.type === "reasoning" && kind === "reasoning") return part.text;
      return "";
    })
    .join("");
}
