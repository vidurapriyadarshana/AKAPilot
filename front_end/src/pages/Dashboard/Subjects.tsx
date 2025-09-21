import { useEffect, useState } from "react";
import { useSubjectStore } from "@/store/subjectStore";
import { useMemoryCardStore } from "@/store/memorycardStore";
import { useStudySessionStore } from "@/store/studysessionStore";
import { useCardReviewStore } from "@/store/cardReviewStore";
import SubjectCard from "@/components/subjects/SubjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AddSubjectForm from "@/components/subjects/AddSubjectForm ";
import { BookOpen, Clock, TrendingUp, Brain } from "lucide-react";

const Subjects = () => {
  const { subjects, fetchSubjects, loading, error } = useSubjectStore();
  const { memoryCards, fetchMemoryCards } = useMemoryCardStore();
  const { sessions, fetchSessions } = useStudySessionStore();
  const { cardReviews, fetchCardReviewsForUser } = useCardReviewStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchMemoryCards();
    fetchSessions();
    fetchCardReviewsForUser();
  }, [fetchSubjects, fetchMemoryCards, fetchSessions, fetchCardReviewsForUser]);

  // Helper functions
  const getCardsForSubject = (subjectId: number) => {
    return memoryCards.filter(card => card.subjectId === subjectId);
  };

  const getStudyTimeForSubject = (subjectId: number): number => {
    const subjectSessions = sessions.filter(session => session.subjectId === subjectId);
    return subjectSessions.reduce((total, session) => {
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);
      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes
      return total + duration;
    }, 0);
  };

  const getProgressForSubject = (subjectId: number): number => {
    const subjectCards = getCardsForSubject(subjectId);
    if (subjectCards.length === 0) return 0;
    
    const subjectCardIds = subjectCards.map(card => card.id);
    const subjectReviews = cardReviews.filter(review => subjectCardIds.includes(review.memoryCardId));
    
    if (subjectReviews.length === 0) return 0;
    
    const successfulReviews = subjectReviews.filter(review => review.success).length;
    return Math.round((successfulReviews / subjectReviews.length) * 100);
  };

  // Statistics calculations
  const totalSubjects = subjects.length;
  const totalCards = memoryCards.length;
  const totalStudyTime = sessions.reduce((total, session) => {
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // hours
    return total + duration;
  }, 0);
  const avgProgress = cardReviews.length > 0 
    ? Math.round((cardReviews.filter(review => review.success).length / cardReviews.length) * 100)
    : 0;

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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Subjects</p>
                <p className="text-2xl font-bold">{totalSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Cards</p>
                <p className="text-2xl font-bold">{totalCards}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="text-2xl font-bold">{totalStudyTime.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{avgProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error + Loading */}
      {loading && <p>Loading subjects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Subjects Grid */}
      <div className="grid grid-cols-3 gap-4">
        {subjects.map((s) => (
          <SubjectCard 
            key={s.id} 
            subject={s} 
            cardsCount={getCardsForSubject(s.id).length}
            studyTime={getStudyTimeForSubject(s.id) / 60} // Convert minutes to hours
            progress={getProgressForSubject(s.id)}
          />
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
