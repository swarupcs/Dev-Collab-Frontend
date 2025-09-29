import { chatService } from "@/apis/chat/chatService";
import { chatKeys } from "@/utils/chatKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to edit a message
 */
export const useEditMessage = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, text }) =>
      chatService.editMessage(messageId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(userId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      toast.success('Message edited');
    },
    onError: () => {
      toast.error('Failed to edit message');
    },
  });
};
