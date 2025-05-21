import { useState } from "react";
import { doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import EditTaskDialog from "./edittask";
import DeleteConfirmDialog from "./deletedialog";

type TodoItemProps = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  priority?: string;
  dateAdded?: string;
  onDelete: () => void;
};

function getPriorityColor(priority: string | undefined) {
  if (priority === "High") return "bg-red-500";
  if (priority === "Mid") return "bg-yellow-400";
  if (priority === "Low") return "bg-green-500";
  return "bg-gray-300";
}

export default function TodoItem({
  id,
  text,
  completed,
  dueDate,
  dueTime,
  priority = "Mid",
  dateAdded,
  onDelete,
}: TodoItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const toggleComplete = async () => {
    await updateDoc(doc(db, "todos", id), { completed: !completed });
  };

  const handleEditSave = async (
    newText: string,
    newDueDate: string,
    newDueTime: string,
    newPriority: string
  ) => {
    await updateDoc(doc(db, "todos", id), {
      text: newText,
      dueDate: newDueDate,
      dueTime: newDueTime,
      priority: newPriority,
    });
    setEditOpen(false);
  };

    
  return (
    <>
      <li className="flex items-center justify-between gap-2 py-2 px-3 mb-2 bg-gray-50 rounded hover:bg-gray-100 transition">
        <div className="flex items-center gap-3 flex-1">
          <span
            className={`w-4 h-4 rounded ${getPriorityColor(priority)} inline-block mr-2`}
            title={priority}
          ></span>
          <input
            type="checkbox"
            checked={completed}
            onChange={toggleComplete}
            className="accent-green-500 w-5 h-5"
          />
          <div>
            <span
              className={`text-lg ${
                completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {text}
            </span>
            <div className="flex flex-col gap-1 mt-1">
              {dateAdded && (
                <span className="text-xs text-gray-400">
                  Added: {dateAdded ? new Date(dateAdded).toLocaleString(undefined, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit" }) : ""}
                </span>
              )}
              {(dueDate || dueTime) && (
                <span className="text-xs text-gray-500">
                  Due: {dueDate
                    ? new Date(
                        dueDate +
                          (dueTime ? `T${dueTime.slice(0, 5)}` : "")
                      ).toLocaleString(undefined, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit" })
                    : ""}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setEditOpen(true)}
          className="text-blue-500 py-1 rounded mr-1"
        >
          Edit
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="text-red-500 py-1 rounded"
        >
          Delete
        </button>
      </li>
      <EditTaskDialog
        open={editOpen}
        initialText={text}
        initialDueDate={dueDate}
        initialDueTime={dueTime}
        initialPriority={priority}
        onSave={handleEditSave}
        onCancel={() => setEditOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onConfirm={() => {
          setDeleteOpen(false);
          onDelete();
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}