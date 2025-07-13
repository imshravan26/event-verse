import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const useUserRole = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setRole(data.role);
      } else {
        setRole("user"); // default fallback
      }
      setLoading(false);
    };

    if (!loadingAuth) {
      fetchRole();
    }
  }, [user, loadingAuth]);

  return { role, loading, user };
};
