"use client";

import type { Props } from "@/types/memorycards/props";
import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubjectStore } from "@/store/subjectStore";
import { useMemoryCardStore } from "@/store/memorycardStore";
import { useCardReviewStore } from "@/store/cardReviewStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Check, EllipsisVertical, Pencil, Trash2, X } from "lucide-react";
import AddMemoryCardForm from "./AddMemoryCardForm";
import { toast } from "sonner";
import { Button } from "../ui/button";

const MemoryCardItem: React.FC<Props> = ({ memorycard }) => {
  const { subjects, fetchSubjects } = useSubjectStore();
  const { removeMemoryCard } = useMemoryCardStore();
  const { addCardReview } = useCardReviewStore();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Fetch subjects if not already loaded
  useEffect(() => {
    if (subjects.length === 0) {
      fetchSubjects().catch(() => toast.error("Failed to load subjects"));
    }
  }, [subjects, fetchSubjects]);

  const subject = subjects.find((s) => s.id === memorycard.subjectId);

  const handleDelete = async () => {
    try {
      await removeMemoryCard(memorycard.id);
      setDeleteOpen(false);
    } catch (err) {
      toast.error("Failed to delete memory card");
    }
  };

  const handleReview = async (success: boolean) => {
    try {
      await addCardReview({
        memoryCardId: memorycard.id,
        success,
      });
      toast.success(`Marked as ${success ? "Correct" : "Incorrect"}`);
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="relative">
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted transition z-10">
            <EllipsisVertical size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil size={16} className="mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 size={16} className="mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Memory Card as modal trigger */}
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer p-4 hover:shadow-lg transition flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{memorycard.front}</h2>
            <Badge variant="secondary" className="w-fit">
              {memorycard.status}
            </Badge>
            <h2 className="text-sm text-gray-700">
              {subject ? subject.name : "Loading..."}
            </h2>
          </Card>
        </DialogTrigger>

        <DialogContent className="max-w-md rounded-2xl p-6 bg-card shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Answer</DialogTitle>
          </DialogHeader>

          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <h2 className="text-lg font-semibold">{memorycard.back}</h2>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4 mt-6">
            <Button
              variant="destructive"
              size="default"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => handleReview(false)}
            >
              <X size={18} /> Incorrect
            </Button>
            <Button
              variant="default"
              size="default"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => handleReview(true)}
            >
              <Check size={18} /> Correct
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-2xl shadow-card w-full max-w-md relative">
            <button
              onClick={() => setEditOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <AddMemoryCardForm
              memoryCard={memorycard}
              onSuccess={() => setEditOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-2xl shadow-card w-full max-w-md relative">
            <button
              onClick={() => setDeleteOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this memory card?
            </h2>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryCardItem;
