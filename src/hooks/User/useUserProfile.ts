import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/User/userService";

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfileService,
    retry: false,
  });
};