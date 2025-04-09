import { createContext, useState, useEffect } from "react";

// Available themes
export const THEMES = {
  INSTAGRAM: "instagram",
  DISCORD: "discord",
  WECHAT: "wechat",
};

// Create theme context
export const ThemeContext = createContext({
  theme: THEMES.INSTAGRAM,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or use default
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || THEMES.INSTAGRAM;
  });

  // Load theme CSS
  useEffect(() => {
    // Save theme preference
    localStorage.setItem("theme", theme);

    // Apply theme class to body
    document.body.className = `theme-${theme}`;

    // Set theme variables dynamically instead of loading external stylesheets
    const existingStyle = document.getElementById("theme-variables");
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement("style");
    style.id = "theme-variables";

    // Add the appropriate CSS variables based on theme
    if (theme === THEMES.INSTAGRAM) {
      document.head.appendChild(style);
      import("../assets/themes/instagram.css");
    } else if (theme === THEMES.DISCORD) {
      document.head.appendChild(style);
      import("../assets/themes/discord.css");
    } else if (theme === THEMES.WECHAT) {
      document.head.appendChild(style);
      import("../assets/themes/wechat.css");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
