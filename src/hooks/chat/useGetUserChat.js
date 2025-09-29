import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSocket } from "../socket/useSocket";
import { chatKeys } from "@/utils/chatKeys";
import { chatService } from "@/apis/chat/chatService";
import { useEffect } from "react";

export const useGetUserChat = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const query = useQuery({
    queryKey: chatKeys.lists(),
    queryFn: chatService.getUserChats,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: false, // Don't poll, rely on real-time updates
  });

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    // When a new message arrives
    const handleNewMessage = (data) => {
      queryClient.setQueryData(chatKeys.lists(), (oldData) => {
        if (!oldData) return oldData;

        const { message, chatId, sender } = data;
        const chats = oldData.data.chats;

        // Find existing chat
        const existingChatIndex = chats.findIndex(
          (chat) => chat._id === chatId
        );

        if (existingChatIndex !== -1) {
          // Update existing chat
          const updatedChats = [...chats];
          const existingChat = updatedChats[existingChatIndex];

          updatedChats[existingChatIndex] = {
            ...existingChat,
            lastMessage: message,
            updatedAt: message.createdAt,
            unreadCount: existingChat.unreadCount + 1,
          };

          // Move to top
          const [movedChat] = updatedChats.splice(existingChatIndex, 1);
          updatedChats.unshift(movedChat);

          return {
            ...oldData,
            data: { chats: updatedChats },
          };
        } else {
          // New chat - refetch to get full chat data
          queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
          return oldData;
        }
      });

      // Update unread count
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    };

    // When messages are read
    const handleMessagesRead = (data) => {
      queryClient.setQueryData(chatKeys.lists(), (oldData) => {
        if (!oldData) return oldData;

        const { readBy } = data;
        const chats = oldData.data.chats;

        const updatedChats = chats.map((chat) => {
          if (chat.otherParticipant?._id === readBy) {
            return { ...chat, unreadCount: 0 };
          }
          return chat;
        });

        return {
          ...oldData,
          data: { chats: updatedChats },
        };
      });
    };

    // When message is deleted
    const handleMessageDeleted = (data) => {
      const { messageId } = data;

      queryClient.setQueryData(chatKeys.lists(), (oldData) => {
        if (!oldData) return oldData;

        const chats = oldData.data.chats;
        const updatedChats = chats.map((chat) => {
          if (chat.lastMessage?._id === messageId) {
            return {
              ...chat,
              lastMessage: { ...chat.lastMessage, text: 'Message deleted' },
            };
          }
          return chat;
        });

        return {
          ...oldData,
          data: { chats: updatedChats },
        };
      });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [socket, queryClient]);
}