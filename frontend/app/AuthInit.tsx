"use client";

import { useEffect } from "react";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/authStore";
import Cookies from "js-cookie";

const AuthInit = () => {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        Cookies.set("token", token, { path: "/", expires: 1 / 24 }); // 1 hour token
        setUser({ uid: user.uid, email: user.email ?? "" });
      } else {
        Cookies.remove("token");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return null; // no UI, this just runs the auth sync
};

export default AuthInit;
