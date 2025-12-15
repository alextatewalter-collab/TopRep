import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import SchoolPicker from "../components/SchoolPicker.jsx";

export default function Onboarding({ onDone }) {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [schools, setSchools] = useState([]);
  const [school, setSchool] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "schools"));
      setSchools(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  async function save() {
    const name = username.trim();
    if (!name || !school) return;

    await setDoc(doc(db, "users", auth.currentUser.uid), {
      username: name,
      schoolId: school.id,
      schoolName: school.name,
      schoolRegion: school.region,
      createdAt: serverTimestamp(),
    });

    onDone?.();
    nav("/home");
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0 }}>TopRep</h1>
      <p style={{ margin: 0, opacity: 0.8 }}>Rep your school. Beat the score.</p>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 800 }}>Username</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. PixelKing"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
        />
      </label>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 800 }}>School</div>
        <SchoolPicker schools={schools} value={school} onChange={setSchool} />
      </div>

      <button
        onClick={save}
        style={{ padding: 12, borderRadius: 12, border: "1px solid #000", background: "white", fontWeight: 900, cursor: "pointer" }}
      >
        Continue
      </button>
    </div>
  );
}
