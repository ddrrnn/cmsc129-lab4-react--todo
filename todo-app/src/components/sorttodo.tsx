import React from "react";

type SortOption = "dateAdded" | "dueDate" | "priority";

interface SortTodosProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortTodos({ value, onChange }: SortTodosProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Sort by:</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as SortOption)}
        className="px-3 py-2 border rounded"
      >
        <option value="dateAdded">Date Added</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
}