import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import TodoItem from "./todoitem";
import AddTodo from "./addtodo";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <span role="img" aria-label="todo">📝</span> Todo List
      </h2>
      <AddTodo />
      <ul className="list-none p-0 m-0">
        {todos.length === 0 ? (
          <li className="text-gray-400 text-center mt-6">
            No todos yet. Add one!
          </li>
        ) : (
          todos.map(todo => (
            <TodoItem key={todo.id} {...todo} />
          ))
        )}
      </ul>
    </div>
  );
}