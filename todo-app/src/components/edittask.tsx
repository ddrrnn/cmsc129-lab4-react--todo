import { useState } from "react";

type EditTaskDialogProps = {
  open: boolean;
  initialText: string;
  initialDueDate?: string;
  initialDueTime?: string;
  initialPriority?: string;
  onSave: (text: string, dueDate: string, dueTime: string, priority: string) => void;
  onCancel: () => void;
};

export default function EditTaskDialog({
  open,
  initialText,
  initialDueDate = "",
  initialDueTime = "",
  initialPriority = "Mid",
  onSave,
  onCancel,
}: EditTaskDialogProps) {
  const [text, setText] = useState(initialText);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [dueTime, setDueTime] = useState(initialDueTime);
  const [priority, setPriority] = useState(initialPriority);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4">Edit Task</h3>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
          placeholder="Task"
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        >
          <option value="High">High</option>
          <option value="Mid">Mid</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />
        <input
          type="time"
          value={dueTime}
          onChange={e => setDueTime(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(text, dueDate, dueTime, priority)}
            className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}