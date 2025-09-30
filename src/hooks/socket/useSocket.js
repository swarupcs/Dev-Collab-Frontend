// hooks/socket/useSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppStore } from '@/store';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const { getCurrentUser, getToken } = useAppStore();
  const user = getCurrentUser();
  const token = getToken();

  console.log("user", user);
  console.log("token", token);

  useEffect(() => {
    if (!user || !token) return;

    console.log('🔌 Initializing socket...');

    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL1 || 'http://localhost:8080',
      {
        auth: { token },
        transports: ['websocket'],
      }
    );

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);

      // Register user on connect
      newSocket.emit('register', user._id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    // Save socket in state
    setSocket(newSocket);

    // Cleanup if user logs out / component unmounts
    return () => {
      console.log('🔌 Closing socket...');
      newSocket.disconnect();
    };
  }, [user?._id, token]);

  return socket;
};
