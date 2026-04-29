
import { getCurrentUser } from "@/services/auth";
import { CurrentUser } from "@/types/currentUser.type";
import { useEffect, useState } from "react";

export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  return user;
};