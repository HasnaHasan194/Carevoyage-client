import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  walletService,
  type Wallet,
  type PaginatedWalletTransactionsResponse,
  type GetMyWalletTransactionsParams,
} from "@/services/User/walletService";

export const useMyWallet = () => {
  return useQuery<Wallet>({
    queryKey: ["myWallet"],
    queryFn: () => walletService.getMyWallet(),
  });
};

export const useMyWalletTransactions = (params: GetMyWalletTransactionsParams) => {
  return useQuery<PaginatedWalletTransactionsResponse>({
    queryKey: ["myWalletTransactions", params.page, params.limit, params.type, params.sort],
       queryFn: () => walletService.getMyTransactions(params),
       placeholderData: keepPreviousData,
  });
};

export const useCreateWalletTopupCheckout = () => {
  return useMutation({
    mutationFn: (amount: number) => walletService.createTopupCheckout(amount),
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
  });
};

