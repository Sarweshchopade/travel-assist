import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Compass, Mail, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/my-trips";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Couldn't log you in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Compass size={20} className="text-marigold" />
          <span className="font-display text-lg">Yatra AI</span>
        </div>

        <div className="card-glass rounded-3xl p-8">
          <h1 className="font-display text-2xl text-paper text-center mb-6">Welcome back</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email" icon={Mail}>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password" icon={Lock}>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input"
                placeholder="••••••••"
              />
            </Field>

            {error && (
              <p className="flex items-center gap-1.5 text-terracotta text-sm">
                <AlertTriangle size={14} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-marigold text-ink font-semibold py-3 rounded-full hover:bg-marigold-soft transition-colors disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-center text-sm text-mist mt-5">
            New here?{" "}
            <Link to="/signup" className="text-marigold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>

      <style>{`
        .input {
          width: 100%;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-paper);
          border-radius: 0.75rem;
          padding: 0.7rem 0.9rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus { border-color: var(--color-marigold); }
      `}</style>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-mist mb-1.5">
        {Icon && <Icon size={13} />}
        {label}
      </span>
      {children}
    </label>
  );
}
