// import type React from "react";
// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import type { Role } from "@/types/role.types";
// import toast from "react-hot-toast";
// import { Button } from "@/components/User/button";
// import { Input } from "@/components/User/input";
// import { Label } from "@/components/User/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/User/card";
// import { useVerifyInvite, useCaretakerSignupMutation } from "@/hooks/caretaker/useCaretaker";
// import { ROUTES } from "@/config/env";
// import { useDispatch } from "react-redux";
// import { loginUser } from "@/store/slices/userSlice";
// import { Loader2, Mail, Building2 } from "lucide-react";

// export function CaretakerSignupForm() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const token = searchParams.get("token");

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const { data: inviteData, isLoading: isVerifying, error: verifyError } = useVerifyInvite(token);
//   const { mutate: signup, isPending: isSigningUp } = useCaretakerSignupMutation();

//   useEffect(() => {
//     if (verifyError) {
//       const errorMessage =
//         (verifyError as { response?: { data?: { message?: string } } })?.response?.data
//           ?.message || "Invalid or expired invitation link";
//       toast.error(errorMessage);
//       navigate(ROUTES.LOGIN);
//     }
//   }, [verifyError, navigate]);

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     }

//     if (!lastName.trim()) {
//       newErrors.lastName = "Last name is required";
//     }

//     if (!phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone)) {
//       newErrors.phone = "Invalid phone number format";
//     }

//     if (!password) {
//       newErrors.password = "Password is required";
//     } else if (password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
//       newErrors.password =
//         "Password must contain at least one uppercase letter, one lowercase letter, and one number";
//     }

//     if (password !== confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!token) {
//       toast.error("Invalid invitation link");
//       navigate(ROUTES.LOGIN);
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     signup(
//       {
//         token,
//         firstName: firstName.trim(),
//         lastName: lastName.trim(),
//         password,
//         phone: phone.trim(),
//       },
//       {
//         onSuccess: (response) => {
//           if (response.data) {
//             // Sanitize user data before storing
//             const userData = {
//               id: response.data.id,
//               firstName: response.data.firstName,
//               lastName: response.data.lastName,
//               email: response.data.email,
//               role: response.data.role as Role,
//             };

//             // Store access token if provided
//             if (response.accessToken) {
//               localStorage.setItem("accessToken", response.accessToken);
//             }

//             dispatch(loginUser(userData));
//             toast.success("Account created successfully!");
//             navigate(ROUTES.CARETAKER_DASHBOARD);
//           }
//         },
//         onError: (error: unknown) => {
//           const errorMessage =
//             (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
//             "Signup failed. Please try again.";
//           toast.error(errorMessage);
//         },
//       }
//     );
//   };

//   if (isVerifying) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
//         <Card className="w-full max-w-md border-border shadow-lg">
//           <CardContent className="pt-6">
//             <div className="flex flex-col items-center justify-center space-y-4">
//               <Loader2 className="h-8 w-8 animate-spin text-[#D4A574]" />
//               <p className="text-sm text-muted-foreground">Verifying invitation...</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!inviteData?.data) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4 py-8">
//       <Card className="w-full max-w-md border-border shadow-lg bg-white">
//         <CardHeader className="text-center space-y-2">
//           <div className="flex justify-center mb-2">
//             <div className="rounded-full bg-[#F5E6D3] p-3">
//               <Building2 className="h-6 w-6 text-[#D4A574]" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl font-bold text-[#8B6F47]">
//             Complete Your Registration
//           </CardTitle>
//           <CardDescription className="text-sm text-muted-foreground">
//             You've been invited to join{" "}
//             <span className="font-semibold text-[#8B6F47]">
//               {inviteData.data.agencyName}
//             </span>{" "}
//             as a caretaker
//           </CardDescription>
//           <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
//             <Mail className="h-3 w-3" />
//             <span>{inviteData.data.email}</span>
//           </div>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName" className="text-[#8B6F47]">
//                   First Name
//                 </Label>
//                 <Input
//                   id="firstName"
//                   type="text"
//                   placeholder="John"
//                   value={firstName}
//                   onChange={(e) => {
//                     setFirstName(e.target.value);
//                     if (errors.firstName) {
//                       setErrors({ ...errors, firstName: "" });
//                     }
//                   }}
//                   className={errors.firstName ? "border-red-500" : ""}
//                 />
//                 {errors.firstName && (
//                   <p className="text-xs text-red-500">{errors.firstName}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="lastName" className="text-[#8B6F47]">
//                   Last Name
//                 </Label>
//                 <Input
//                   id="lastName"
//                   type="text"
//                   placeholder="Doe"
//                   value={lastName}
//                   onChange={(e) => {
//                     setLastName(e.target.value);
//                     if (errors.lastName) {
//                       setErrors({ ...errors, lastName: "" });
//                     }
//                   }}
//                   className={errors.lastName ? "border-red-500" : ""}
//                 />
//                 {errors.lastName && (
//                   <p className="text-xs text-red-500">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phone" className="text-[#8B6F47]">
//                 Phone Number
//               </Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 placeholder="+1234567890"
//                 value={phone}
//                 onChange={(e) => {
//                   setPhone(e.target.value);
//                   if (errors.phone) {
//                     setErrors({ ...errors, phone: "" });
//                   }
//                 }}
//                 className={errors.phone ? "border-red-500" : ""}
//               />
//               {errors.phone && (
//                 <p className="text-xs text-red-500">{errors.phone}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-[#8B6F47]">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   if (errors.password) {
//                     setErrors({ ...errors, password: "" });
//                   }
//                 }}
//                 className={errors.password ? "border-red-500" : ""}
//               />
//               {errors.password && (
//                 <p className="text-xs text-red-500">{errors.password}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword" className="text-[#8B6F47]">
//                 Confirm Password
//               </Label>
//               <Input
//                 id="confirmPassword"
//                 type="password"
//                 placeholder="••••••••"
//                 value={confirmPassword}
//                 onChange={(e) => {
//                   setConfirmPassword(e.target.value);
//                   if (errors.confirmPassword) {
//                     setErrors({ ...errors, confirmPassword: "" });
//                   }
//                 }}
//                 className={errors.confirmPassword ? "border-red-500" : ""}
//               />
//               {errors.confirmPassword && (
//                 <p className="text-xs text-red-500">{errors.confirmPassword}</p>
//               )}
//             </div>

//             <CardFooter className="p-0 pt-4">
//               <Button
//                 type="submit"
//                 disabled={isSigningUp}
//                 className="w-full bg-[#D4A574] hover:bg-[#C49664] text-white"
//               >
//                 {isSigningUp ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating Account...
//                   </>
//                 ) : (
//                   "Create Account"
//                 )}
//               </Button>
//             </CardFooter>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Role } from "@/types/role.types";
import toast from "react-hot-toast";

import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";

import {
  useVerifyInvite,
  useCaretakerSignupMutation,
} from "@/hooks/caretaker/useCaretaker";
import { ROUTES } from "@/config/env";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { Loader2, Heart } from "lucide-react";

export function CaretakerSignupForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = searchParams.get("token");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: inviteData, isLoading, error } = useVerifyInvite(token);
  const { mutate: signup, isPending } = useCaretakerSignupMutation();

  useEffect(() => {
    if (error) {
      toast.error("Invalid or expired invitation link");
      navigate(ROUTES.LOGIN);
    }
  }, [error, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid invitation link");
      return;
    }

    const newErrors: Record<string, string> = {};

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    signup(
      { token, firstName, lastName, phone, password },
      {
        onSuccess: (res) => {
          if (res.data) {
            const user = {
              id: res.data.id,
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              email: res.data.email,
              role: res.data.role as Role,
            };

            if (res.accessToken) {
              localStorage.setItem("accessToken", res.accessToken);
            }

            dispatch(loginUser(user));
            toast.success("Account created successfully");
            // Always redirect to verification after signup
            navigate(ROUTES.CARETAKER_VERIFICATION);
          }
        },
        onError: () => toast.error("Signup failed"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A574]" />
      </div>
    );
  }

  if (!inviteData?.data) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT – HERO (SAME AS LOGIN) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-8 lg:px-12 py-10 lg:py-16 bg-[#FAF7F2]">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-[#D4A574]">
            CareVoyage
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="h-4 w-4 text-[#D4A574]" />
            <span className="text-sm text-[#8B6F47]">
              Caretaker Portal
            </span>
          </div>

          <p className="text-base lg:text-lg max-w-md text-[#6B5B4F]">
            You’ve been invited to join{" "}
            <span className="font-semibold">
              {inviteData.data.agencyName}
            </span>{" "}
            as a caretaker.
          </p>
        </div>

        <div className="mt-10">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-16/10">
            <img
              src="/caretaker-login-hero.jpg"
              alt="Caretaker journey"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <h3 className="text-xl lg:text-2xl font-bold text-white">
                Start Your Journey
              </h3>
              <p className="text-sm text-white/90">
                Compassion begins with you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT – SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-2 text-[#8B6F47]">
            Complete Registration
          </h2>
          <p className="text-center text-sm mb-8 text-[#A89880]">
            Create your caretaker account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#6B5B4F]">First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>

              <div>
                <Label className="text-[#6B5B4F]">Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label className="text-[#6B5B4F]">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <Label className="text-[#6B5B4F]">Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <Label className="text-[#6B5B4F]">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#D4A574] hover:bg-[#C49664] text-white"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
