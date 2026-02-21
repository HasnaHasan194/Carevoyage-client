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

/** Only logout on session-invalid errors (401, 403, 404). Avoid logout on network/500 errors. */
const isSessionInvalidError = (error: unknown): boolean => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 401 || status === 403 || status === 404;
};

export const useAuthSession = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  // Prioritize localStorage over Redux to prevent stale role data
  // localStorage is the source of truth, Redux should sync with it
  const localUser = readStoredSession();
  const user = localUser ?? reduxUser;
  const shouldValidate = !!user;

  const query = useQuery({
    queryKey: ["authMe"],
    queryFn: authApi.me,
    enabled: shouldValidate,
    retry: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!shouldValidate) return;

    if (query.isSuccess && query.data) {
      // Always sync Redux with API response to ensure role is correct
      dispatch(loginUser(query.data));
      return;
    }

    // Only logout on session-invalid errors. 401/403 are handled by the API interceptor;
    // 404 means user not found. Avoid logout on network/500 errors.
    if (query.isError) {
      const isInvalid = isSessionInvalidError(query.error);
      if (isInvalid) {
        dispatch(logoutUser());
      }
    }
  }, [dispatch, query.data, query.error, query.isError, query.isSuccess, shouldValidate]);

  // If localStorage is empty, don't use cached query data even if it exists
  // Only use cached query data if localStorage has a valid session
  // This prevents redirect to dashboard after logout when localStorage is cleared but cache still has data
  const finalUser = localUser 
    ? (query.isSuccess && query.data ? query.data : localUser ?? reduxUser)
    : null;
  const hasSessionInvalidError = query.isError && isSessionInvalidError(query.error);
  const isAuthenticated = !!finalUser && (!query.isError || !hasSessionInvalidError);

  return {
    user: finalUser,
    isValidating: shouldValidate && query.isLoading,
    isAuthenticated,
  };
};


