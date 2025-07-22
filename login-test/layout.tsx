"use client";

import { FormEvent, useEffect, useState } from "react";
import EarlyAccessLogo from "../app/ui/ea-logo";
import { AlertTriangle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";


export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="font-light flex gap-5 flex-col justify-center items-center min-h-screen">
      <EarlyAccessLogo size={90} />
      <p className="italic">Early Access.</p>
      {children}
    </main>
  );
}
