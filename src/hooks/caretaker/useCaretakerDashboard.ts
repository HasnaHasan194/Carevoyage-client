import { useQuery } from "@tanstack/react-query";
import { caretakerApi } from "@/services/caretaker/caretakerService";

export const useCaretakerDashboard = () => {
  return useQuery({
    queryKey: ["caretaker", "dashboard"],
    queryFn: () => caretakerApi.getDashboard(),
  });
};
