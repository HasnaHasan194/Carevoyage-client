import { CareVoyageBackend } from "@/api/instance";

export interface Wallet {
  id: string;
  ownerId: string;
  ownerType: "USER" | "AGENCY" | "ADMIN";
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: "CREDIT" | "DEBIT";
  source: "PAYMENT" | "REFUND" | "COMMISSION";
  referenceId: string;
  amount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type WalletTransactionTypeFilter = "all" | "CREDIT" | "DEBIT";
export type WalletTransactionSort = "newest" | "oldest";

export interface GetMyWalletTransactionsParams {
  page?: number;
  limit?: number;
  type?: WalletTransactionTypeFilter;
  sort?: WalletTransactionSort;
}

export interface PaginatedWalletTransactionsResponse {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateWalletTopupCheckoutResult {
  url: string;
  sessionId: string;
}

export const walletService = {
  getMyWallet: async (): Promise<Wallet> => {
    const response = await CareVoyageBackend.get<{
      success: boolean;
      data: Wallet;
      message?: string;
    }>("/wallets/me");
    return response.data.data;
  },

  getMyTransactions: async (
    paramsIn?: GetMyWalletTransactionsParams
  ): Promise<PaginatedWalletTransactionsResponse> => {
    const params: Record<string, number | string> = {};
    if (paramsIn?.page !== undefined) params.page = paramsIn.page;
    if (paramsIn?.limit !== undefined) params.limit = paramsIn.limit;
    if (paramsIn?.type !== undefined) params.type = paramsIn.type;
    if (paramsIn?.sort !== undefined) params.sort = paramsIn.sort;

    const response = await CareVoyageBackend.get<{
      success: boolean;
      data: PaginatedWalletTransactionsResponse;
      message?: string;
    }>("/wallets/me/transactions", { params });

    return response.data.data;
  },

  createTopupCheckout: async (amount: number): Promise<CreateWalletTopupCheckoutResult> => {
    const response = await CareVoyageBackend.post<{
      success: boolean;
      data: CreateWalletTopupCheckoutResult;
      message?: string;
    }>("/wallets/topup/checkout", { amount });
    return response.data.data;
  },
};

