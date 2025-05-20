import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

type TodoItemProps = {
  id: string;
  text: string;
  completed: boolean;
};

export default function TodoItem({ id, text, completed }: TodoItemProps) {
  const toggleComplete = async () => {
    await updateDoc(doc(db, "todos", id), { completed: !completed });
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <li>
      <input type="checkbox" checked={completed} onChange={toggleComplete} />
      <span style={{ textDecoration: completed ? "line-through" : "" }}>{text}</span>
      <button onClick={handleDelete} style={{ marginLeft: 8 }}>Delete</button>
    </li>
  );
}