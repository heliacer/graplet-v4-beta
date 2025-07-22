"use client";

import { createContext, FormEvent, useEffect, useState } from "react";
import EarlyAccessLogo from "../ui/ea-logo";
import { AlertTriangle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export const EmailContext = createContext<{
  isFocussedEmail: boolean;
  canSubmitEmail: boolean;
  status: string;
}>({
  isFocussedEmail: false,
  canSubmitEmail: false,
  status: "",
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const [isFocussedEmail, setIsFocussedEmail] = useState(false);
  const [canSubmitEmail, setCanSubmitEmail] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");

    const formData = new FormData(event.currentTarget);
    const emailInput = formData.get("email")?.toString();
    const passwordInput = formData.get("password")?.toString();

    if (emailInput) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
        console.log("proceed to server checks.");
        // simulate db fetch
        setTimeout(() => {
          // UI Testing, bypass
          setStatus("ok");
          router.push("/login/password");
        }, 3000);
      } else {
        setStatus("");
        setError("Invalid Email.");
      }
    } else {
      setStatus("");
      setError("Email cannot be empty.");
    }
  }

  return (
    <main className="font-light flex gap-5 flex-col justify-center items-center min-h-screen">
      <EarlyAccessLogo size={90} />
      <p className="italic">Early Access.</p>
      <form
        className="relative flex flex-col gap-2.5 w-96"
        id="login-form"
        onSubmit={(e) => handleSubmit(e)}
        noValidate
      >
        <input
          name="email"
          className="w-full pr-12 border py-1.5 pl-3 rounded-full border-zinc-700 truncate focus:outline-none focus:bg-zinc-800 focus:border-zinc-600"
          placeholder="Enter granted Email"
          onChange={(e) => setCanSubmitEmail(!!e.target.value)}
          onFocus={() => setIsFocussedEmail(true)}
          onBlur={() => setIsFocussedEmail(false)}
          type="email"
          inputMode="email"
          autoComplete="off"
        />
        <EmailContext.Provider value={{ isFocussedEmail, canSubmitEmail, status }}>
          {children}
        </EmailContext.Provider>
      </form>
      {error ? (
        <div className="flex gap-2.5 items-center animate-shake">
          <AlertTriangle size={14} className="text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="flex gap-2.5 items-center">
          <Mail size={14} />
          <p>Invitation only.</p>
        </div>
      )}
    </main>
  );
}
