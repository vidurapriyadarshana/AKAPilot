import { useState } from "react";
import { useSubjectStore } from "@/store/subjectStore";
import { Button } from "@/components/ui/button";

const AddSubjectForm = () => {
  const { addSubject } = useSubjectStore();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#FF5733");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await addSubject({
      id: 0, // backend should generate ID
      name,
      color,
      description,
      difficulty,
      priority,
    });

    setLoading(false);
    setName("");
    setColor("#FF5733");
    setDescription("");
    setDifficulty("MEDIUM");
    setPriority("MEDIUM");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl bg-card shadow-card flex flex-col gap-4 max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold">Add Subject</h2>

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

      <Button type="submit" className="mt-2" variant="default" disabled={loading}>
        {loading ? "Adding..." : "Add Subject"}
      </Button>
    </form>
  );
};

export default AddSubjectForm;
