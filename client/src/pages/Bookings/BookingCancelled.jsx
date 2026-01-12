import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, CalendarIcon, AlertCircle } from "lucide-react"

const BookingCancelled = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const bookingId = searchParams.get("booking_id")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-orange-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Payment Cancelled
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Your payment was not completed
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cancellation Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-orange-900">Booking Not Confirmed</p>
                <p className="text-sm text-orange-700 mt-1">
                  You cancelled the payment process. Your booking has not been confirmed and no charges were made.
                </p>
                {bookingId && (
                  <p className="text-xs text-orange-600 mt-2">
                    Booking ID: <span className="font-mono">{bookingId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* What Happened */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">What Happened?</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Your booking was created but payment was not completed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>The time slot may still be available for booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>No charges were made to your payment method</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Your pending booking will be automatically cancelled</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900">Ready to Try Again?</p>
                <p className="text-sm text-blue-700 mt-1">
                  You can book the same time slot again or choose a different time that works better for you.
                </p>
              </div>
            </div>
          </div>

          {/* Common Reasons */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Common Reasons for Cancelled Payments</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Changed your mind about the booking time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Need to verify the session details first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Payment method issues or verification needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Accidentally closed the payment window</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate("/browse-psychologists")}
              className="flex-1 bg-customGreen hover:bg-customGreenHover"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Try Booking Again
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="flex-1"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Help Section */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-center text-sm text-gray-600">
              Need help?{" "}
              <a
                href="mailto:psychapp@google.com"
                className="text-customGreen hover:underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingCancelled
