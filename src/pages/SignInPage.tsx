import { SignIn } from "@clerk/react-router";
import { useLocation } from "react-router-dom";

export default function SignInPage() {
  const location = useLocation();
  const from = location.state?.from || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <SignIn redirectUrl={from} />
    </div>
  );
}
