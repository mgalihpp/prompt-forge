import { create } from "zustand";

/**
 * Controls the "Upgrade to Pro" dialog shown when a free user runs out of
 * their daily prompt quota. Triggered from the composer (pre-send check) and
 * the message list (server 429 fallback).
 */
type UpgradeDialogState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useUpgradeDialog = create<UpgradeDialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
