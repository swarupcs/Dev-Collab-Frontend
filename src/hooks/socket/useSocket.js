// hooks/socket/useSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppStore } from '@/store';

// ✅ Singleton socket instance outside component
let socketInstance = null;

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { getCurrentUser, getToken } = useAppStore();
  const user = getCurrentUser();
  const token = getToken();

  useEffect(() => {
    console.log('🔍 useSocket - user:', user?._id);
    console.log('🔍 useSocket - token:', token ? 'exists' : 'missing');

    // If no user/token, cleanup and return
    if (!user || !token) {
      console.log('⚠️ No user or token, cleaning up socket');
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
      setSocket(null);
      return;
    }

    // If socket already exists and is connected, reuse it
    if (socketInstance?.connected) {
      console.log('♻️ Reusing existing socket:', socketInstance.id);
      setSocket(socketInstance);
      return;
    }

    // Create new socket only if it doesn't exist
    console.log('🔌 Creating new socket connection...');

    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL1 || 'http://localhost:8080',
      {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      newSocket.emit('register', user._id);
      setSocket(newSocket);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setSocket(null);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
      setSocket(null);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      newSocket.emit('register', user._id);
      setSocket(newSocket);
    });

    socketInstance = newSocket;

    // Only set socket after it connects
    // Initial setSocket will happen in 'connect' event

    // Cleanup function
    return () => {
      // Only disconnect if user changes or component unmounts
      if (socketInstance) {
        console.log('🧹 Cleaning up socket');
        socketInstance.off('connect');
        socketInstance.off('disconnect');
        socketInstance.off('connect_error');
        socketInstance.off('reconnect');
      }
    };
  }, [user?._id, token]);

  // Log socket state changes
  useEffect(() => {
    console.log(
      '🔍 Socket state changed:',
      socket ? `connected (${socket.id})` : 'null'
    );
  }, [socket]);

  return socket;
};

// ✅ Export function to manually disconnect (call on logout)
export const disconnectSocket = () => {
  if (socketInstance) {
    console.log('🔌 Manually disconnecting socket...');
    socketInstance.disconnect();
    socketInstance = null;
  }
};
