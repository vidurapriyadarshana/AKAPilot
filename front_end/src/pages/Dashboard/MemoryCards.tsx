import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemoryCardStore } from "@/store/memorycardStore";
import { useCardReviewStore } from "@/store/cardReviewStore";
import { useSubjectStore } from "@/store/subjectStore";
import AddMemoryCardForm from "@/components/memorycards/AddMemoryCardForm";
import { BookOpen, Clock, CheckCircle, TrendingUp, Brain, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { MemoryCard } from "@/types/memorycards";
import type { CardReview } from "@/types/cardReview";

const MemoryCards = () => {
  const { memoryCards, fetchMemoryCards, loading, error } = useMemoryCardStore();
  const { cardReviews, fetchCardReviewsForUser, addCardReview, fetchReviewSummary } = useCardReviewStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewCard, setReviewCard] = useState<MemoryCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchMemoryCards();
    fetchCardReviewsForUser();
    fetchSubjects();
    fetchReviewSummary();
  }, [fetchMemoryCards, fetchCardReviewsForUser, fetchSubjects, fetchReviewSummary]);

  // Helper functions
  const getSubjectName = (subjectId: number): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || "Unknown Subject";
  };

  const getSubjectColor = (subjectId: number): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || "#6b7280";
  };

  const getCardReviews = (cardId: number): CardReview[] => {
    return cardReviews.filter(review => review.memoryCardId === cardId);
  };

  const getCardSuccessRate = (cardId: number): number => {
    const reviews = getCardReviews(cardId);
    if (reviews.length === 0) return 0;
    const successful = reviews.filter(review => review.success).length;
    return Math.round((successful / reviews.length) * 100);
  };

  const getCardAttempts = (cardId: number): number => {
    return getCardReviews(cardId).length;
  };

  // Statistics calculations
  const totalCards = memoryCards.length;
  const dueToday = memoryCards.filter(card => {
    if (!card.deadline) return false;
    const today = new Date().toDateString();
    const deadline = new Date(card.deadline).toDateString();
    return deadline === today;
  }).length;
  const mastered = memoryCards.filter(card => card.status === "MASTERED").length;
  const avgSuccess = cardReviews.length > 0 
    ? Math.round((cardReviews.filter(review => review.success).length / cardReviews.length) * 100)
    : 0;

  // Review queue (cards that need review)
  const reviewQueue = memoryCards.filter(card => 
    card.status === "NEW" || card.status === "LEARNING" || card.status === "REVIEW"
  );

  // Handle card review
  const handleCardClick = (card: MemoryCard) => {
    setReviewCard(card);
    setShowAnswer(false);
  };

  const handleAnswerReveal = () => {
    setShowAnswer(true);
  };

  const handleReviewSubmit = async (success: boolean) => {
    if (!reviewCard) return;

    try {
      const reviewData: CardReview = {
        memoryCardId: reviewCard.id,
        success: success
      };
      
      await addCardReview(reviewData);
      toast.success(success ? "Correct! Well done!" : "Keep practicing!");
      
      // Refresh data
      fetchCardReviewsForUser();
      fetchReviewSummary();
      
      // Close review
      setReviewCard(null);
      setShowAnswer(false);
    } catch (error) {
      toast.error("Failed to save review");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Memory Cards</h1>
          <p className="text-muted-foreground">
            Organize and manage your study subjects
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add Memory Card</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
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
                <p className="text-sm text-muted-foreground">Due Today</p>
                <p className="text-2xl font-bold">{dueToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Mastered</p>
                <p className="text-2xl font-bold">{mastered}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Success</p>
                <p className="text-2xl font-bold">{avgSuccess}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error + Loading */}
      {loading && <p>Loading memory cards...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Review Queue and All Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Review Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviewQueue.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No cards to review</p>
              ) : (
                reviewQueue.map((card) => (
                  <div 
                    key={card.id} 
                    className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{card.front}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getSubjectName(card.subjectId)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            style={{ 
                              borderColor: getSubjectColor(card.subjectId),
                              color: getSubjectColor(card.subjectId)
                            }}
                          >
                            {getSubjectName(card.subjectId)}
                          </Badge>
                          <Badge 
                            variant={card.status === "NEW" ? "secondary" : card.status === "LEARNING" ? "default" : "destructive"}
                          >
                            {card.status}
                          </Badge>
                          {getCardAttempts(card.id) > 0 && (
                            <Badge variant="outline">
                              {getCardSuccessRate(card.id)}% ({getCardAttempts(card.id)} attempts)
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* All Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              All Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {memoryCards.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No memory cards</p>
              ) : (
                memoryCards.map((card) => (
                  <div 
                    key={card.id} 
                    className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{card.front}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getSubjectName(card.subjectId)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            style={{ 
                              borderColor: getSubjectColor(card.subjectId),
                              color: getSubjectColor(card.subjectId)
                            }}
                          >
                            {getSubjectName(card.subjectId)}
                          </Badge>
                          <Badge 
                            variant={card.status === "NEW" ? "secondary" : card.status === "LEARNING" ? "default" : card.status === "REVIEW" ? "destructive" : "default"}
                          >
                            {card.status}
                          </Badge>
                          {getCardAttempts(card.id) > 0 && (
                            <Badge variant="outline">
                              {getCardSuccessRate(card.id)}% ({getCardAttempts(card.id)} attempts)
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Memory Card Modal */}
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
            <AddMemoryCardForm onSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Card Review Modal */}
      {reviewCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-2xl shadow-card relative w-full max-w-lg">
            <button
              onClick={() => {
                setReviewCard(null);
                setShowAnswer(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Memory Card Review</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: getSubjectColor(reviewCard.subjectId),
                      color: getSubjectColor(reviewCard.subjectId)
                    }}
                  >
                    {getSubjectName(reviewCard.subjectId)}
                  </Badge>
                  <Badge 
                    variant={reviewCard.status === "NEW" ? "secondary" : reviewCard.status === "LEARNING" ? "default" : reviewCard.status === "REVIEW" ? "destructive" : "default"}
                  >
                    {reviewCard.status}
                  </Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Question:</h4>
                <p className="text-lg">{reviewCard.front}</p>
              </div>

              {!showAnswer ? (
                <Button onClick={handleAnswerReveal} className="w-full">
                  Show Answer
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium mb-2">Answer:</h4>
                    <p className="text-lg">{reviewCard.back}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleReviewSubmit(false)} 
                      variant="destructive" 
                      className="flex-1"
                    >
                      Incorrect
                    </Button>
                    <Button 
                      onClick={() => handleReviewSubmit(true)} 
                      variant="default" 
                      className="flex-1"
                    >
                      Correct
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryCards;
