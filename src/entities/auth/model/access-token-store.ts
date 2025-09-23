import { create } from "zustand";
import { registerAccessTokenProvider } from "@/shared/api/access-token-provider";

interface AuthState {
  accessToken?: string;
  setAccessToken: (token?: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: undefined,
  setAccessToken: (token) => {
    set({ accessToken: token });
  },
  clear: () => set({ accessToken: undefined }),
}));

export const authStore = {
  getAccessToken(): string | undefined {
    return useAuthStore.getState().accessToken;
  },
  setAccessToken(token?: string) {
    useAuthStore.getState().setAccessToken(token);
  },
  clear() {
    useAuthStore.getState().clear();
  },
};

registerAccessTokenProvider(() => authStore.getAccessToken());
