import { format } from "date-fns";
import { client } from "@/lib/orpc/client";

/** Download a conversation as a plain-text file. */
export async function exportThread(threadId: string) {
  const thread = await client.history.messages({ threadId });

  const header = [
    thread.title,
    `Exported ${format(new Date(), "yyyy-MM-dd HH:mm")}`,
    "─".repeat(40),
    "",
  ].join("\n");

  const body = thread.messages
    .map(
      (m) =>
        `[${format(new Date(m.createdAt), "yyyy-MM-dd HH:mm")}] ${
          m.role === "user" ? "You" : "Forgy"
        }:\n${m.text}`,
    )
    .join("\n\n");

  const blob = new Blob([`${header}\n${body}\n`], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${
    thread.title
      .replace(/[^\w\- ]/g, "")
      .trim()
      .slice(0, 40) || "chat"
  }.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
