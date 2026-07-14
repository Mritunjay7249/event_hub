import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { Review } from '../types';
import { cn } from '../utils';

interface ReviewSectionProps {
  eventId: string;
  userId: string;
  userName: string;
}

export default function ReviewSection({ eventId, userId, userName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${eventId}`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          user_id: userId,
          rating,
          comment
        })
      });

      if (res.ok) {
        setComment('');
        setRating(5);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'New';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
            <Star size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Ratings & Reviews</h3>
            <p className="text-xs text-gray-500">{reviews.length} reviews • Average {averageRating}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={cn(
                "p-1 transition-all hover:scale-110",
                star <= rating ? "text-amber-500" : "text-gray-300"
              )}
            >
              <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
            </button>
          ))}
          <span className="ml-2 text-sm font-bold text-gray-600">{rating} / 5</span>
        </div>

        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
            rows={3}
          />
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 rounded-2xl border border-gray-50 bg-white space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{review.user_name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        className={i < review.rating ? "text-amber-500" : "text-gray-200"} 
                        fill={i < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-10">
              {review.comment}
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare size={20} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
