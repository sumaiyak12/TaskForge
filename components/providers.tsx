"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function Providers({
  children,
  publishableKey,
}: {
  children: React.ReactNode;
  publishableKey?: string;
}) {
  const key =
    publishableKey ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "pk_test_cm9idXN0LWNoaXBtdW5rLTQ5MzguY2xlcmsuYWNjb3VudHMuZGV2JA";

  return <ClerkProvider publishableKey={key}>{children}</ClerkProvider>;
}
