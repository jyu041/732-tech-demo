import { useState, useEffect } from "react";
import { WifiOutlined } from "@ant-design/icons";

const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState("");

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="iphone-status-bar">
      <div className="status-time">{currentTime}</div>
      <div className="status-icons">
        <div className="status-signal">
          {/* Custom signal bars - no direct Ant Design equivalent */}
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 0H15C14.4477 0 14 0.447715 14 1V11C14 11.5523 14.4477 12 15 12H16C16.5523 12 17 11.5523 17 11V1C17 0.447715 16.5523 0 16 0Z"
              fill="currentColor"
            />
            <path
              d="M12 3H11C10.4477 3 10 3.44772 10 4V11C10 11.5523 10.4477 12 11 12H12C12.5523 12 13 11.5523 13 11V4C13 3.44772 12.5523 3 12 3Z"
              fill="currentColor"
            />
            <path
              d="M8 6H7C6.44772 6 6 6.44772 6 7V11C6 11.5523 6.44772 12 7 12H8C8.5523 12 9 11.5523 9 11V7C9 6.44772 8.5523 6 8 6Z"
              fill="currentColor"
            />
            <path
              d="M4 8H3C2.44772 8 2 8.44772 2 9V11C2 11.5523 2.44772 12 3 12H4C4.5523 12 5 11.5523 5 11V9C5 8.44772 4.5523 8 4 8Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="status-wifi">
          <WifiOutlined />
        </div>
        <div className="status-battery">
          <svg
            width="25"
            height="12"
            viewBox="0 0 25 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="21"
              height="11"
              rx="2.5"
              stroke="currentColor"
            />
            <rect
              x="2"
              y="2"
              width="18"
              height="8"
              rx="1.5"
              fill="currentColor"
            />
            <path
              d="M23 4V8C23.8047 7.66122 24.328 6.87313 24.328 6C24.328 5.12687 23.8047 4.33878 23 4Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
