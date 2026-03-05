import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  adminApi,
  type PaginatedAdminWalletTransactionsResponse,
  type GetAdminWalletTransactionsParams,
} from "@/services/admin/adminService";

export const useAdminWalletTransactions = (
  params: GetAdminWalletTransactionsParams
) => {
  return useQuery<PaginatedAdminWalletTransactionsResponse>({
    queryKey: ["admin", "wallet-transactions", params],
    queryFn: () => adminApi.getWalletTransactions(params),
    placeholderData: keepPreviousData,
  });
};

