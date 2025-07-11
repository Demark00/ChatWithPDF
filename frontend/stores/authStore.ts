import { create } from "zustand";
import { AuthStore } from "@/types/auth-types";
import { auth, googleProvider } from "../lib/firebase";
import Cookies from "js-cookie";
import {
  Auth,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken,
  signInWithPopup,
} from "firebase/auth";
import toast from "react-hot-toast";

// Ensure we only register onAuthStateChanged once
let isInitialized = false;

export const useAuthStore = create<AuthStore>((set) => {
  if (!isInitialized) {
    isInitialized = true;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        Cookies.set("token", token, { path: "/", expires: 1 / 24 }); // 1 hour
        set({ user: { uid: user.uid, email: user.email ?? "" } });
      } else {
        set({ user: null });
        Cookies.remove("token");
      }
    });
  }

  return {
    user: null,
    loading: false,

    setUser: (user) => set({ user }),

    signup: async (email, password) => {
      set({ loading: true });
      try {
        const res = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(res.user);
        Cookies.set("token", token, { path: "/", expires: 1 / 24 }); // 1 hour
        set({ user: { uid: res.user.uid, email: res.user.email ?? "" } });
        toast.success("Signup successful");
      } catch (err: any) {
        console.error("❌ Signup error:", err);
        toast.error("Signup failed, Try Again!");
      } finally {
        set({ loading: false });
      }
    },

    login: async (email, password) => {
      set({ loading: true });
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(res.user);
        Cookies.set("token", token, { path: "/", expires: 1 / 24 }); // 1 hour
        set({ user: { uid: res.user.uid, email: res.user.email ?? "" } });
        toast.success("Login successful");
      } catch (err: any) {
        console.error("❌ Login error:", err);
        toast.error("Login failed. Check your credentials.");
      } finally {
        set({ loading: false });
      }
    },

    signInWithGoogle: async () => {
      set({ loading: true });
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        if (user) {
          const token = await getIdToken(user);
          Cookies.set("token", token, { path: "/", expires: 1 / 24 }); // 1 hour

          set({
            user: { uid: user.uid, email: user.email ?? "" },
          });

          toast.success("Signed in with Google");
        }
      } catch (err: any) {
        console.error("❌ Google Sign-In Error:", err);
        toast.error("Google sign-in failed. Try again.");
      } finally {
        set({ loading: false });
      }
    },


    logout: async () => {
      try {
        await signOut(auth);
        set({ user: null });
        Cookies.remove("token");
        toast.success("Logged out successfully");
      } catch (err: any) {
        console.error("❌ Logout error:", err);
        toast.error(err.message || "Logout failed");
      }
    },
  };
});

// Helper to support named import style if needed
function createUserWithEmailAndPassword(auth: Auth, email: string, password: string) {
  return firebaseCreateUserWithEmailAndPassword(auth, email, password);
}

export const getAuthState = useAuthStore.getState;
