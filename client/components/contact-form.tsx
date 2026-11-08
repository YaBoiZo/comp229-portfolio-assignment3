"use client";
import { FormEvent, useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { api } from "@/lib/api";
const empty = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  message: "",
};
export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess(false);
    try {
      await api("/contacts", { method: "POST", body: JSON.stringify(values) });
      setValues(empty);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to send your message.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      {success && (
        <Alert severity="success">
          Thank you! Your message has been saved. I’ll be in touch.
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <div className="form-row">
        {(["firstname", "lastname"] as const).map((key, i) => (
          <TextField
            key={key}
            label={i ? "Last name" : "First name"}
            autoComplete={i ? "family-name" : "given-name"}
            required
            value={values[key]}
            onChange={(e) => setValues({ ...values, [key]: e.target.value })}
          />
        ))}
      </div>
      <TextField
        label="Email address"
        type="email"
        autoComplete="email"
        required
        value={values.email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
      />
      <TextField
        label="Contact number"
        type="tel"
        autoComplete="tel"
        value={values.phone}
        onChange={(e) => setValues({ ...values, phone: e.target.value })}
        slotProps={{ htmlInput: { maxLength: 40 } }}
      />
      <TextField
        label="Message"
        multiline
        minRows={5}
        required
        value={values.message}
        onChange={(e) => setValues({ ...values, message: e.target.value })}
        slotProps={{ htmlInput: { maxLength: 5000 } }}
      />
      <Button type="submit" variant="contained" disabled={busy}>
        {busy ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
