import { useState, useEffect } from "react";

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
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z"
              fill="currentColor"
            />
            <path
              d="M13.3 6.3C13.7 6.7 13.7 7.3 13.3 7.7C11.4 9.6 9.7 10.5 8 10.5C6.3 10.5 4.6 9.6 2.7 7.7C2.3 7.3 2.3 6.7 2.7 6.3C3.1 5.9 3.7 5.9 4.1 6.3C5.5 7.7 6.7 8.5 8 8.5C9.3 8.5 10.5 7.7 11.9 6.3C12.3 5.9 12.9 5.9 13.3 6.3Z"
              fill="currentColor"
            />
            <path
              d="M0.5 4.1C0.1 3.7 0.1 3.1 0.5 2.7C4.3 -1.1 11.7 -1.1 15.5 2.7C15.9 3.1 15.9 3.7 15.5 4.1C15.1 4.5 14.5 4.5 14.1 4.1C11.1 1.1 4.9 1.1 1.9 4.1C1.5 4.5 0.9 4.5 0.5 4.1Z"
              fill="currentColor"
            />
          </svg>
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
