"use client";
import { FormEvent, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useAuth } from "./providers";
import { api, PortfolioRecord } from "@/lib/api";
type Resource = "projects" | "qualifications" | "contacts";
const titles = {
  projects: "Projects",
  qualifications: "Education",
  contacts: "Contacts",
};
const blank = {
  title: "",
  firstname: "",
  lastname: "",
  email: "",
  completion: "",
  description: "",
  phone: "",
  message: "",
  image: "",
  type: "",
  roleDescription: "",
  outcome: "",
  institution: "",
  start: "",
  status: "",
};
export function Dashboard() {
  const { user, loading } = useAuth();
  const [resource, setResource] = useState<Resource>("projects");
  if (loading) return <p role="status">Checking your account…</p>;
  if (!user)
    return (
      <Alert severity="info">
        Please{" "}
        <a className="inline-link" href="/signin">
          sign in
        </a>{" "}
        to access your account.
      </Alert>
    );
  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">
            {user.role === "admin" ? "Administrator" : "Member"}
          </p>
          <h2>Hello, {user.name}.</h2>
          <p>{user.email}</p>
        </div>
      </div>
      {user.role === "admin" ? (
        <>
          <ToggleButtonGroup
            exclusive
            value={resource}
            onChange={(_, value) => {
              if (value) setResource(value);
            }}
            aria-label="Manage records"
          >
            {(Object.keys(titles) as Resource[]).map((r) => (
              <ToggleButton key={r} value={r}>
                {titles[r]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <RecordManager key={resource} resource={resource} />
        </>
      ) : (
        <>
          <Alert severity="info">
            Your account has view access. Portfolio editing is available to the
            administrator.
          </Alert>
          <div className="button-row">
            <a className="button button--primary" href="/projects">
              View projects
            </a>
            <a className="button button--secondary" href="/education">
              View education
            </a>
          </div>
        </>
      )}
    </section>
  );
}
function RecordManager({ resource }: { resource: Resource }) {
  const [records, setRecords] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [values, setValues] = useState(blank);
  const [tools, setTools] = useState("");
  const [deleting, setDeleting] = useState<PortfolioRecord | null>(null);
  async function load() {
    setError("");
    setLoading(true);
    try {
      setRecords(await api<PortfolioRecord[]>(`/${resource}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load records.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    api<PortfolioRecord[]>(`/${resource}`)
      .then((data) => {
        if (active) setRecords(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [resource]);
  function open(record?: PortfolioRecord) {
    setError("");
    setEditId(record?._id || null);
    setTools(record?.tools?.join(", ") || "");
    setValues(
      record
        ? {
            ...blank,
            ...Object.fromEntries(
              Object.keys(blank).map((key) => [
                key,
                record[key as keyof PortfolioRecord] || "",
              ]),
            ),
            completion: record.completion?.slice(0, 10) || "",
          }
        : blank,
    );
    setEditor(true);
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api(`/${resource}${editId ? `/${editId}` : ""}`, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify({
          ...values,
          tools: tools
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      setEditor(false);
      setNotice(editId ? "Changes saved." : "Record created.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError("");
    try {
      await api(`/${resource}/${deleting._id}`, { method: "DELETE" });
      setDeleting(null);
      setNotice("Record deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete.");
    } finally {
      setBusy(false);
    }
  }
  function field(
    key: keyof typeof blank,
    label: string,
    required = true,
    type = "text",
    multiline = false,
  ) {
    return (
      <TextField
        key={key}
        label={label}
        type={type}
        required={required}
        fullWidth
        multiline={multiline}
        minRows={multiline ? 3 : undefined}
        value={values[key]}
        onChange={(e) => setValues({ ...values, [key]: e.target.value })}
        slotProps={{
          inputLabel: type === "date" ? { shrink: true } : undefined,
        }}
      />
    );
  }
  return (
    <div className="record-manager">
      <div className="manager-toolbar">
        <h2>{titles[resource]}</h2>
        <Button variant="contained" onClick={() => open()}>
          Add{" "}
          {resource === "qualifications"
            ? "education"
            : resource === "contacts"
              ? "contact"
              : "project"}
        </Button>
      </div>
      {notice && (
        <Alert severity="success" onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}
      {error && !editor && !deleting && (
        <Alert severity="error" action={<Button onClick={load}>Retry</Button>}>
          {error}
        </Alert>
      )}
      {loading ? (
        <p role="status">Loading records…</p>
      ) : !records.length ? (
        <p className="empty-state">No records yet. Add your first one above.</p>
      ) : (
        <div className="record-list">
          {records.map((record) => (
            <article key={record._id} className="record-row">
              <div>
                <h3>
                  {record.title || `${record.firstname} ${record.lastname}`}
                </h3>
                <p>
                  {record.email}
                  {record.completion
                    ? ` · ${record.completion.slice(0, 10)}`
                    : ""}
                </p>
                {record.description && <p>{record.description}</p>}
                {record.phone && <p>Phone: {record.phone}</p>}
                {record.message && (
                  <p className="message-copy">{record.message}</p>
                )}
              </div>
              <div className="record-actions">
                <Button
                  onClick={() => open(record)}
                  aria-label={`Edit ${record.title || record.firstname}`}
                >
                  Edit
                </Button>
                <Button
                  color="error"
                  onClick={() => {
                    setError("");
                    setDeleting(record);
                  }}
                  aria-label={`Delete ${record.title || record.firstname}`}
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Dialog
        open={editor}
        onClose={() => {
          if (!busy) setEditor(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={save}>
          <DialogTitle>
            {editId ? "Edit" : "Add"}{" "}
            {resource === "qualifications"
              ? "education"
              : resource === "contacts"
                ? "contact"
                : "project"}
          </DialogTitle>
          <DialogContent>
            <div className="editor-fields">
              {error && <Alert severity="error">{error}</Alert>}
              {resource !== "contacts" && field("title", "Title")}
              <div className="form-row">
                {field("firstname", "First name")}
                {field("lastname", "Last name")}
              </div>
              {field("email", "Email address", true, "email")}
              {resource === "contacts" ? (
                <>
                  {field("phone", "Phone", false, "tel")}
                  {field("message", "Message", false, "text", true)}
                </>
              ) : (
                <>
                  {field("completion", "Completion date", true, "date")}
                  {field("description", "Description", true, "text", true)}
                  {resource === "qualifications" ? (
                    <>
                      {field("institution", "Institution", false)}
                      {field("start", "Start date / period", false)}
                      {field("status", "Status (e.g. In progress)", false)}
                    </>
                  ) : (
                    <>
                      {field("type", "Project category", false)}
                      {field(
                        "image",
                        "Image path (e.g. /assets/projects/website-ai-chatbot.png)",
                        false,
                      )}
                      {field("roleDescription", "My role", false, "text", true)}
                      {field("outcome", "Outcome", false, "text", true)}
                      <TextField
                        label="Tools (comma separated)"
                        value={tools}
                        onChange={(e) => setTools(e.target.value)}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button disabled={busy} onClick={() => setEditor(false)}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={!!deleting}
        onClose={() => {
          if (!busy) setDeleting(null);
        }}
      >
        <DialogTitle>Delete this record?</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <p>
            “{deleting?.title || deleting?.firstname}” will be permanently
            removed.
          </p>
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={busy}
            onClick={remove}
          >
            {busy ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
