import { chatService } from "@/apis/chat/chatService";
import { chatKeys } from "@/utils/chatKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to delete a message
 */
export const useDeleteMessage = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId) => chatService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(userId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      toast.success('Message deleted');
    },
    onError: () => {
      toast.error('Failed to delete message');
    },
  });
};
