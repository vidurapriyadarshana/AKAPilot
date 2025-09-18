import type { Props } from "@/types/subjects/props";
import {
  Book,
  PlayCircle,
  Layers,
  EllipsisVertical,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useSubjectStore } from "@/store/subjectStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import AddSubjectForm from "./AddSubjectForm ";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const SubjectCard: React.FC<Props> = ({ subject }) => {
  const { removeSubject } = useSubjectStore();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="rounded-2xl border shadow-card">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{subject.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-md hover:bg-muted transition">
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
      </CardHeader>

      {/* Description */}
      <CardDescription className="px-6">{subject.description}</CardDescription>

      {/* Content */}
      <CardContent className="px-6 py-4 flex flex-col gap-3">
        {/* Priority + Difficulty */}
        <div className="flex gap-2 text-xs">
          <Badge
            variant={
              subject.priority === "HIGH"
                ? "destructive"
                : subject.priority === "MEDIUM"
                ? "secondary"
                : "outline"
            }
          >
            {subject.priority} Priority
          </Badge>
          <Badge
            variant={
              subject.difficulty === "HARD"
                ? "destructive"
                : subject.difficulty === "MEDIUM"
                ? "secondary"
                : "outline"
            }
          >
            {subject.difficulty}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Layers size={16} /> 38 Cards
          </div>
          <div className="flex items-center gap-1">
            <Book size={16} /> 6.8h Study
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="flex gap-2">
        <Button className="flex-1" variant="default">
          <PlayCircle size={16} className="mr-2" /> Study
        </Button>
        <Button className="flex-1" variant="outline">
          <Layers size={16} className="mr-2" /> Cards
        </Button>
      </CardFooter>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-md">
            <AddSubjectForm
              subject={subject}
              onSuccess={() => setEditOpen(false)}
              onClose={() => setEditOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {subject.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently remove{" "}
              <span className="font-semibold">{subject.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                removeSubject(subject.id);
                setDeleteOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SubjectCard;
