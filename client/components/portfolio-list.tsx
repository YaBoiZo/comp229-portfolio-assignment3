"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Alert, Button, CircularProgress } from "@mui/material";
import { api, PortfolioRecord } from "@/lib/api";
export function PortfolioList({
  resource,
}: {
  resource: "projects" | "qualifications";
}) {
  const [records, setRecords] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
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
  if (loading)
    return (
      <p role="status">
        <CircularProgress size={20} /> Loading{" "}
        {resource === "projects" ? "projects" : "education"}…
      </p>
    );
  if (error)
    return (
      <Alert severity="error" action={<Button onClick={load}>Retry</Button>}>
        {error}
      </Alert>
    );
  if (!records.length)
    return (
      <p className="empty-state">
        No {resource === "projects" ? "projects" : "qualifications"} added yet.
      </p>
    );
  if (resource === "qualifications")
    return (
      <section className="timeline">
        {records.map((r) => (
          <article key={r._id}>
            <span>
              {r.start ? `${r.start} — ` : ""}
              {r.completion && new Date(r.completion).getUTCFullYear()}
            </span>
            <div>
              <p className="timeline__status">{r.status}</p>
              <h2>{r.title}</h2>
              <p>{r.institution}</p>
              <p>{r.description}</p>
            </div>
          </article>
        ))}
      </section>
    );
  return (
    <section className="card-grid">
      {records.map((r, i) => (
        <article className="project-card" key={r._id}>
          <div className="project-card__visual">
            {r.image && (
              <Image
                src={r.image}
                alt={`${r.title} project illustration`}
                fill
                loading={i === 0 ? "eager" : "lazy"}
                sizes="(max-width: 820px) 100vw, 33vw"
              />
            )}
            <span>{String(i + 1).padStart(2, "0")}</span>
          </div>
          <p className="eyebrow">{r.type || "Selected work"}</p>
          <h2>{r.title}</h2>
          <p>{r.description}</p>
          <dl className="project-card__details">
            {r.roleDescription && (
              <div>
                <dt>My role</dt>
                <dd>{r.roleDescription}</dd>
              </div>
            )}
            {r.outcome && (
              <div>
                <dt>Outcome</dt>
                <dd>{r.outcome}</dd>
              </div>
            )}
          </dl>
          <ul className="tag-list">
            {r.tools?.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
