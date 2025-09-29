import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);



  const { getCurrentUser, getToken } = useAppStore();

  const user = getCurrentUser();
  const token = getToken();

  useEffect(() => {
    if (!user || !token) return;

    // Initialize socket only once
    if (!socket) {
      socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
      // Only disconnect when user logs out
    };
  }, [user, token]);

  return socket;


}