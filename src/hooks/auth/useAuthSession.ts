import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { User } from "@/types/auth.types";
import { authApi } from "@/services/auth/authService";
import { loginUser, logoutUser } from "@/store/slices/userSlice";

const readStoredSession = (): User | null => {
  try {
    const stored = localStorage.getItem("authSession");
    if (!stored) return null;
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};


export const useAuthSession = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  const localUser = reduxUser ?? readStoredSession();
  const shouldValidate = !!localUser;

  const query = useQuery({
    queryKey: ["authMe"],
    queryFn: authApi.me,
    enabled: shouldValidate,
    retry: false,
    // Always re-validate when we have a stored session to avoid
    // briefly treating a stale role as authenticated (UI "flash" on role switch).
    staleTime: 0,
    refetchOnMount: "always",
  });

  
  useEffect(() => {
    if (!shouldValidate) return;

    if (query.isSuccess && query.data) {
      dispatch(loginUser(query.data));
      return;
    }

    if (query.isError) {
      dispatch(logoutUser());
    }
  }, [dispatch, query.data, query.isError, query.isSuccess, shouldValidate]);

  const isValidating = shouldValidate && (query.isLoading || query.isFetching);
  const isAuthenticated = shouldValidate && query.isSuccess && !!query.data;

  return {
    // While validating, we may still have localUser for UI purposes,
    // but we only treat the session as authenticated after /auth/me succeeds.
    user: reduxUser ?? (query.data ?? localUser),
    isValidating,
    isAuthenticated,
  };
};


