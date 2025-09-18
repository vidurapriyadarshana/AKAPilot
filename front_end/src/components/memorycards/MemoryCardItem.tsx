import type { Props } from "@/types/memorycards/props";
import React from "react";
import { Card } from "../ui/card";
import { Badge } from "@/components/ui/badge"; 
import { useSubjectStore } from "@/store/subjectStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MemoryCardItem: React.FC<Props> = ({ memorycard }) => {
  const { subjects } = useSubjectStore();
  const subject = subjects.find((s) => s.id === memorycard.subjectId);

  return (
    <Dialog>
      {/* Card acts as the trigger */}
      <DialogTrigger asChild>
        <Card className="cursor-pointer p-4 hover:shadow-lg transition flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{memorycard.front}</h2>

          {/* Status inside a Badge */}
          <Badge variant="secondary" className="w-fit">
            {memorycard.status}
          </Badge>

          <h2 className="text-sm text-gray-700">
            {subject ? subject.name : "Loading..."}
          </h2>
        </Card>
      </DialogTrigger>

      {/* Popup with the answer */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Answer</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          <h2 className="text-lg font-semibold">{memorycard.back}</h2>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemoryCardItem;
