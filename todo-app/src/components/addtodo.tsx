import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddTodo() {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Mid");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db, "todos"), {
      text,
      completed: false,
      priority,
      dueDate,
      dueTime,
      dateAdded: new Date().toISOString(), // <-- Add this line
    });
    setText("");
    setPriority("Mid");
    setDueDate("");
    setDueTime("");
  };

  return (
  <form
    onSubmit={handleSubmit}
    className="mb-4 flex flex-col sm:flex-col items-start gap-3"
  >
    <input
      value={text}
      onChange={e => setText(e.target.value)}
      placeholder="Add a todo"
      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-400"
      required
    />

    <label className="flex flex-col w-full">
      <span className="mb-1 text-sm font-medium text-gray-700">Priority</span>
      <select
        required
        value={priority}
        onChange={e => setPriority(e.target.value)}
        className="px-3 py-2 border rounded"
      >
        <option value="High">High</option>
        <option value="Mid">Mid</option>
        <option value="Low">Low</option>
      </select>
    </label>

    <label className="flex flex-col w-full">
      <span className="mb-1 text-sm font-medium text-gray-700">Due Date</span>
      <input
        required
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="px-3 py-2 border rounded"
      />
    </label>

    <label className="flex flex-col w-full">
      <span className="mb-1 text-sm font-medium text-gray-700">Due Time</span>
      <input
        required
        type="time"
        value={dueTime}
        onChange={e => setDueTime(e.target.value)}
        className="px-3 py-2 border rounded"
      />
    </label>

    <button
      type="submit"
      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition w-full sm:w-[100%]"
    >
      Add
    </button>
  </form>
);
}