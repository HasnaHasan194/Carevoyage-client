import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CareVoyageBackend } from "@/api/instance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/User/card";
import { Button } from "@/components/User/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function AgencyReverifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const trimmedToken = token?.trim();
    if (!trimmedToken || status !== "idle") return;

    setStatus("loading");
    setErrorMessage("");

    CareVoyageBackend.post("/auth/agency/reverify", { token: trimmedToken })
      .then(() => {
        setStatus("success");
      })
      .catch((err: { response?: { data?: { message?: string } } }) => {
        setStatus("error");
        setErrorMessage(
          err?.response?.data?.message ??
            "Invalid or expired link. Please request a new reverification from the rejection email."
        );
      });
  }, [token, status]);

  if (!token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <Card className="w-full max-w-md border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: "#374151" }}>
              <XCircle className="w-6 h-6 text-red-500" />
              Invalid link
            </CardTitle>
            <CardDescription>
              No reverification token found. Please use the link from your rejection email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/agency/login">Go to agency login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <Card className="w-full max-w-md border shadow-lg">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin" style={{ color: "#7C5A3B" }} />
            <p style={{ color: "#6B7280" }}>Submitting your reverification request...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <Card className="w-full max-w-md border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: "#16A34A" }}>
              <CheckCircle className="w-6 h-6" />
              Request submitted
            </CardTitle>
            <CardDescription>
              Your reverification request has been submitted. Our team will review your agency
              again. You will be able to log in once your agency is approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" style={{ backgroundColor: "#7C5A3B" }}>
              <Link to="/agency/login">Go to agency login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: "#DC2626" }}>
            <XCircle className="w-6 h-6" />
            Request failed
          </CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link to="/agency/login">Go to agency login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
