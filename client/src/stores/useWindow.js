import { create } from "zustand";

const useWindow = create((set) => ({
  chatOpen: false,
  setChatOpen: (chatOpen) => set({ chatOpen }),
}));

export default useWindow;
