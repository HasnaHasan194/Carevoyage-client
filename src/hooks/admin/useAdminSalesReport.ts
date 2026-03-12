import { useQuery } from "@tanstack/react-query";
import {
  adminApi,
  type AdminSalesReportResponse,
  type GetSalesReportParams,
} from "@/services/admin/adminService";

export const useAdminSalesReport = (params?: GetSalesReportParams) => {
  return useQuery<AdminSalesReportResponse>({
    queryKey: ["admin", "sales-report", params ?? {}],
    queryFn: () => adminApi.getSalesReport(params),
  });
};
