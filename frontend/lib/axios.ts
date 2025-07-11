import axios from "axios";
import { getAuthState } from "@/stores/authStore";
import { auth } from "./firebase";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

instance.interceptors.request.use(async (config) => {
  const user = getAuthState().user;
  if (user) {
    const token = await auth.currentUser?.getIdToken();
    if (token && config.headers){
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
