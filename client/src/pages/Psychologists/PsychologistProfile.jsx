import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { bookingService } from "@/services/bookingService"
import { createCheckoutSession } from "@/services/paymentService"
import { formatDateOnly, formatTime24to12 } from "@/lib/timezone"
import {
  LocationIcon,
  AwardIcon,
  StarIcon,
  CalendarIcon,
  TimeIcon,
  GlobeIcon,
  GraduationIcon,
  StethoscopeIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  CheckIcon,
  AlertIcon,
  DocumentIcon,
  UsersIcon
} from "@/components/icons/DuoTuneIcons"
import { Loader2 } from "lucide-react"

const PsychologistProfile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const psychologist = location.state?.psychologist

  // Debug: Log psychologist data
  useEffect(() => {
    if (psychologist) {
      console.log('Psychologist data:', psychologist)
      console.log('Has _id:', !!psychologist._id)
      console.log('_id value:', psychologist._id)
    }
  }, [psychologist])

  // Booking state
  const [showBooking, setShowBooking] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingNotes, setBookingNotes] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")

  // Load available slots when date is selected
  useEffect(() => {
    if (selectedDate && psychologist) {
      loadAvailableSlots()
    }
  }, [selectedDate])

  const loadAvailableSlots = async () => {
    if (!psychologist._id) {
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

    if (!psychologist._id) {
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

  // Generate next 30 days for date picker
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const handleCloseBookingModal = () => {
    setShowBooking(false)
    setSelectedDate("")
    setSelectedSlot(null)
    setBookingNotes("")
    setBookingError("")
    setBookingSuccess(false)
  }

  if (!psychologist) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-nunito">

        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Psychologist not found</h2>
          <Button onClick={() => navigate("/browse-psychologists")}>
            Back to Browse
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col rounded-lg bg-white font-nunito">


      <div className="flex-1 container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="border-none bg-customGreen/10 shadow-none sticky top-24">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border-2 border-white shadow-sm overflow-hidden">
                    {psychologist.profileImage ? (
                      <img
                        src={psychologist.profileImage}
                        alt={psychologist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UsersIcon className="w-16 h-16 text-blue-600" />
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{psychologist.name}</h1>
                  <p className="text-customGreen font-medium mb-2">{psychologist.title}</p>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-900">{psychologist.rating}</span>
                    <span className="text-gray-500">({psychologist.reviews} reviews)</span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {psychologist.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="w-full space-y-3">
                    <Button
                      className="w-full bg-customGreen hover:bg-customGreenHover text-white cursor-pointer"
                      onClick={() => {
                        if (!currentUser) {
                          navigate("/login")
                        } else {
                          setShowBooking(true)
                        }
                      }}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-customGreen/40">
                  <div className="flex items-center gap-3 text-gray-600">
                    <LocationIcon className="w-5 h-5 text-blue-500" />
                    <span>{psychologist.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <AwardIcon className="w-5 h-5 text-purple-500" />
                    <span>{psychologist.experience} Experience</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <GlobeIcon className="w-5 h-5 text-green-500" />
                    <span>{psychologist.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="font-bold text-gray-900">
                      ${typeof psychologist.price === 'number' ? psychologist.price.toFixed(2) : psychologist.price}
                    </div>
                    <span className="text-sm">per session</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="border-none shadow-none bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <DocumentIcon className="w-8 h-8 text-blue-600 bg-blue-100 p-2 rounded" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {psychologist.bio}
                </p>
              </CardContent>
            </Card>

            {/* Education & Credentials */}
            <Card className="border-none shadow-none bg-green-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <GraduationIcon className="w-8 h-8 text-green-600 bg-green-100 p-2 rounded" />
                  Education & Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {psychologist.education && psychologist.education.length > 0 ? (
                  psychologist.education.map((edu, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="mt-1">
                        <GraduationIcon className="w-8 h-8 text-green-600 bg-green-100 p-2 rounded" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No education information available.</p>
                )}

                {psychologist.licenseNumber && (
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <StethoscopeIcon className="w-8 h-8 text-green-600 bg-green-100 p-2 rounded" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Licensed Clinical Psychologist</h4>
                      <p className="text-gray-600">License #{psychologist.licenseNumber}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="border-none shadow-none bg-purple-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BriefcaseIcon className="w-8 h-8 text-purple-600 bg-purple-100 p-2 rounded" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {psychologist.workExperience && psychologist.workExperience.length > 0 ? (
                  psychologist.workExperience.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="mt-1">
                        <BriefcaseIcon className="w-8 h-8 text-purple-600 bg-purple-100 p-2 rounded" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                        <p className="text-gray-600">{exp.organization}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No work experience information available.</p>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="border-none shadow-none bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="w-8 h-8 text-yellow-600 bg-yellow-100 p-2 rounded" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-100/80 rounded-lg  ">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-8 h-8 text-yellow-600 bg-yellow-100 p-2 rounded" />
                      <span className="font-semibold text-gray-900">Typical Hours</span>
                    </div>
                    {/* <p className="text-gray-600">{psychologist.typicalHours || "Mon - Fri: 9:00 AM - 5:00 PM"}</p> */}
                  </div>
                  <div className="p-4 bg-yellow-100/80 rounded-lg  ">
                    <div className="flex items-center gap-2 mb-2">
                      <TimeIcon className="w-8 h-8 text-yellow-600 bg-yellow-100 p-2 rounded" />
                      <span className="font-semibold text-gray-900">Session Duration</span>
                    </div>
                    <p className="text-gray-600">{psychologist.availability?.sessionDuration || 60} minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Section */}
            {showBooking && (
              <Card id="booking-section" className="border-gray-200 shadow-none bg-red-50/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="w-8 h-8 text-red-600" />
                    Book a Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {bookingSuccess ? (
                    <div className="text-center py-8">
                      <CheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Successful!</h3>
                      <p className="text-gray-600">Redirecting to your bookings...</p>
                    </div>
                  ) : (
                    <>
                      {/* Date Selection */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">Select Date</label>
                        <select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen"
                        >
                          <option value="">Choose a date</option>
                          {getAvailableDates().map(date => {
                            const formatted = formatDateOnly(date, 'medium')
                            return (
                              <option key={date} value={date}>
                                {formatted}
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      {/* Time Slots */}
                      {selectedDate && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-900">Available Time Slots (EST)</label>
                          {loadingSlots ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-8 h-8 animate-spin text-customGreen" />
                            </div>
                          ) : availableSlots.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                              <AlertIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">No available slots on this date</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {availableSlots.map((slot, index) => (
                                <button
                                  key={index}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    selectedSlot?.startTime === slot.startTime
                                      ? 'border-customGreen bg-green-50 text-customGreen font-semibold'
                                      : 'border-gray-200 hover:border-customGreen hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    <TimeIcon className="w-4 h-4" />
                                    <span>{formatTime24to12(slot.startTime)}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {selectedSlot && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-900">
                            Notes (Optional)
                          </label>
                          <textarea
                            value={bookingNotes}
                            onChange={(e) => setBookingNotes(e.target.value)}
                            placeholder="Any specific topics or concerns you'd like to discuss..."
                            rows={3}
                            maxLength={500}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen"
                          />
                          <p className="text-xs text-gray-500">{bookingNotes.length}/500 characters</p>
                        </div>
                      )}

                      {/* Error Message */}
                      {bookingError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-600 text-sm">{bookingError}</p>
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
                              <span className="text-gray-600">Time (EST):</span>
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
                            className="w-full bg-customGreen hover:bg-customGreenHover text-white"
                          >
                            {bookingLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Confirming Booking...
                              </>
                            ) : (
                              "Confirm Booking"
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBooking} onOpenChange={handleCloseBookingModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-nunito">
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
                            className={`p-3 rounded-lg border-2 transition-all ${
                              selectedSlot?.startTime === slot.startTime
                                ? 'border-customGreen bg-green-50 text-customGreen font-semibold'
                                : 'border-gray-200 hover:border-customGreen hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <TimeIcon className="w-4 h-4" />
                              <span className="text-sm">{slot.startTime}</span>
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
                      className="w-full bg-customGreen hover:bg-customGreenHover text-white"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Redirecting to Payment...
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
    </div>
  )
}

export default PsychologistProfile
