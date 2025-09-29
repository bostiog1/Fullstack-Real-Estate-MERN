import { useNotificationStore } from "../../lib/notificationStore";
import { useEffect } from "react";
import "./notificationBadge.scss";

function NotificationBadge() {
  const { number, fetch } = useNotificationStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (number === 0) return null;

  return (
    <div className="notification-badge">{number > 99 ? "99+" : number}</div>
  );
}

export default NotificationBadge;
