import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getGame } from "../lib/games.js";

export default function Play() {
  const { gameId } = useParams();
  const game = useMemo(() => getGame(gameId), [gameId]);
  const nav = useNavigate();

  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef(null);

  useEffect(() => () => timerRef.current && clearInterval(timerRef.current), []);

  if (!game) return <div style={{ padding: 16 }}>Unknown game.</div>;

  const isSpeedTap = gameId === "speed_tap";

  function start() {
    setScore(0);
    setTimeLeft(20);
    setRunning(true);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  async function submit() {
    const uSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const u = uSnap.data();

    await addDoc(collection(db, "scores"), {
      uid: auth.currentUser.uid,
      username: u.username,
      schoolId: u.schoolId,
      schoolName: u.schoolName,
      gameId,
      score,
      createdAt: serverTimestamp(),
    });

    nav(`/leaderboard/${gameId}`);
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{game.name}</h2>
        <Link to="/home">Home</Link>
      </div>

      {isSpeedTap ? (
        <>
          <div style={{ display: "flex", gap: 12, fontWeight: 900 }}>
            <div>Time: {timeLeft}s</div>
            <div>Score: {score}</div>
          </div>

          {!running ? (
            <button onClick={start} style={{ padding: 12, borderRadius: 12, border: "1px solid #000", background: "white", fontWeight: 900 }}>
              Start
            </button>
          ) : (
            <button
              onClick={() => setScore((s) => s + 1)}
              style={{ padding: 28, borderRadius: 18, border: "2px solid #000", background: "white", fontWeight: 1000, fontSize: 18 }}
            >
              CLICK!
            </button>
          )}

          {!running && timeLeft === 0 ? (
            <button onClick={submit} style={{ padding: 12, borderRadius: 12, border: "1px solid #000", background: "white", fontWeight: 900 }}>
              Submit score
            </button>
          ) : null}
        </>
      ) : (
        <div style={{ border: "1px solid #ddd", borderRadius: 16, padding: 14 }}>
          This game isn’t implemented in this clean redo yet. (Speed Tap works.)
        </div>
      )}
    </div>
  );
}
