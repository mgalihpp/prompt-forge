import { create } from "zustand";
import { defaultOptions } from "./constants";

// Messages/streaming now live in useChat (AI SDK). The store only holds the
// composer input + prompt options, which the route reads as request body.
type ChatState = {
  input: string;
  deepForge: boolean;
  opts: Record<string, string>;
  setInput: (input: string) => void;
  setOption: (key: string, value: string) => void;
  toggleDeepForge: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  input: "",
  deepForge: false,
  opts: defaultOptions(),

  setInput: (input) => set({ input }),
  setOption: (key, value) =>
    set((s) => ({ opts: { ...s.opts, [key]: value } })),
  toggleDeepForge: () => set((s) => ({ deepForge: !s.deepForge })),
}));
