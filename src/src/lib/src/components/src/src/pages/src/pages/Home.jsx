import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { GAMES } from "../lib/games.js";

export default function Home() {
  const [u, setU] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      setU(snap.data());
    })();
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>TopRep</h2>
      <div style={{ opacity: 0.85 }}>
        {u ? `@${u.username} — representing ${u.schoolName}` : "Loading profile…"}
      </div>

      {GAMES.map((g) => (
        <div key={g.id} style={{ border: "1px solid #ddd", borderRadius: 16, padding: 14, display: "grid", gap: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{g.name}</div>
          <div style={{ opacity: 0.8 }}>{g.description}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to={`/play/${g.id}`} style={{ padding: "10px 12px", border: "1px solid #000", borderRadius: 12, textDecoration: "none", color: "black", fontWeight: 900 }}>
              Play
            </Link>
            <Link to={`/leaderboard/${g.id}`} style={{ padding: "10px 12px", border: "1px solid #ccc", borderRadius: 12, textDecoration: "none", color: "black", fontWeight: 800 }}>
              Leaderboard
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
