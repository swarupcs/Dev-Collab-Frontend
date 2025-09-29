import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../socket/useSocket";
import { chatKeys } from "@/utils/chatKeys";
import { chatService } from "@/apis/chat/chatService";
import { useEffect } from "react";

/**
 * Hook to get unread message count
 */
export const useUnreadCount = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: chatKeys.unreadCount(),
    queryFn: chatService.getUnreadCount,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    };

    const handleMessagesRead = () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, queryClient]);

  return query;
};
