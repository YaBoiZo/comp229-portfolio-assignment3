"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./providers";
export function AuthLinks() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [error, setError] = useState("");
  if (loading) return <span className="account-status">Account…</span>;
  if (!user) return <a href="/signin">Sign in</a>;
  return (
    <>
      <a href="/dashboard">{user.role === "admin" ? "Manage" : "My account"}</a>
      <button
        className="text-button"
        onClick={async () => {
          try {
            await signOut();
            router.push("/");
          } catch {
            setError("Sign out failed. Try again.");
          }
        }}
      >
        Sign out
      </button>
      {error && <span role="alert">{error}</span>}
    </>
  );
}
