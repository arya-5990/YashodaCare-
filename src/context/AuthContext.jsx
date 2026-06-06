import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

// Helper to parse JWT claims client-side
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Maps user fields for backward compatibility between PostgreSQL camelCase and Firestore snake_case
function mapUserCompat(userData) {
  if (!userData) return null;
  return {
    ...userData,
    user_id: userData.id,
    plan_id: userData.planId || userData.plan_id,
    plan_title: userData.planTitle || userData.plan_title,
    plan_purchased_at: userData.planPurchasedAt || userData.plan_purchased_at,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  const loginUser = async (authData) => {
    // Save tokens in localStorage
    localStorage.setItem(
      'auth_tokens',
      JSON.stringify({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      })
    );
    // Set user data with compatibility mapping
    setUser(mapUserCompat(authData.user));
  };

  const logoutUser = async () => {
    setUser(null);
    const stored = localStorage.getItem('auth_tokens');
    localStorage.removeItem('auth_tokens');

    if (stored) {
      try {
        const { refreshToken } = JSON.parse(stored);
        // Call logout function on server to revoke/delete the session
        await fetch(`${FUNCTIONS_URL}/auth-logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (err) {
        console.error('Error calling logout function:', err);
      }
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const stored = localStorage.getItem('auth_tokens');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        let { accessToken, refreshToken } = JSON.parse(stored);
        const decoded = parseJwt(accessToken);

        if (!decoded) {
          logoutUser();
          setLoading(false);
          return;
        }

        // Check if access token is expired or expiring in the next 10 seconds
        const isExpired = decoded.exp * 1000 < Date.now() + 10000;

        if (isExpired) {
          // Attempt token refresh via Edge Function
          const refreshRes = await fetch(`${FUNCTIONS_URL}/auth-refresh`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            accessToken = refreshData.accessToken;
            refreshToken = refreshData.refreshToken;

            localStorage.setItem(
              'auth_tokens',
              JSON.stringify({ accessToken, refreshToken })
            );
          } else {
            // Refresh token invalid or expired
            logoutUser();
            setLoading(false);
            return;
          }
        }

        // Token is valid (or has been refreshed). Fetch user details from Postgres.
        const userId = decoded.sub; // user ID stored in sub claim
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userData && !error) {
          setUser(mapUserCompat(userData));
        } else {
          console.error('User not found or error loading registry:', error);
          logoutUser();
        }
      } catch (err) {
        console.error('Error verifying custom tokens:', err);
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

