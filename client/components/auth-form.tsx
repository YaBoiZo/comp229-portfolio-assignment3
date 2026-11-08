"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers";
import { FormEvent, useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { api, User } from "@/lib/api";
export function AuthForm({ signup = false }: { signup?: boolean }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (signup)
        await api<User>("/users", {
          method: "POST",
          body: JSON.stringify(values),
        });
      await api("/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      await refresh();
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="form-card"
      aria-label={signup ? "Create account" : "Sign in"}
    >
      {error && <Alert severity="error">{error}</Alert>}
      {signup && (
        <TextField
          label="Full name"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          slotProps={{ htmlInput: { maxLength: 120 } }}
        />
      )}
      <TextField
        label="Email address"
        type="email"
        autoComplete="email"
        required
        value={values.email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete={signup ? "new-password" : "current-password"}
        required
        slotProps={{ htmlInput: { minLength: signup ? 8 : 1 } }}
        helperText={signup ? "Use at least 8 characters." : ""}
        value={values.password}
        onChange={(e) => setValues({ ...values, password: e.target.value })}
      />
      <Button type="submit" variant="contained" disabled={busy}>
        {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
      </Button>
      <p>
        {signup ? "Already have an account?" : "New here?"}{" "}
        <a className="inline-link" href={signup ? "/signin" : "/signup"}>
          {signup ? "Sign in" : "Create an account"}
        </a>
      </p>
    </form>
  );
}
