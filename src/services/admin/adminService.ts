import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
}

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export type AdminWalletOwnerType = "client" | "agency" | "admin";

export interface AdminWalletTransactionView {
  transaction: WalletTransaction;
  ownerType: AdminWalletOwnerType;
  ownerId: string;
  ownerName?: string;
}

export interface PaginatedAdminWalletTransactionsResponse {
  transactions: AdminWalletTransactionView[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type WalletTransactionSort = "newest" | "oldest";

export interface GetAdminWalletTransactionsParams {
  page?: number;
  limit?: number;
  type?: "all" | "CREDIT" | "DEBIT";
  source?: "all" | "PAYMENT" | "REFUND" | "COMMISSION";
  sort?: WalletTransactionSort;
}

export type UserStatusFilter = "all" | "blocked" | "unblocked";
export type SortOrder = "asc" | "desc";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatusFilter;
  sort?: string;
  order?: SortOrder;
}

export interface SalesReportSummary {
  totalBookings: number;
  totalRevenue: number;
  currency: string;
}

export interface DateWiseSales {
  date: string;
  bookingCount: number;
  revenue: number;
}

export interface TopPackageSales {
  packageId: string;
  packageName: string;
  bookingCount: number;
  revenue: number;
}

export interface TopAgencySales {
  agencyId: string;
  agencyName: string;
  bookingCount: number;
  revenue: number;
}

export interface SalesReportRow {
  bookingId: string;
  packageName: string;
  agencyName: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt?: string;
}

export interface AdminSalesReportResponse {
  summary: SalesReportSummary;
  dateWiseSales: DateWiseSales[];
  topPackages: TopPackageSales[];
  topAgencies: TopAgencySales[];
  rows: SalesReportRow[];
  startDate: string | null;
  endDate: string | null;
}

export interface AgencySalesReportResponse {
  summary: SalesReportSummary;
  dateWiseSales: DateWiseSales[];
  topPackages: TopPackageSales[];
  rows: SalesReportRow[];
  startDate: string | null;
  endDate: string | null;
}

export interface GetSalesReportParams {
  startDate?: string;
  endDate?: string;
}

export const adminApi = {
  getUsers: async (params: GetUsersParams): Promise<PaginatedUsersResponse> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: PaginatedUsersResponse;
    }> = await CareVoyageBackend.get("/admin/users", { params });
    return response.data.data;
  },

  getUserDetails: async (userId: string): Promise<User> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: User;
    }> = await CareVoyageBackend.get(`/admin/users/${userId}`);
    return response.data.data;
  },

  blockUser: async (userId: string): Promise<void> => {
    await CareVoyageBackend.patch(`/admin/users/${userId}/block`);
  },

  unblockUser: async (userId: string): Promise<void> => {
    await CareVoyageBackend.patch(`/admin/users/${userId}/unblock`);
  },

  getWalletTransactions: async (
    params: GetAdminWalletTransactionsParams
  ): Promise<PaginatedAdminWalletTransactionsResponse> => {
    const response: AxiosResponse<{
      success: boolean;
      message?: string;
      data: PaginatedAdminWalletTransactionsResponse;
    }> = await CareVoyageBackend.get("/admin/wallet-transactions", {
      params,
    });
    return response.data.data;
  },

  getSalesReport: async (
    params?: GetSalesReportParams
  ): Promise<AdminSalesReportResponse> => {
    const response: AxiosResponse<{
      success: boolean;
      data: AdminSalesReportResponse;
    }> = await CareVoyageBackend.get("/admin/sales-report", { params });
    return response.data.data;
  },

  exportSalesReportPdf: async (
    params?: GetSalesReportParams
  ): Promise<Blob> => {
    const response = await CareVoyageBackend.get("/admin/sales-report/pdf", {
      params,
      responseType: "blob",
    });
    return response.data as Blob;
  },

  exportSalesReportExcel: async (
    params?: GetSalesReportParams
  ): Promise<Blob> => {
    const response = await CareVoyageBackend.get("/admin/sales-report/excel", {
      params,
      responseType: "blob",
    });
    return response.data as Blob;
  },
};




