import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}


const sanitizeUserData = (user: unknown): User | null => {
  if (!user || typeof user !== "object") {
    return null;
  }

  const userObj = user as Record<string, unknown>;
  
  
  const sanitized: User = {
    id: String(userObj.id || ""),
    firstName: String(userObj.firstName || ""),
    lastName: String(userObj.lastName || ""),
    email: String(userObj.email || ""),
    role: userObj.role as User["role"],
  };

  
  if (userObj.profileImage && typeof userObj.profileImage === "string") {
    sanitized.profileImage = userObj.profileImage;
  }

  return sanitized;
};


const getInitialUser = (): User | null => {
  try {
    const stored = localStorage.getItem("authSession");
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return sanitizeUserData(parsed);
  } catch {
   
    localStorage.removeItem("authSession");
    return null;
  }
};

const initialState: AuthState = {
  user: getInitialUser(),
  isAuthenticated: !!localStorage.getItem("authSession"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      
      const sanitized = sanitizeUserData(action.payload);
      if (sanitized) {
        state.user = sanitized;
        state.isAuthenticated = true;
  
        localStorage.setItem("authSession", JSON.stringify(sanitized));
      }
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authSession");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;

