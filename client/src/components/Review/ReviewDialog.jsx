import { useState } from "react"
import { Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { reviewService } from "@/services/reviewService"
import { PsychologistsIcon } from "@/components/icons/DuoTuneIcons"
import { formatDateOnly } from "@/lib/timezone"

const ReviewDialog = ({ 
  open, 
  onOpenChange, 
  booking,
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (reviewText.trim().length < 10) {
      setError("Please write at least 10 characters for your review")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await reviewService.createReview({
        bookingId: booking._id,
        rating,
        reviewText: reviewText.trim(),
        isAnonymous
      })

      toast.success("Review submitted!", {
        description: "Thank you for sharing your feedback."
      })

      // Reset form
      setRating(0)
      setReviewText("")
      setIsAnonymous(false)
      
      onOpenChange(false)
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (err) {
      setError(err.message)
      toast.error("Failed to submit review", {
        description: err.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setReviewText("")
    setIsAnonymous(false)
    setError("")
    onOpenChange(false)
  }

  const getRatingLabel = (rating) => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    }
    return labels[rating] || ""
  }

  if (!booking) return null

  const psychologist = booking.psychologistId

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg font-nunito select-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-700">
            Rate Your Session
          </DialogTitle>
          <DialogDescription className="text-customGray">
            Share your experience to help others find the right therapist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Psychologist Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <Avatar className="w-14 h-14">
              <AvatarImage src={psychologist?.profileImage} alt={psychologist?.name} />
              <AvatarFallback className="bg-customGreen/10">
                <PsychologistsIcon className="w-6 h-6 text-customGreen" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-700">{psychologist?.name}</h3>
              <p className="text-sm text-customGray">{psychologist?.title}</p>
              <p className="text-xs text-customGray mt-1">
                Session on {formatDateOnly(booking.appointmentDate, 'medium')}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-3">How was your experience?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoverRating || rating) > 0 && (
              <p className="text-sm text-customGreen font-medium mt-2">
                {getRatingLabel(hoverRating || rating)}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review" className="text-sm font-medium text-gray-700">
              Your Review
            </Label>
            <Textarea
              id="review"
              placeholder="Share your experience with this therapist... What did you find helpful? Would you recommend them to others?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[120px] resize-none rounded-xl border-gray-200 focus:border-customGreen focus:ring-customGreen"
              maxLength={1000}
            />
            <p className="text-xs text-customGray text-right">
              {reviewText.length}/1000 characters
            </p>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              className="border-gray-300 data-[state=checked]:bg-customGreen data-[state=checked]:border-customGreen"
            />
            <Label 
              htmlFor="anonymous" 
              className="text-sm text-customGray cursor-pointer"
            >
              Post anonymously (your name won't be shown)
            </Label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="rounded-xl cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || reviewText.trim().length < 10}
            className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewDialog
