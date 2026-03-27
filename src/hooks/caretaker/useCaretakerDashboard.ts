import { useQuery } from "@tanstack/react-query";
import { caretakerApi, type CaretakerDashboardResponse } from "@/services/caretaker/caretakerService";

export const useCaretakerDashboard = () => {
  return useQuery<CaretakerDashboardResponse>({
    queryKey: ["caretaker", "dashboard"],
    queryFn: () => caretakerApi.getDashboard(),
  });
};