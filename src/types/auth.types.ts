import type { Role } from "@/types/role.types";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  // role: "client" | "caretaker" | "agency_owner";

  role:Role
  gender?: string;
  bio?: string;
  country?: string;
  profileImage?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  profileImage?: string;
}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

export interface AgencyRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  // role: "agency_owner";
  role:Role
  agencyName: string;
  address: string;
  registrationNumber: string;
  description?: string;
}

export interface AgencyLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginPayload{
    email: string;
  password: string;
}
