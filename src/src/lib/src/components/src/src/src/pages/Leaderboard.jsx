import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { getGame } from "../lib/games.js";

export default function Leaderboard() {
  const { gameId } = useParams();
  const game = useMemo(() => getGame(gameId), [gameId]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, "scores"),
        where("gameId", "==", gameId),
        orderBy("score", "desc"),
        limit(50)
      );
      const snap = await getDocs(q);
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, [gameId]);

  const top = rows[0];

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{game ? `${game.name} Leaderboard` : "Leaderboard"}</h2>
        <Link to="/home">Home</Link>
      </div>

      {top ? (
        <div style={{ border: "1px solid #000", borderRadius: 16, padding: 14 }}>
          <div style={{ fontWeight: 900 }}>🏆 Record Holder</div>
          <div style={{ fontSize: 22, fontWeight: 1000 }}>{top.score} pts</div>
          <div>@{top.username} — {top.schoolName}</div>
        </div>
      ) : (
        <div style={{ opacity: 0.7 }}>No scores yet.</div>
      )}

      <div style={{ border: "1px solid #ddd", borderRadius: 16, overflow: "hidden" }}>
        {rows.map((r, i) => (
          <div key={r.id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
            <div style={{ fontWeight: 900 }}>{i + 1}. {r.score} — @{r.username}</div>
            <div style={{ opacity: 0.8 }}>{r.schoolName}</div>
          </div>
        ))}
      </div>

      <Link to={`/play/${gameId}`}>Play again</Link>
    </div>
  );
}
