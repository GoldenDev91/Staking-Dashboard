import { useEffect } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const Notification = ({ data }) => {
  useEffect(() => {
    if (!data) return;
    switch (data.type) {
      case "info":
        NotificationManager.info("Info message");
        break;
      case "success":
        NotificationManager.success(data.detail, data.title);
        break;
      case "warning":
        NotificationManager.warning(
          "Warning message",
          "Close after 3000ms",
          3000
        );
        break;
      case "error":
        NotificationManager.error(data.detail, data.title);
        break;
      default:
        break;
    }
  }, [data]);
  return <NotificationContainer />;
};

export default Notification;
