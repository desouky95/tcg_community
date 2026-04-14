import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useStore } from '../store/useStore';

export const useAuth = () => {
  const loginStore = useStore(state => state.login);

  const requestOtpMutation = useMutation({
    mutationFn: (mobile: string) => api.requestOtp(mobile),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ mobile, otp }: { mobile: string; otp: string }) => {
      const { data } = await api.verifyOtp(mobile, otp);
      return data;
    },
    onSuccess: (data) => {
      loginStore(data.data.user, data.data.token);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { uid: string; password: string }) => {
      const { data } = await api.login(credentials);
      return data;
    },
    onSuccess: (data) => {
      loginStore(data.data.user, data.data.token);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: { mobile: string; fullName: string; username: string; email: string; password?: string }) => api.signup(data),
  });

  return {
    requestOtp: requestOtpMutation,
    verifyOtp: verifyOtpMutation,
    login: loginMutation,
    signup: signupMutation,
  };
};
