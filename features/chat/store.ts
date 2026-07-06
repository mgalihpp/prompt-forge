import { create } from "zustand"
import { defaultOptions, type Msg } from "./constants"

type ChatState = {
  messages: Msg[]
  input: string
  deepForge: boolean
  opts: Record<string, string>
  setInput: (input: string) => void
  setOption: (key: string, value: string) => void
  toggleDeepForge: () => void
  send: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  input: "",
  deepForge: false,
  opts: defaultOptions(),

  setInput: (input) => set({ input }),
  setOption: (key, value) =>
    set((s) => ({ opts: { ...s.opts, [key]: value } })),
  toggleDeepForge: () => set((s) => ({ deepForge: !s.deepForge })),

  send: () => {
    const { input, messages } = get()
    const text = input.trim()
    if (!text) return
    const id = messages.length
    // ponytail: fake assistant echo — swap for oRPC stream when backend lands
    set({
      messages: [
        ...messages,
        { id, role: "user", text },
        { id: id + 1, role: "assistant", text: `Enhanced: ${text}` },
      ],
      input: "",
    })
  },
}))
