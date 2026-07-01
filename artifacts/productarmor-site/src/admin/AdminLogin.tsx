import { useState } from "react";
  import { useLocation } from "wouter";
  import { useAdminLogin } from "@workspace/api-client-react";
  import { Shield, Eye, EyeOff, LogIn } from "lucide-react";

  export default function AdminLogin() {
    const [, navigate] = useLocation();
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");

    const loginMutation = useAdminLogin({
      mutation: {
        onSuccess: (data) => {
          localStorage.setItem("admin_token", data.token);
          navigate("/admin/dashboard");
        },
        onError: () => {
          setError("Invalid password. Please try again.");
        },
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      loginMutation.mutate({ data: { password } });
    };

    return (
      <div className="min-h-screen bg-[#0f2a4e] flex items-center justify-center px-4">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <svg className="absolute w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="admin-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#admin-grid)" />
          </svg>
        </div>

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header strip */}
            <div className="bg-[#4164a8] px-8 py-8 text-center">
              <div className="w-14 h-14 bg-[#4164a8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-white font-bold text-xl">Admin Panel</h1>
              <p className="text-white/60 text-sm mt-1">ProductArmor Content Management</p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none focus:ring-2 focus:ring-[#4164a8]/20 text-sm transition-all"
                      placeholder="Enter admin password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginMutation.isPending || !password}
                  className="w-full flex items-center justify-center gap-2 bg-[#4164a8] hover:bg-[#345099] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                >
                  {loginMutation.isPending ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <LogIn size={16} />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                Default password: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">productarmor2024</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  