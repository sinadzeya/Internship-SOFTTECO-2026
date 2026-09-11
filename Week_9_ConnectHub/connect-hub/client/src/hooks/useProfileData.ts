import { userService } from '@/services/user.service.ts';
import { postService } from '@/services/post.service.ts';
import { socialAccountService } from '@/services/social-account.service.ts';
import { useAppDispatch } from '@/store/useStore.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useProfileData(userId?: string) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.fetchUserInfo(userId!),
    enabled: Boolean(userId),
  });

  const postsQuery = useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => postService.fetchPostByUserId(userId!),
    enabled: Boolean(userId),
  });

  const sharedAccessesQuery = useQuery({
    queryKey: ['socialAccounts', 'sharedByMe'],
    queryFn: () => socialAccountService.fetchSharedByMe(),
    enabled: Boolean(userId),
  });

  const sharedWithMeQuery = useQuery({
    queryKey: ['socialAccounts', 'sharedWithMe'],
    queryFn: () => socialAccountService.fetchSharedWithMe(),
    enabled: Boolean(userId),
  });

  const myAccountsQuery = useQuery({
    queryKey: ['socialAccounts', 'mine'],
    queryFn: () => socialAccountService.fetchMyAccounts(),
    enabled: Boolean(userId),
  });

  useEffect(() => {
    if (myAccountsQuery.data) {
      dispatch({
        type: 'SET_USER_SOCIAL_ACCOUNTS',
        payload: myAccountsQuery.data || [],
      });
    }
  }, [myAccountsQuery.data, dispatch]);

  const refreshData = async () => {
    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    await queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
    await queryClient.invalidateQueries({ queryKey: ['user', userId] });
  };

  return {
    loading: userQuery.isLoading || postsQuery.isLoading,
    userInfo: userQuery.data,
    userPosts: postsQuery.data ?? [],
    sharedAccesses: sharedAccessesQuery.data ?? [],
    sharedWithMeAccesses: sharedWithMeQuery.data ?? [],
    refreshData,
  };
}