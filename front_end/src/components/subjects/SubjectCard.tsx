import { Book, PlayCircle, Layers } from "lucide-react";
import type { Props } from "../../types/subjects/Props";


const SubjectCard: React.FC<Props> = ({ subject }) => {
  return (
    <div className="rounded-2xl shadow-card bg-card p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{subject.name}</h2>
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: subject.color }}
        />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground">{subject.description}</p>

      {/* Priority + Difficulty */}
      <div className="flex gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
          {subject.priority} Priority
        </span>
        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
          {subject.difficulty}
        </span>
      </div>

      {/* Dummy Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1">
          <Layers size={16} /> 38 Cards
        </div>
        <div className="flex items-center gap-1">
          <Book size={16} /> 6.8h Study
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button className="flex-1" variant="default">
          <PlayCircle size={16} className="mr-2" /> Study
        </Button>
        <Button className="flex-1" variant="outline">
          <Layers size={16} className="mr-2" /> Cards
        </Button>
      </div>
    </div>
  );
};

export default SubjectCard;
