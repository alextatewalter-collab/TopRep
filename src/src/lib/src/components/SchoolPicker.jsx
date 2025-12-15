import React, { useMemo, useState } from "react";

export default function SchoolPicker({ schools, value, onChange }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return schools.slice(0, 50);
    return schools
      .filter((x) => `${x.name} ${x.region}`.toLowerCase().includes(s))
      .slice(0, 50);
  }, [schools, q]);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search your school (name or region)…"
        style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
      />

      <div style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: 12,
              border: "none",
              borderBottom: "1px solid #eee",
              background: value?.id === s.id ? "#f2f2f2" : "white",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 800 }}>{s.name}</div>
            <div style={{ opacity: 0.7 }}>{s.region}</div>
          </button>
        ))}
        {filtered.length === 0 ? <div style={{ padding: 12, opacity: 0.7 }}>No matches.</div> : null}
      </div>
    </div>
  );
}
