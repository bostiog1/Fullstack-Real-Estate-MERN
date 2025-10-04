import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { useNotificationStore } from "./notificationStore";

export const useGlobalNotifications = () => {
  const { socket } = useContext(SocketContext);
  const { currentUser } = useContext(AuthContext);
  const increase = useNotificationStore((state) => state.increase);
  const fetch = useNotificationStore((state) => state.fetch);

  useEffect(() => {
    if (currentUser) {
      fetch();
    }
  }, [currentUser, fetch]);

  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleGlobalMessage = (data) => {
      // Doar crește notificarea când primești mesaj
      increase();
    };

    socket.on("getMessage", handleGlobalMessage);

    return () => {
      socket.off("getMessage", handleGlobalMessage);
    };
  }, [socket, currentUser, increase]);
};
