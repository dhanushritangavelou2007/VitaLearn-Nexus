import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="mt-3 text-slate-300">
          Demo access is enabled through the built-in school accounts. Use one of the role logins from the main login page.
        </p>
        <Link to="/login" className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900">
          Return to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;

