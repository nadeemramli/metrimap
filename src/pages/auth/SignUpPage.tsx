import { SignUp } from "@clerk/react-router";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <SignUp />
    </div>
  );
}
