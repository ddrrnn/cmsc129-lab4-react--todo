import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDoc, onSnapshot, QueryDocumentSnapshot, setDoc } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import TodoItem from "./todoitem";
import AddTodo from "./addtodo";
import SortTodos from "./sorttodo";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  priority?: string;
  dateAdded?: string;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [deletedTask, setDeletedTask] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"dateAdded" | "dueDate" | "priority">("dateAdded");

  const handleDelete = async (todo: any) => {
    const docRef = doc(db, "todos", todo.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDeletedTask({ id: todo.id, ...docSnap.data() });
      await deleteDoc(docRef);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } else {
      console.log("Doc does not exist for deletion");
    }
  };

  const handleUndo = async () => {
    if (deletedTask) {
      const { id, ...data } = deletedTask;
      await setDoc(doc(db, "todos", id), data);
      setShowToast(false);
      setDeletedTask(null);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "todos"), (snapshot) => {
      setTodos(
        snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[]
      );
    });
    return unsub;
  }, []);

const priorityOrder = {
  High: 1,
  Mid: 2,
  Low: 3,
};

const sortedTodos = [...todos].sort((a, b) => {
  if (sortBy === "dateAdded") return (a.dateAdded || "").localeCompare(b.dateAdded || "");
  if (sortBy === "dueDate") return (a.dueDate || "").localeCompare(b.dueDate || "");
  if (sortBy === "priority") {
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 4) -
           (priorityOrder[b.priority as keyof typeof priorityOrder] || 4);
  }
  return 0;
});

  return (
    <div className="max-w-lg w-full min-w-[400px] mx-auto mt-10 p-6 rounded-xl bg-white shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <span role="img" aria-label="todo">Todo List</span>
      </h2>
      <AddTodo />
      <SortTodos value={sortBy} onChange={setSortBy} />
      <ul className="list-none p-0 m-0">
        {sortedTodos.length === 0 ? (
          <li className="text-gray-400 text-center mt-6">
            No todos yet
          </li>
        ) : (
          sortedTodos.map(todo => (
            <TodoItem
              key={todo.id}
              {...todo}
              onDelete={() => handleDelete(todo)}
            />
          ))
        )}

        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded shadow-lg flex items-center gap-4 z-50">
            <span>Task deleted.</span>
            <button
              onClick={handleUndo}
              className="underline text-green-300 hover:text-green-400"
            >
              Undo
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}