import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../socket/useSocket";
import { chatKeys } from "@/utils/chatKeys";
import { chatService } from "@/apis/chat/chatService";
import { useEffect } from "react";

export const useConversationMessages = (userId, enabled = true) => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useInfiniteQuery({
    queryKey: chatKeys.messages(userId),
    queryFn: ({ pageParam = 1 }) =>
      chatService.getConversationMessages(userId, pageParam, 50),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.data.pagination;
      return page < pages ? page + 1 : undefined;
    },
    enabled: !!userId && enabled,
    staleTime: 60000,
  });

  // Real-time message updates
  useEffect(() => {
    if (!socket || !userId) return;

    const handleNewMessage = (data) => {
      const { message, sender } = data;

      // Only update if message is for this conversation
      if (message.senderId._id === userId || message.receiverId === userId) {
        queryClient.setQueryData(chatKeys.messages(userId), (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];
          const updatedMessages = [message, ...firstPage.data.messages];

          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                data: {
                  ...firstPage.data,
                  messages: updatedMessages,
                },
              },
              ...oldData.pages.slice(1),
            ],
          };
        });
      }
    };

    const handleMessageEdited = (data) => {
      const { messageId, newText, editedAt } = data;

      queryClient.setQueryData(chatKeys.messages(userId), (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              messages: page.data.messages.map((msg) =>
                msg._id === messageId
                  ? { ...msg, text: newText, edited: true, editedAt }
                  : msg
              ),
            },
          })),
        };
      });
    };

    const handleMessageDeleted = (data) => {
      const { messageId } = data;

      queryClient.setQueryData(chatKeys.messages(userId), (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              messages: page.data.messages.filter(
                (msg) => msg._id !== messageId
              ),
            },
          })),
        };
      });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageEdited', handleMessageEdited);
    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageEdited', handleMessageEdited);
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [socket, userId, queryClient]);

  return query;
};
