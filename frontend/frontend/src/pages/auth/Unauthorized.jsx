import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-10 text-center backdrop-blur-xl">
        <h1 className="text-3xl font-bold">Unauthorized</h1>
        <p className="mt-3 text-slate-300">You do not have permission to access this page with your current role.</p>
        <Link to="/login" className="mt-8 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;

