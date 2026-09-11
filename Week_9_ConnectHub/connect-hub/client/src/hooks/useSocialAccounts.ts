import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/useStore.ts';
import {
  type AddSocialAccountDto,
  socialAccountService,
  type UpdateSocialAccountDto,
} from '@/services/social-account.service.ts';

export function useSocialAccounts() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  
  const query = useQuery({
    queryKey: ['socialAccounts'],
    queryFn: async () => {
      const accounts = await socialAccountService.fetchMyAccounts();
      const freshAccounts = accounts || [];
      
      dispatch({
        type: 'SET_USER_SOCIAL_ACCOUNTS',
        payload: freshAccounts,
      });

      return freshAccounts;
    },
  });
  
  const addAccountMutation = useMutation({
    mutationFn: (data: AddSocialAccountDto) => socialAccountService.addAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
    },
  });

  const removeAccountMutation = useMutation({
    mutationFn: (id: string) => socialAccountService.removeAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSocialAccountDto }) =>
      socialAccountService.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
    },
  });

  return {
    accounts: query.data ?? [],
    isLoading: query.isLoading,
    addAccount: addAccountMutation,
    removeAccount: removeAccountMutation,
    updateAccount: updateAccountMutation,
  };
}