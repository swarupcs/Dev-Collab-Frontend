import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../socket/useSocket';
import { chatKeys } from '@/utils/chatKeys';
import { chatService } from '@/apis/chat/chatService';
import { useEffect } from 'react';

export const useGetUserChat = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: chatKeys.lists(),
    queryFn: chatService.getUserChat,
    staleTime: 30000,
    refetchOnWindowFocus: true,
    refetchInterval: false,
  });

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    // 🔹 Handle incoming messages
    const handleReceiveMessage = (data) => {
      queryClient.setQueryData(chatKeys.lists(), (oldData) => {
        if (!oldData) return oldData;

        const { chatId, text, createdAt, _id } = data;
        const chats = oldData.data.chats || [];

        const existingChatIndex = chats.findIndex(
          (chat) => chat._id === chatId
        );

        if (existingChatIndex !== -1) {
          const updatedChats = [...chats];
          const existingChat = updatedChats[existingChatIndex];

          updatedChats[existingChatIndex] = {
            ...existingChat,
            lastMessage: { _id, text, createdAt },
            lastActivity: createdAt,
            unreadCount: (existingChat.unreadCount || 0) + 1,
          };

          // Move updated chat to top
          const [moved] = updatedChats.splice(existingChatIndex, 1);
          updatedChats.unshift(moved);

          return { ...oldData, data: { chats: updatedChats } };
        } else {
          // Unknown chat → refetch
          queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
          return oldData;
        }
      });

      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    };

    // 🔹 Handle read receipts
    const handleMessagesRead = ({ chatId }) => {
      queryClient.setQueryData(chatKeys.lists(), (oldData) => {
        if (!oldData) return oldData;
        const chats = oldData.data.chats || [];

        const updatedChats = chats.map((chat) =>
          chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
        );

        return { ...oldData, data: { chats: updatedChats } };
      });
    };

    // 🔹 Handle deleted messages
    const handleMessageDeleted = ({ chatId, messageId }) => {
      queryClient.setQueryData(chatKeys.lists(), (oldData) => {
        if (!oldData) return oldData;
        const chats = oldData.data.chats || [];

        const updatedChats = chats.map((chat) => {
          if (chat._id === chatId && chat.lastMessage?._id === messageId) {
            return {
              ...chat,
              lastMessage: { ...chat.lastMessage, text: 'Message deleted' },
            };
          }
          return chat;
        });

        return { ...oldData, data: { chats: updatedChats } };
      });
    };

    // ✅ Align with backend event names
    socket.on('receive_message', handleReceiveMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('message_deleted', handleMessageDeleted);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('message_deleted', handleMessageDeleted);
    };
  }, [socket, queryClient]);

  return query;
};
