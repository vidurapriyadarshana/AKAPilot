import { useState, useEffect } from "react";
import { useSubjectStore } from "@/store/subjectStore";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // icon for close
import type { Subject } from "@/types/subject";

interface AddSubjectFormProps {
  subject?: Subject; // optional, for editing
  onSuccess?: () => void;
  onClose?: () => void; // replaces cancel
}

const AddSubjectForm: React.FC<AddSubjectFormProps> = ({ subject, onSuccess, onClose }) => {
  const { addSubject, editSubject } = useSubjectStore();

  const [name, setName] = useState(subject?.name || "");
  const [color, setColor] = useState(subject?.color || "#FF5733");
  const [description, setDescription] = useState(subject?.description || "");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(subject?.difficulty || "MEDIUM");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(subject?.priority || "MEDIUM");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setColor(subject.color);
      setDescription(subject.description);
      setDifficulty(subject.difficulty);
      setPriority(subject.priority);
    }
  }, [subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const subjectData: Subject = {
      id: subject?.id || 0,
      name,
      color,
      description,
      difficulty,
      priority,
    };

    if (subject) {
      await editSubject(subject.id, subjectData);
    } else {
      await addSubject(subjectData);
    }

    setLoading(false);
    if (onSuccess) onSuccess();

    if (!subject) {
      setName("");
      setColor("#FF5733");
      setDescription("");
      setDifficulty("MEDIUM");
      setPriority("MEDIUM");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative p-6 rounded-2xl bg-card shadow-card flex flex-col gap-4 max-w-md mx-auto"
    >
      {/* ❌ Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
      )}

      <h2 className="text-xl font-semibold text-center">
        {subject ? "Edit Subject" : "Add Subject"}
      </h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded-lg border border-gray-300"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-10 p-1 rounded-lg border border-gray-300"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 rounded-lg border border-gray-300"
          rows={3}
          required
        />
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}
            className="p-2 rounded-lg border border-gray-300"
          >
            <option>EASY</option>
            <option>MEDIUM</option>
            <option>HARD</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
            className="p-2 rounded-lg border border-gray-300"
          >
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full mt-4" variant="default" disabled={loading}>
        {loading ? (subject ? "Updating..." : "Adding...") : subject ? "Update Subject" : "Add Subject"}
      </Button>
    </form>
  );
};

export default AddSubjectForm;
