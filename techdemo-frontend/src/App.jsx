import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import ContactsPage from "./pages/ContactsPage";
import StatusBar from "./components/common/StatusBar";
import BottomNav from "./components/common/BottomNav";
import "./index.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/modals.css";

// Create a layout component that conditionally renders the bottom nav
const AppLayout = ({ user, setUser }) => {
  const location = useLocation();

  // Hide bottom nav when in chat pages
  const showBottomNav = !location.pathname.includes("/chat/");

  return (
    <>
      <StatusBar />
      <div className={`app-content ${!showBottomNav ? "no-bottom-nav" : ""}`}>
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
      </div>
      {showBottomNav && <BottomNav />}
    </>
  );
};

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
        <Router>
          <AppLayout user={user} setUser={setUser} />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
