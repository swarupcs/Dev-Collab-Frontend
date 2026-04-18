import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { discussionService } from '@/services/discussion.service';

export const discussionKeys = {
  all: ['discussions'] as const,
  posts: (params?: any) => [...discussionKeys.all, 'posts', params] as const,
  post: (id: string) => [...discussionKeys.all, 'post', id] as const,
  comments: (postId: string) => [...discussionKeys.all, 'comments', postId] as const,
};

export const useDiscussionPosts = (params?: any) => {
  return useInfiniteQuery({
    queryKey: discussionKeys.posts(params),
    queryFn: ({ pageParam }) => discussionService.getPosts({ ...params, pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length ? allPages.length + 1 : undefined;
    },
  });
};

export const useDiscussionPost = (id: string, enabled = true) => {
  return useQuery({
    queryKey: discussionKeys.post(id),
    queryFn: () => discussionService.getPostById(id),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: discussionService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.all });
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => discussionService.toggleLike(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.post(id) });
      queryClient.invalidateQueries({ queryKey: discussionKeys.all });
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => discussionService.toggleBookmark(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.post(id) });
      queryClient.invalidateQueries({ queryKey: discussionKeys.all });
    },
  });
};

export const useComments = (postId: string, enabled = true) => {
  return useQuery({
    queryKey: discussionKeys.comments(postId),
    queryFn: () => discussionService.getComments(postId),
    enabled,
    staleTime: 60 * 1000,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: any }) => 
      discussionService.createComment(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: discussionKeys.post(postId) });
    },
  });
};
