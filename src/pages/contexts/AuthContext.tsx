import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const createUserIfNotExists = async (user: { uid: string; email: string }) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      role: user.email === "shravanchaudhari99@gmail.com" ? "admin" : "user", // 🎯 bootstrap admin
    });
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Firebase is properly configured
    if (!auth) {
      setLoading(false);
      setIsFirebaseConfigured(false);
      return;
    }

    setIsFirebaseConfigured(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      console.warn(
        "Firebase not configured. Please add your Firebase configuration to .env.local"
      );
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      if (userCredential.user) {
        const { uid, email } = userCredential.user;
        if (uid && email) {
          await createUserIfNotExists({ uid, email });
          console.log("user data created successfully");
        }
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
      console.warn(
        "Firebase not configured. Please add your Firebase configuration to .env.local"
      );
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("error logging out");
    }
  };
  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
