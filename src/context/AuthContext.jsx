import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate 16 digit hex token (8 bytes = 16 hex characters)
  const generateToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const loginUser = async (userData) => {
    const token = generateToken();
    const expiresAt = Date.now() + 5 * 24 * 60 * 60 * 1000; // 5 days

    // Store token in DB
    const userRef = doc(db, 'users', userData.user_id.toString());
    await updateDoc(userRef, { token });

    // Store globally & locally
    setUser(userData);
    localStorage.setItem('auth_token', JSON.stringify({ token, expiresAt, user_id: userData.user_id }));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    // We intentionally do not wipe the token from the DB here so other devices 
    // are not logged out, just this local persistent session is cleared.
  };

  useEffect(() => {
    const verifyToken = async () => {
      const stored = localStorage.getItem('auth_token');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const { token, expiresAt, user_id } = JSON.parse(stored);
        
        // Check 5 day TTL
        if (Date.now() > expiresAt) {
          logoutUser();
          setLoading(false);
          return;
        }

        // Token is not expired, verify with DB
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('user_id', '==', user_id), where('token', '==', token));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUser(userData);
          
          // Extend TTL for another 5 days of inactivity (Activity slide)
          const newExpiresAt = Date.now() + 5 * 24 * 60 * 60 * 1000;
          localStorage.setItem('auth_token', JSON.stringify({ token, expiresAt: newExpiresAt, user_id }));
        } else {
          // Token invalid or wiped in DB
          logoutUser();
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        logoutUser();
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
