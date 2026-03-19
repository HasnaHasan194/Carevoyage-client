import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  caretakerApi,
  type GetCaretakerTripsParams,
  type ListCaretakerTripsResponse,
} from "@/services/caretaker/caretakerService";

export const useCaretakerTrips = (params: GetCaretakerTripsParams = {}) => {
  const { page = 1, limit = 10 } = params;
  return useQuery<ListCaretakerTripsResponse>({
    queryKey: ["caretaker", "trips", { page, limit }],
    queryFn: () => caretakerApi.getTrips({ page, limit }),
    placeholderData: keepPreviousData,
  });
};
