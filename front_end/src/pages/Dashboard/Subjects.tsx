import { useEffect } from "react";
import { useSubjectStore } from "../../store/subjectStore";
import SubjectCard from "../../components/subjects/SubjectCard";

const Subjects = () => {
  const { subjects, fetchSubjects } = useSubjectStore();

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
        <Button>Add Subject</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card shadow-card">Total Subjects: 6</div>
        <div className="p-4 rounded-xl bg-card shadow-card">Total Cards: 218</div>
        <div className="p-4 rounded-xl bg-card shadow-card">Study Time: 52.1h</div>
        <div className="p-4 rounded-xl bg-card shadow-card">Avg Progress: 64%</div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-3 gap-4">
        {subjects.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </div>
    </div>
  );
};

export default Subjects;
