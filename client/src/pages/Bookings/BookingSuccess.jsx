import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { getCheckoutSession } from "@/services/paymentService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon, CalendarIcon, MailIcon, Loader2 } from "lucide-react"

const BookingSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get("session_id")

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState("")

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-customGreen animate-spin mb-4" />
              <p className="text-gray-600">Verifying your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Payment Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{error}</p>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/browse-psychologists")}
                variant="outline"
                className="flex-1"
              >
                Browse Psychologists
              </Button>
              <Button
                onClick={() => navigate("/my-bookings")}
                className="flex-1 bg-customGreen hover:bg-customGreenHover"
              >
                My Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Payment Successful!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Your therapy session has been confirmed
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">Payment Confirmed</p>
                <p className="text-sm text-green-700 mt-1">
                  Amount paid: ${(session?.amount_total / 100).toFixed(2)} {session?.currency?.toUpperCase()}
                </p>
                {booking?.paidAt && (
                  <p className="text-xs text-green-600 mt-1">
                    Paid on {new Date(booking.paidAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Booking Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-mono text-gray-900">{booking?.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {booking?.status?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {booking?.paymentStatus?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MailIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900">Check Your Email</p>
                <p className="text-sm text-blue-700 mt-1">
                  We've sent a confirmation email with your session details and Zoom meeting link.
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  If you don't see it, please check your spam folder.
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Important</p>
                <p className="text-sm text-amber-700 mt-1">
                  Please join the session 5 minutes early to test your audio and video.
                  A calendar invite has been sent to your email.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate("/my-bookings")}
              className="flex-1 bg-customGreen hover:bg-customGreenHover"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              View My Bookings
            </Button>
            <Button
              onClick={() => navigate("/browse-psychologists")}
              variant="outline"
              className="flex-1"
            >
              Book Another Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingSuccess
