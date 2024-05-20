import { create } from "zustand";

const useAuth = create((set) => ({
  authUser: JSON.parse(localStorage.getItem("cc-user")) || null,
  setAuthUser: (user) => set({ authUser: user }),
}));

export default useAuth;
