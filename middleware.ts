import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isConfiguredClerkKey = Boolean(
  publishableKey &&
  !publishableKey.includes("mock") &&
  !publishableKey.includes("sample") &&
  (publishableKey.startsWith("pk_test_") || publishableKey.startsWith("pk_live_")),
);

export default clerkMiddleware((auth, req) => {
  if (!isConfiguredClerkKey) {
    return;
  }

  if (isProtectedRoute(req)) {
    auth().protect({ unauthenticatedUrl: new URL("/sign-in", req.url).toString() });
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
