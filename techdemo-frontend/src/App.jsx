import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import ContactsPage from "./pages/ContactsPage";
import "./index.css";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user exists on app startup
  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/profiles/user");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    checkUserProfile();
  }, []);

  if (!isInitialized) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <ThemeProvider>
      <div className="app">
        <div className="iphone-status-bar">
          {/* Mobile status bar icons could go here */}
        </div>
        <div className="app-content">
          <Router>
            <Routes>
              <Route
                path="/"
                element={<HomePage user={user} setUser={setUser} />}
              />
              <Route path="/chat/:chatId" element={<ChatPage user={user} />} />
              <Route
                path="/settings"
                element={<SettingsPage user={user} setUser={setUser} />}
              />
              <Route path="/contacts" element={<ContactsPage user={user} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
