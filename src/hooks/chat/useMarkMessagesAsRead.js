import { chatService } from "@/apis/chat/chatService";
import { chatKeys } from "@/utils/chatKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to mark messages as read
 */
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (senderId) => chatService.markMessagesAsRead(senderId),
    onSuccess: (data, senderId) => {
      // Update messages query
      queryClient.setQueryData(chatKeys.messages(senderId), (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              messages: page.data.messages.map((msg) =>
                msg.senderId._id === senderId ? { ...msg, isRead: true } : msg
              ),
            },
          })),
        };
      });

      // Update chat list
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    },
  });
};
