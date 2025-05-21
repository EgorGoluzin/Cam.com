import { create } from "zustand";

type UseAppStoreType = {
  section: "search" | "generate";
  query: string;
  setSection: (section: UseAppStoreType["section"]) => void;
  setQuery: (query: string) => void;
};

export const useAppStore = create<UseAppStoreType>((set) => ({
  query: "",
  section: "search",
  setSection: (section) => set({ section }),
  setQuery: (query) => set({ query }),
}));
