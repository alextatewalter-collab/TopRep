import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import Onboarding from "./pages/Onboarding.jsx";
import Home from "./pages/Home.jsx";
import Play from "./pages/Play.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

export default function App() {
  const [ready, setReady] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      const snap = await getDoc(doc(db, "users", u.uid));
      setHasProfile(snap.exists());
      setReady(true);
    });
    return () => unsub();
  }, []);

  if (!ready) return null;

  return (
    <Routes>
      <Route path="/" element={hasProfile ? <Navigate to="/home" /> : <Navigate to="/setup" />} />
      <Route path="/setup" element={<Onboarding onDone={() => setHasProfile(true)} />} />
      <Route path="/home" element={hasProfile ? <Home /> : <Navigate to="/setup" />} />
      <Route path="/play/:gameId" element={hasProfile ? <Play /> : <Navigate to="/setup" />} />
      <Route path="/leaderboard/:gameId" element={hasProfile ? <Leaderboard /> : <Navigate to="/setup" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
