import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    identity: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const redirectTarget = useMemo(() => location.state?.from?.pathname || "/", [location.state]);

  const validate = () => {
    const nextErrors = {};

    if (!form.identity.trim()) {
      nextErrors.identity = "Enter your username or email.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = form.identity.includes("@")
      ? { email: form.identity.trim(), password: form.password }
      : { username: form.identity.trim(), password: form.password };

    try {
      const user = await login(payload);
      navigate(user?.role === "artist" ? "/artist/upload" : redirectTarget, { replace: true });
    } catch (error) {
      return;
    }
  };

  return (
    <div className="min-h-screen bg-hero px-4 py-8 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-10 shadow-glass backdrop-blur-xl lg:block"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Premium streaming</p>
          <h1 className="mt-5 max-w-xl font-display text-5xl font-bold leading-tight text-white">
            Move through music like it was designed for your mood.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            SoundShelf blends the sharp edge of a creator dashboard with the atmosphere of a luxury
            streaming app, all powered by your backend cookies and music APIs.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { label: "Cookie-based auth", value: "Secure" },
              { label: "Artist tools", value: "Upload + albums" },
              { label: "Listener flow", value: "Explore + play" },
            ].map((item) => (
              <div key={item.label} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 font-display text-xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mx-auto w-full max-w-xl rounded-[36px] p-6 md:p-8"
        >
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Welcome back</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-white">Sign in to SoundShelf</h2>
            <p className="mt-2 text-sm text-slate-300">
              Use your username or email to jump back into your session.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Username or Email"
              icon={form.identity.includes("@") ? FiMail : FiUser}
              value={form.identity}
              onChange={(event) => setForm((current) => ({ ...current, identity: event.target.value }))}
              placeholder="artistname or artist@mail.com"
              error={errors.identity}
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                icon={FiLock}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter your password"
                error={errors.password}
                inputClassName="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="-mt-12 mr-4 float-right text-slate-400 transition hover:text-white"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <Button type="submit" className="w-full justify-center" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Need an account?{" "}
            <Link to="/register" className="font-semibold text-primary transition hover:text-white">
              Create one
            </Link>
          </p>
        </motion.section>
      </div>
    </div>
  );
}
