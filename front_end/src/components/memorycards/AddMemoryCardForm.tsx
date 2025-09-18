"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubjectStore } from "@/store/subjectStore";
import { useMemoryCardStore } from "@/store/memorycardStore";
import { toast } from "sonner";
import type { MemoryCardResponse } from "@/types/memorycards";

interface Props {
  onSuccess?: () => void;
  memoryCard?: MemoryCardResponse; // optional for edit mode
}

const AddMemoryCardForm: React.FC<Props> = ({ onSuccess, memoryCard }) => {
  const { subjects, fetchSubjects } = useSubjectStore();
  const { addMemoryCard, editMemoryCard } = useMemoryCardStore();

  const [front, setFront] = useState(memoryCard?.front || "");
  const [back, setBack] = useState(memoryCard?.back || "");
  const [status, setStatus] = useState(memoryCard?.status || "NEW");
  const [deadline, setDeadline] = useState(memoryCard?.deadline || "");
  const [subjectId, setSubjectId] = useState<number | null>(memoryCard?.subjectId || null);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      toast.error("Please select a subject");
      return;
    }

    const cardData = {
      id: memoryCard?.id || 0,
      front,
      back,
      status,
      deadline,
      subjectId,
    };

    try {
      if (memoryCard) {
        await editMemoryCard(memoryCard.id, cardData);
        toast.success("Memory card updated!");
      } else {
        await addMemoryCard(cardData);
        toast.success("Memory card added!");
      }

      if (onSuccess) onSuccess();

      // Reset form only if adding a new card
      if (!memoryCard) {
        setFront("");
        setBack("");
        setStatus("NEW");
        setDeadline("");
        setSubjectId(null);
      }
    } catch {
      toast.error("Failed to save memory card");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question (Front) */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="front" className="text-sm font-medium text-gray-700">
          Question (Front)
        </Label>
        <Textarea
          id="front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Enter the question"
          className="min-h-[80px] p-3"
          required
        />
      </div>

      {/* Answer (Back) */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="back" className="text-sm font-medium text-gray-700">
          Answer (Back)
        </Label>
        <Textarea
          id="back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Enter the answer"
          className="min-h-[80px] p-3"
          required
        />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
          Status
        </Label>
        <Select
          value={status}
          onValueChange={(val) =>
            setStatus(val as "NEW" | "LEARNING" | "REVIEW" | "MASTERED")
          }
        >
          <SelectTrigger className="p-2">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="LEARNING">Learning</SelectItem>
            <SelectItem value="REVIEW">Review</SelectItem>
            <SelectItem value="MASTERED">Mastered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deadline */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">
          Deadline
        </Label>
        <Input
          type="datetime-local"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="p-2"
          required
        />
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
          Subject
        </Label>
        <Select
          value={subjectId ? String(subjectId) : ""}
          onValueChange={(subjectId) => setSubjectId(Number(subjectId))}
        >
          <SelectTrigger className="p-2">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full py-3 mt-4">
        {memoryCard ? "Update Memory Card" : "Add Memory Card"}
      </Button>
    </form>
  );
};

export default AddMemoryCardForm;
