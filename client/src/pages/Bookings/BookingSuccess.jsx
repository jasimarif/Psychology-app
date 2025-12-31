import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { getCheckoutSession } from "@/services/paymentService"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { CheckIcon, CalendarIcon, MailIcon, Loader2, Sparkles, Clock, ArrowRight } from "lucide-react"

const BookingSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get("session_id")

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails()
    } else {
      setError("No session ID provided")
      setLoading(false)
    }
  }, [sessionId])

  const fetchSessionDetails = async () => {
    try {
      const data = await getCheckoutSession(sessionId)
      setSession(data.session)
      setBooking(data.booking)
    } catch (err) {
      setError(err.message || "Failed to retrieve payment details")
    } finally {
      setLoading(false)
    }
  }

  const handleViewBookings = () => {
    setModalOpen(false)
    navigate("/my-bookings")
  }

  const handleBookAnother = () => {
    setModalOpen(false)
    navigate("/browse-psychologists")
  }

  const handleModalClose = (open) => {
    if (!open) {
      navigate("/my-bookings")
    }
    setModalOpen(open)
  }

  // Loading state modal
  if (loading) {
    return (
      <Dialog open={modalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-customGreen/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="relative w-16 h-16 text-customGreen animate-spin" />
            </div>
            <p className="text-gray-600 mt-6 text-lg font-medium">Verifying your payment...</p>
            <p className="text-gray-400 text-sm mt-2">This will only take a moment</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Error state modal
  if (error) {
    return (
      <Dialog open={modalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">😔</span>
            </div>
            <DialogTitle className="text-xl text-red-600">Payment Verification Failed</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {error}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleBookAnother}
              variant="outline"
              className="flex-1"
            >
              Browse Psychologists
            </Button>
            <Button
              onClick={handleViewBookings}
              className="flex-1 bg-customGreen hover:bg-customGreenHover"
            >
              My Bookings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Success state modal
  return (
    <Dialog open={modalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
        {/* Success Header with gradient background */}
        <div className="relative bg-gradient-to-br from-customGreen via-emerald-500 to-teal-500 px-6 py-8 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

          {/* Animated success icon */}
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-lg animate-pulse" />
            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CheckIcon className="w-10 h-10 text-customGreen animate-[bounce_1s_ease-in-out]" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
          </div>

          <h2 className="text-2xl font-bold text-white mt-4">Payment Successful!</h2>
          <p className="text-white/90 mt-2">Your therapy session has been confirmed</p>

          {/* Amount badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mt-4">
            <span className="text-white/80 text-sm">Amount paid:</span>
            <span className="text-white font-bold text-lg">
              ${(session?.amount_total / 100).toFixed(2)} {session?.currency?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Booking ID Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Booking ID</p>
                <p className="font-mono text-gray-900 mt-1">{booking?.id}</p>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  {booking?.status?.toUpperCase()}
                </span>
              </div>
            </div>
            {booking?.paidAt && (
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Paid on {new Date(booking.paidAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid gap-3">
            {/* Email notification */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MailIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900 text-sm">Check Your Email</p>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  Confirmation with session details and Zoom link sent to your inbox.
                </p>
              </div>
            </div>

            {/* Calendar reminder */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-900 text-sm">Join 5 Minutes Early</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Test your audio and video before the session starts.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleViewBookings}
              className="flex-1 bg-customGreen hover:bg-customGreenHover h-12 text-base font-semibold shadow-lg shadow-customGreen/25 transition-all hover:shadow-xl hover:shadow-customGreen/30 hover:-translate-y-0.5"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              View My Bookings
            </Button>
            <Button
              onClick={handleBookAnother}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold border-2 hover:bg-gray-50 transition-all hover:-translate-y-0.5 group"
            >
              Book Another Session
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookingSuccess
