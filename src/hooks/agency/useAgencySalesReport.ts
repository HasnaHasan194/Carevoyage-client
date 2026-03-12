import { useQuery } from "@tanstack/react-query";
import {
  agencyApi,
  type GetSalesReportParams,
} from "@/services/agency/agencyService";
import type { AgencySalesReportResponse } from "@/services/admin/adminService";

export const useAgencySalesReport = (params?: GetSalesReportParams) => {
  return useQuery<AgencySalesReportResponse>({
    queryKey: ["agency", "sales-report", params ?? {}],
    queryFn: () => agencyApi.getSalesReport(params),
  });
};
