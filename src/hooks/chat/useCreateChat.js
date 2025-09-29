import { chatService } from "@/apis/chat/chatService";
import { chatKeys } from "@/utils/chatKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to create or find a chat
 */
export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => chatService.createChat(userId),
    onSuccess: (data) => {
      // Invalidate chat list to show new chat
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create chat');
    },
  });
};
