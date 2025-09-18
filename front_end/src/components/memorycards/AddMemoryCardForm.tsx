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

const AddMemoryCardForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
    const { subjects, fetchSubjects } = useSubjectStore();
    const { addMemoryCard } = useMemoryCardStore();

    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [status, setStatus] = useState<any>("NEW"); // default NEW
    const [deadline, setDeadline] = useState("");
    const [subjectId, setSubjectId] = useState<number | null>(null);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subjectId) {
            toast.error("Please select a subject");
            return;
        }

        const newCard = {
            id: 0, // Placeholder, backend will assign actual ID
            front,
            back,
            status,
            deadline,
            subjectId,
        };

        try {
            await addMemoryCard(newCard);
            if (onSuccess) onSuccess();
            // Reset form
            setFront("");
            setBack("");
            setStatus("NEW");
            setDeadline("");
            setSubjectId(null);
        } catch (err) {
            toast.error("Failed to add memory card");
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
                <Select value={status} onValueChange={setStatus}>
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
                    onValueChange={(val) => setSubjectId(Number(val))}
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
                Add Memory Card
            </Button>
        </form>
    );
};

export default AddMemoryCardForm;
