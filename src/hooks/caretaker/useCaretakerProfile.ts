import { useQuery } from "@tanstack/react-query";
import { caretakerApi } from "@/services/caretaker/caretakerService";

export const useCaretakerProfile = () => {
  return useQuery({
    queryKey: ["caretakerProfile"],
    queryFn: () => caretakerApi.getProfile(),
    retry: false,
  });
};

