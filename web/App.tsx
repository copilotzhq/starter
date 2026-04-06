import React, { useCallback, useEffect, useState } from "react";
import { ChatClient } from "./components/ChatClient.tsx";
import { LoginPage } from "./components/LoginPage.tsx";

const USER_ID_STORAGE_KEY = "copilotz-starter.userId";

type View = "login" | "chat";

const App: React.FC = () => {
  const [view, setView] = useState<View>("login");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handleLogin = useCallback(
    (handle: string, options?: { persist?: boolean }) => {
      const userId = handle.trim().replace(/^@/, "");
      if (!userId) {
        setLoginError("Enter a valid user ID.");
        return;
      }

      setIsLoginLoading(true);
      setLoginError(null);
      setCurrentUserId(userId);
      setView("chat");

      if (options?.persist !== false && typeof window !== "undefined") {
        localStorage.setItem(USER_ID_STORAGE_KEY, userId);
      }

      setIsLoginLoading(false);
    },
    [],
  );

  const handleLogout = useCallback(() => {
    setCurrentUserId(null);
    setView("login");
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_ID_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (stored) {
      handleLogin(stored, { persist: false });
    }
  }, [handleLogin]);

  if (view === "login" || !currentUserId) {
    return (
      <LoginPage
        onLogin={handleLogin}
        isLoading={isLoginLoading}
        error={loginError}
      />
    );
  }

  return <ChatClient userId={currentUserId} onLogout={handleLogout} />;
};

export default App;
