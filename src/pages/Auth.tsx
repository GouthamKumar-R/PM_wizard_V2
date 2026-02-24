import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function Auth() {
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (isSignUp) {
      toast({ title: "Check your email", description: "We sent you a confirmation link." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-[var(--shadow-card)]"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Wand2 className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">PM Wizard</span>
        </div>

        <h1 className="font-display text-xl font-bold mb-1">{isSignUp ? "Create account" : "Welcome back"}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isSignUp ? "Sign up to start analyzing your documents." : "Sign in to your account."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent text-accent-foreground font-medium text-sm py-2.5 shadow-[var(--shadow-amber)] hover:brightness-105 transition disabled:opacity-50"
          >
            {submitting ? "..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-accent font-medium hover:underline">
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
