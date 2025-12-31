import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, TimeIcon, CheckIcon, AlertIcon } from "@/components/icons/DuoTuneIcons"
import { bookingService } from "@/services/bookingService"
import { createCheckoutSession } from "@/services/paymentService"
import { formatDateOnly, formatTime24to12 } from "@/lib/timezone"

const BookingModal = ({
  open,
  onOpenChange,
  psychologist
}) => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // Booking state
  const [selectedDate, setSelectedDate] = useState("")
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingNotes, setBookingNotes] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")

  // Reset state when modal opens/closes or psychologist changes
  useEffect(() => {
    if (!open) {
      setSelectedDate("")
      setSelectedSlot(null)
      setBookingNotes("")
      setBookingError("")
      setBookingSuccess(false)
      setAvailableSlots([])
    }
  }, [open])

  // Load available slots when date is selected
  useEffect(() => {
    if (selectedDate && psychologist?._id) {
      loadAvailableSlots()
    }
  }, [selectedDate, psychologist?._id])

  const loadAvailableSlots = async () => {
    if (!psychologist?._id) {
      setBookingError("Psychologist ID is missing. Please try selecting the psychologist again.")
      return
    }

    setLoadingSlots(true)
    setSelectedSlot(null)
    setBookingError("")
    try {
      const data = await bookingService.getAvailableSlots(psychologist._id, selectedDate)
      setAvailableSlots(data.availableSlots || [])
    } catch (error) {
      setBookingError(error.message)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleBookSession = async () => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    if (!psychologist?._id) {
      setBookingError("Psychologist ID is missing. Please try selecting the psychologist again.")
      return
    }

    if (!selectedSlot) {
      setBookingError("Please select a time slot")
      return
    }

    setBookingLoading(true)
    setBookingError("")

    try {
      const { url } = await createCheckoutSession({
        psychologistId: psychologist._id,
        appointmentDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes: bookingNotes,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email
      })

      window.location.href = url
    } catch (error) {
      setBookingError(error.message || "Failed to initiate payment. Please try again.")
      setBookingLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  if (!psychologist) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-none font-nunito select-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-customGreen" />
            Book a Session with {psychologist.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Select a date and time slot for your therapy session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {bookingSuccess ? (
            <div className="text-center py-8">
              <CheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Successful!</h3>
              <p className="text-gray-600 mb-4">Your session has been booked successfully.</p>
              <Button
                onClick={() => navigate("/my-bookings")}
                className="bg-customGreen hover:bg-customGreenHover text-white"
              >
                View My Bookings
              </Button>
            </div>
          ) : (
            <>
              {/* Calendar and Time Slots Section - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Select Date</h3>
                  <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    minDate={new Date()}
                    maxDays={30}
                    className="border rounded-lg"
                  />
                </div>

                {/* Time Slots Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Available Time Slots</h3>
                  {!selectedDate ? (
                    <div className="flex items-center justify-center py-20 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                      <div className="text-center">
                        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Select a date to view available time slots</p>
                      </div>
                    </div>
                  ) : loadingSlots ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-customGreen" />
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
                      <AlertIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No available slots on this date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedSlot?.startTime === slot.startTime
                              ? 'bg-customGreen/30 border-none font-semibold'
                              : 'border-gray-200  hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <TimeIcon className="w-4 h-4" />
                            <span className="text-sm">{formatTime24to12(slot.startTime)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              {selectedSlot && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Any specific topics or concerns you'd like to discuss..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{bookingNotes.length}/500 characters</p>
                </div>
              )}

              {/* Error Message */}
              {bookingError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{bookingError}</p>
                  </div>
                </div>
              )}

              {/* Booking Summary & Confirm */}
              {selectedSlot && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                  <h4 className="font-semibold text-gray-900">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Psychologist:</span>
                      <span className="font-medium">{psychologist.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {formatDateOnly(selectedDate, 'medium')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{formatTime24to12(selectedSlot.startTime)} - {formatTime24to12(selectedSlot.endTime)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                      <span className="text-gray-900 font-semibold">Total:</span>
                      <span className="text-customGreen font-bold text-lg">
                        ${typeof psychologist.price === 'number' ? psychologist.price.toFixed(2) : psychologist.price}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleBookSession}
                    disabled={bookingLoading}
                    className="w-full bg-customGreen hover:bg-customGreenHover text-white cursor-pointer"
                  >
                    {bookingLoading ? (
                      <>
                        Redirecting to Payment
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookingModal
