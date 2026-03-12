import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  caretakerApi,
  type GetCaretakerTripsParams,
} from "@/services/caretaker/caretakerService";

export const useCaretakerTrips = (params: GetCaretakerTripsParams = {}) => {
  const { page = 1, limit = 10 } = params;
  return useQuery({
    queryKey: ["caretaker", "trips", { page, limit }],
    queryFn: () => caretakerApi.getTrips({ page, limit }),
    placeholderData: keepPreviousData,
  });
};
