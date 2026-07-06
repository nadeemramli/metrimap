import { clerkSetup } from '@clerk/testing/playwright';

// The dev (pk_test) instance is a separate user pool, so ensure the e2e user
// exists there. Idempotent — "already exists" is fine. Uses the dev secret key.
async function ensureTestUser() {
  const sk = process.env.CLERK_SECRET_KEY;
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  if (!sk?.startsWith('sk_test') || !email || !password) return;
  const res = await fetch('https://api.clerk.com/v1/users', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sk}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: [email],
      password,
      skip_password_checks: true,
    }),
  });
  if (res.ok) {
    console.log('[e2e] created dev test user');
  } else {
    const t = await res.text();
    if (/already|taken|exists|identifier/i.test(t))
      console.log('[e2e] dev test user already exists');
    else console.warn(`[e2e] user create failed (${res.status}): ${t.slice(0, 200)}`);
  }
}

export default async function globalSetup() {
  if (!process.env.CLERK_SECRET_KEY) {
    console.warn('[e2e] CLERK_SECRET_KEY not set — sign-in specs will be skipped.');
    return;
  }
  await clerkSetup({ publishableKey: process.env.CLERK_PUBLISHABLE_KEY });
  await ensureTestUser();
}
