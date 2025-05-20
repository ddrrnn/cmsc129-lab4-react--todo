import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddTodo() {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db, "todos"), { text, completed: false });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a todo"
      />
      <button type="submit">Add</button>
    </form>
  );
}