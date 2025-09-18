import { useEffect, useState } from "react";
import { useSubjectStore } from "@/store/subjectStore";
import SubjectCard from "@/components/subjects/SubjectCard";
import { Button } from "@/components/ui/button";
import AddSubjectForm from "@/components/subjects/AddSubjectForm ";

const Subjects = () => {
  const { subjects, fetchSubjects, loading, error } = useSubjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">
            Organize and manage your study subjects
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add Subject</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card shadow-card">
          Total Subjects: {subjects. length}
        </div>
        <div className="p-4 rounded-xl bg-card shadow-card">Total Cards: 218</div>
        <div className="p-4 rounded-xl bg-card shadow-card">Study Time: 52.1h</div>
        <div className="p-4 rounded-xl bg-card shadow-card">Avg Progress: 64%</div>
      </div>

      {/* Error + Loading */}
      {loading && <p>Loading subjects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Subjects Grid */}
      <div className="grid grid-cols-3 gap-4">
        {subjects.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-2xl shadow-card relative w-full max-w-md">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            {/* Pass onSuccess to close popup after adding */}
            <AddSubjectForm onSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
