import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { completePasswordChange } from "@/lib/accounts.functions";

const field =
  "mt-1 w-full rounded-sm border border-background/20 bg-background/[0.06] px-3 py-2 text-sm text-background outline-none transition focus:border-background/50";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-background/50";

/** Blocking prompt shown until an account replaces its office-issued temporary password. */
export function PasswordChangePrompt() {
  const complete = useServerFn(completePasswordChange);
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("The two passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await complete();
      toast.success("Password updated.");
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-md border border-background/20 bg-background/[0.04] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/50">First sign-in</p>
        <h1 className="mt-2 font-display text-2xl text-background">Choose your own password</h1>
        <p className="mt-2 text-sm text-background/60">
          Your account was created by the school office with a temporary password. Set a private password to open your
          workspace.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className={label} htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className={label} htmlFor="confirm-password">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              className={field}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="min-h-11 w-full rounded-sm bg-background px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save password"}
          </button>
        </form>
      </div>
    </div>
  );
}
