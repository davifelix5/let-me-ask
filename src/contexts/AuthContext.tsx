import { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firebase } from '../services/firebase';

type AuthContextProviderProps = {
  children: ReactNode;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle(): Promise<void>;
}

type User = {
  id: string;
  name: string;
  avatar: string;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        identifyUser(user);
      }
    })
    return () => {
      unsubscribe();
    }
  }, []);

  function identifyUser(user: firebase.User) {
    const { displayName, photoURL, uid } = user;
  
    if (!displayName || !photoURL) {
      return alert('Faltam informações a conta google!');
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL,
    });
  }

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const res = await auth.signInWithPopup(provider)
      
      if (res.user) {
        identifyUser(res.user)
      }

    } catch (err) {
      alert('Erro ao fazer loing')
    }
  }

  return (
    <AuthContext.Provider value={{user, signInWithGoogle}}>
      {children}
    </AuthContext.Provider>
  );
}