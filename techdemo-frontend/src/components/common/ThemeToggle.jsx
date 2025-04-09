import { useContext } from "react";
import { ThemeContext, THEMES } from "../../context/ThemeContext";

/**
 * Component for toggling between different app themes
 */
const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  // Theme options with display names
  const themeOptions = [
    { value: THEMES.INSTAGRAM, label: "Instagram" },
    { value: THEMES.DISCORD, label: "Discord" },
    { value: THEMES.WECHAT, label: "WeChat" },
  ];

  return (
    <div className="theme-toggle">
      <h3>App Theme</h3>
      <div className="theme-options">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            className={`btn ${
              theme === option.value ? "btn-primary" : "btn-secondary"
            } theme-btn`}
            onClick={() => setTheme(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
