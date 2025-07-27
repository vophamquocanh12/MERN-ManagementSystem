// src/components/shared/NotificationToaster.jsx
import { useSocket } from "../hooks/useSocket";

const NotificationToaster = () => {
  const { messages } = useSocket();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-2 shadow rounded"
        >
          {msg}
        </div>
      ))}
    </div>
  );
};

export default NotificationToaster;
