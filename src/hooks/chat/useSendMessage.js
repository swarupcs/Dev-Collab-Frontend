import { chatService } from "@/apis/chat/chatService";
import { chatKeys } from "@/utils/chatKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to send a message with optimistic updates
 */
export const useSendMessage = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ receiverId, text, messageType }) =>
      chatService.sendMessage(receiverId, text, messageType),

    // Optimistic update
    onMutate: async ({ text }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(userId) });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(
        chatKeys.messages(userId)
      );

      // Optimistically update
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        text,
        senderId: { _id: 'current-user' }, // Will be replaced
        createdAt: new Date().toISOString(),
        isRead: false,
        isOptimistic: true,
      };

      queryClient.setQueryData(chatKeys.messages(userId), (old) => {
        if (!old) return old;

        const firstPage = old.pages[0];
        return {
          ...old,
          pages: [
            {
              ...firstPage,
              data: {
                ...firstPage.data,
                messages: [tempMessage, ...firstPage.data.messages],
              },
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousMessages };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(userId),
          context.previousMessages
        );
      }
      toast.error('Failed to send message');
    },

    onSuccess: (data) => {
      // Update chat list
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(userId) });
    },
  });
};
