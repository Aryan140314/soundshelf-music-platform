import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!form.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!form.email.includes("@")) {
      nextErrors.email = "Enter a valid email.";
    }

    if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const user = await register(form);
      navigate(user?.role === "artist" ? "/artist/upload" : "/", { replace: true });
    } catch (error) {
      return;
    }
  };

  return (
    <div className="min-h-screen bg-hero px-4 py-8 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mx-auto w-full max-w-xl rounded-[36px] p-6 md:p-8"
        >
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Create account</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-white">Join SoundShelf</h2>
            <p className="mt-2 text-sm text-slate-300">
              Pick a role, create your identity, and let the cookie auth flow handle the session.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Username"
              icon={FiUser}
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              placeholder="Enter a username"
              error={errors.username}
            />
            <Input
              label="Email"
              icon={FiMail}
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="you@example.com"
              error={errors.email}
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                icon={FiLock}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Choose a strong password"
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

            <div className="space-y-3">
              <span className="text-sm font-medium text-slate-200">Role</span>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    value: "user",
                    label: "Listener",
                    description: "Browse songs, explore albums, and play music.",
                  },
                  {
                    value: "artist",
                    label: "Artist",
                    description: "Upload tracks, create albums, and manage releases.",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, role: option.value }))}
                    className={`rounded-[24px] border p-4 text-left transition ${
                      form.role === option.value
                        ? "border-primary/55 bg-primary/10"
                        : "border-white/10 bg-white/5 hover:bg-white/8"
                    }`}
                  >
                    <p className="font-display text-lg font-bold text-white">{option.label}</p>
                    <p className="mt-2 text-sm text-slate-300">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full justify-center" size="lg" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary transition hover:text-white">
              Sign in
            </Link>
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-10 shadow-glass backdrop-blur-xl lg:block"
        >
          <div className="grid gap-4">
            {[
              "Launch listener and artist journeys from a single shared app shell.",
              "Navigate a polished dark interface with smooth motion and glass cards.",
              "Stay aligned with cookie-based backend authentication and role guards.",
            ].map((item) => (
              <div key={item} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <p className="text-base leading-7 text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
