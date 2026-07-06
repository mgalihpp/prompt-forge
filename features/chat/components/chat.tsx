"use client"

import { MessageList } from "./message-list"
import { Composer } from "./composer"

// Static shell — no state here, so it never re-renders. Each child
// subscribes to its own slice of the zustand store.
export function Chat() {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
      <MessageList />
      <Composer />
    </div>
  )
}
