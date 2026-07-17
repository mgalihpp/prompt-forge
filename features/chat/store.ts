import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultOptions } from "./constants";

// Messages/streaming now live in useChat (AI SDK). The store only holds the
// composer input + prompt options, which the route reads as request body.
type ChatState = {
  input: string;
  deepForge: boolean;
  opts: Record<string, string>;
  // Selected OpenRouter model id (free tier). null = server default.
  // Persisted to localStorage so the choice survives a refresh.
  model: string | null;
  // Persistence target. null = new conversation; the composer creates a
  // thread lazily on first send and every /api/chat call carries this id.
  threadId: string | null;
  setInput: (input: string) => void;
  setThreadId: (threadId: string | null) => void;
  setModel: (model: string | null) => void;
  setOption: (key: string, value: string) => void;
  setOptions: (opts: Record<string, string>) => void;
  setDeepForge: (on: boolean) => void;
  toggleDeepForge: () => void;
  applyPreset: (p: {
    ore: string;
    opts: Record<string, string>;
    deepForge?: boolean;
  }) => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      input: "",
      deepForge: false,
      opts: defaultOptions(),
      model: null,
      threadId: null,

      setInput: (input) => set({ input }),
      setThreadId: (threadId) => set({ threadId }),
      setModel: (model) => set({ model }),
      setOption: (key, value) =>
        set((s) => ({ opts: { ...s.opts, [key]: value } })),
      setOptions: (opts) => set((s) => ({ opts: { ...s.opts, ...opts } })),
      setDeepForge: (on) => set({ deepForge: on }),
      toggleDeepForge: () => set((s) => ({ deepForge: !s.deepForge })),
      applyPreset: (p) =>
        set((s) => ({
          input: p.ore,
          opts: { ...s.opts, ...p.opts },
          deepForge: p.deepForge ?? s.deepForge,
        })),
    }),
    {
      name: "prompt-forge-composer",
      // Only the durable model preference is persisted. Input, threadId, and
      // per-message toggles are ephemeral and would be confusing to restore.
      partialize: (s) => ({ model: s.model }),
    },
  ),
);
