import { clerkSetup } from '@clerk/testing/playwright';

// Fetches a Clerk Testing Token (using CLERK_SECRET_KEY) so headless sign-in
// bypasses bot protection. Runs once before the suite.
export default async function globalSetup() {
  if (!process.env.CLERK_SECRET_KEY) {
    console.warn(
      '[e2e] CLERK_SECRET_KEY not set — sign-in specs will be skipped.'
    );
    return;
  }
  await clerkSetup({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });
}
