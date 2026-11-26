"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../clients/adonis";
import { clearStorefrontCart } from "../commerce/cart-actions";
import { authQuery } from "./auth-destination";

export function useStorefrontLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await api.logout();
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status !== 401) throw error;
      }
      await clearStorefrontCart();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.assign(`/login?${authQuery("public", "/account")}`);
    },
  });
}
