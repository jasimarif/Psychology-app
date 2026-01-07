import { useState, useEffect } from "react"
import { Star, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { reviewService } from "@/services/reviewService"
import { PsychologistsIcon } from "@/components/icons/DuoTuneIcons"

const ReviewsList = ({ psychologistId, initialRating = 0, initialReviewCount = 0 }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: initialReviewCount,
    hasMore: false
  })
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
  const [averageRating, setAverageRating] = useState(initialRating)

  useEffect(() => {
    if (psychologistId) {
      loadReviews(1)
    }
  }, [psychologistId])

  const loadReviews = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true)
      } else {
        setReviewsLoading(true)
      }

      const data = await reviewService.getReviewsByPsychologist(psychologistId, page, 3)
      
      setReviews(data.reviews)
      
      setPagination(data.pagination)
      setRatingDistribution(data.ratingDistribution)
      setAverageRating(data.averageRating)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
      setReviewsLoading(false)
    }
  }

  const handlePageChange = (page) => {
    loadReviews(page)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (name) => {
    if (!name) return 'A'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const renderStars = (rating, size = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="rounded-2xl border-0 shadow-none bg-lightGray">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-customGreen" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-0 shadow-none bg-lightGray">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 select-none" />
          Reviews & Ratings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {pagination.totalReviews === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-6 p-4 bg-white rounded-xl select-none">
              {/* Average Rating */}
              <div className="text-center md:w-40 flex-shrink-0">
                <div className="text-5xl font-bold text-customGreen mb-2 font-averia">
                  {averageRating.toFixed(1)}
                </div>
                <div className="mb-2">
                  {renderStars(Math.round(averageRating), "w-5 h-5")}
                </div>
                <p className="text-sm text-gray-500">
                  {pagination.totalReviews} review{pagination.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating] || 0
                  const percentage = pagination.totalReviews > 0 
                    ? (count / pagination.totalReviews) * 100 
                    : 0

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm text-gray-600">{rating}</span>
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress 
                        value={percentage} 
                        className="flex-1 h-2 bg-gray-200"
                      />
                      <span className="text-sm text-gray-500 w-8">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-customGreen" />
                </div>
              ) : (
                reviews.map((review) => (
                  <div 
                    key={review._id} 
                    className="p-4 bg-white rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 select-none">
                        <AvatarFallback className="bg-customGreen/10 text-customGreen text-sm font-medium">
                          {review.isAnonymous ? 'A' : getInitials(review.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-700">
                            {review.isAnonymous ? 'Anonymous' : review.userName}
                          </h4>
                          <span className="text-xs text-gray-400 select-none">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <div className="mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {review.reviewText}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                        className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer text-gray-700"}
                      />
                    </PaginationItem>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === pagination.currentPage}
                          className="cursor-pointer shadow-none "
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                        className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer text-gray-700"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ReviewsList
