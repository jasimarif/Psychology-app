import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { bookingService } from "@/services/bookingService"
import { Loader2 } from "lucide-react"
import {
  CalendarIcon,
  TimeIcon,
  LocationIcon,
  ProfileIcon,
  CheckIcon,
  CloseIcon,
  BriefcaseIcon,
  StatsIcon,
  ArrowRightIcon
} from "@/components/icons/DuoTuneIcons"
import { formatDateOnlyEST, formatTime24to12, formatTimeRangeEST } from "@/lib/timezone"

const MyBookings = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancellingId, setCancellingId] = useState(null)
  const [filter, setFilter] = useState("all") 

  useEffect(() => {
    if (currentUser) {
      loadBookings()
    }
  }, [currentUser])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getUserBookings(currentUser.uid)
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      setCancellingId(bookingId)
      await bookingService.cancelBooking(bookingId, "Cancelled by user")
      await loadBookings() 
    } catch (err) {
      alert(err.message)
    } finally {
      setCancellingId(null)
    }
  }

  const getFilteredBookings = () => {
    const now = new Date()

    switch (filter) {
      case "upcoming":
        return bookings.filter(b =>
          new Date(b.appointmentDate) >= now &&
          b.status === 'confirmed'
        )
      case "past":
        return bookings.filter(b =>
          new Date(b.appointmentDate) < now ||
          b.status === 'completed'
        )
      case "cancelled":
        return bookings.filter(b => b.status === 'cancelled')
      default:
        return bookings
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: { 
        className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100", 
        label: "Confirmed",
        icon: <CheckIcon className="w-3 h-3" />
      },
      completed: { 
        className: "bg-blue-100 text-blue-700 hover:bg-blue-100", 
        label: "Completed",
        icon: <CheckIcon className="w-3 h-3" />
      },
      cancelled: { 
        className: "bg-red-100 text-red-700 hover:bg-red-100", 
        label: "Cancelled",
        icon: <CloseIcon className="w-3 h-3" />
      }
    }

    const variant = variants[status] || variants.confirmed
    return (
      <Badge className={`${variant.className} border font-medium gap-1.5 px-3 py-1`}>
        {variant.icon}
        {variant.label}
      </Badge>
    )
  }

  const getBookingStats = () => {
    const upcoming = bookings.filter(b =>
      new Date(b.appointmentDate) >= new Date() &&
      b.status === 'confirmed'
    ).length

    const completed = bookings.filter(b => b.status === 'completed').length

    const cancelled = bookings.filter(b => b.status === 'cancelled').length

    return { upcoming, completed, cancelled, total: bookings.length }
  }

  const canCancelBooking = (booking) => {
    if (!booking || booking.status === 'cancelled' || booking.status === 'completed') {
      return false
    }

    if (!booking.startTime || !booking.appointmentDate) {
      return false
    }

    const appointmentDateTime = new Date(booking.appointmentDate)
    const [hours, minutes] = booking.startTime.split(':').map(Number)
    appointmentDateTime.setHours(hours, minutes, 0, 0)

    const now = new Date()
    const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60)

    return hoursUntilAppointment >= 24
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-linear-to-br from-customGreen/5 via-white to-customGreen/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-3xl shadow-none border">
          <CardContent className="pt-12 pb-8 px-8 text-center">
            <div className="w-20 h-20 bg-customGreen/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ProfileIcon className="w-10 h-10 text-customGreen" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view and manage your therapy session bookings</p>
            <Button 
              onClick={() => navigate("/login")}
              className="w-full bg-customGreen hover:bg-customGreenHover text-white h-11 rounded-xl font-medium"
            >
              Go to Login
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getBookingStats()

  return (
    <div className="min-h-screen bg-white font-nunito rounded-lg px-4">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CalendarIcon className="w-8 h-8 text-customGreenHover" />
                <h1 className="text-3xl md:text-4xl font-bold text-customGreenHover">
                  My Bookings
                </h1>
              </div>
                       <p className="text-gray-600 text-lg">
                Track and manage your therapy sessions
              </p>
            </div>
            <Button
              onClick={() => navigate("/browse-psychologists")}
              className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl shadow-none transition-all hidden md:flex"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Book New Session
            </Button>
          </div>

          {/* Statistics Cards */}
          {!loading && bookings.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="rounded-2xl border-0 shadow-none bg-lightGreen/50 ">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-lightGreen/95 flex items-center justify-center">
                      <TimeIcon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-sm text-gray-600">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-none bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-200/50 flex items-center justify-center">
                      <TimeIcon className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-900">{stats.upcoming}</p>
                      <p className="text-sm text-amber-700">Upcoming</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-none bg-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-200/50 flex items-center justify-center">
                      <CheckIcon className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-900">{stats.completed}</p>
                      <p className="text-sm text-emerald-700">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-none bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-200/50 flex items-center justify-center">
                      <CloseIcon className="w-6 h-6 text-red-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
                      <p className="text-sm text-red-700">Cancelled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="mb-6 flex items-center gap-3">
          <label htmlFor="booking-filter" className="text-sm font-medium text-gray-700">
            Filter by:
          </label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px] rounded-xl border-gray-300 bg-white h-11">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-customGreen/20 border-t-customGreen rounded-full animate-spin mx-auto mb-6"></div>
                <CalendarIcon className="w-8 h-8 text-customGreen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-gray-600 font-medium">Loading your bookings...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="rounded-3xl  shadow-none bg-red-100">
            <CardContent className="pt-8 pb-8">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CloseIcon className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
                <Button 
                  onClick={loadBookings} 
                  className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl px-6 h-11"
                >
                  <StatsIcon className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : getFilteredBookings().length === 0 ? (
          <Card className="rounded-3xl border-0 shadow-none bg-customGreen">
            <CardContent className="pt-8 pb-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-customGreen/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarIcon className="w-12 h-12 text-customGreen" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {filter === "all"
                    ? "Start your mental wellness journey by booking your first therapy session with our qualified psychologists"
                    : `You don't have any ${filter} bookings at the moment`}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => navigate("/browse-psychologists")}
                    className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl px-6 h-11 shadow-none transition-all"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Browse Psychologists
                  </Button>
                  {filter !== "all" && (
                    <Button
                      onClick={() => setFilter("all")}
                      variant="outline"
                      className="rounded-xl px-6 h-11 border-gray-300 hover:bg-gray-50"
                    >
                      View All Bookings
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {getFilteredBookings().map((booking) => (
              <Card 
                key={booking._id} 
                className="rounded-3xl border-0 shadow-none bg-customGreen/5 transition-all duration-300 overflow-hidden group py-0"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Section - Psychologist Info */}
                    <div className="flex-1 p-6 lg:p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar className="w-16 h-16 ring-4 ring-customGreen/10 group-hover:ring-customGreen/20 transition-all">
                          <AvatarImage src={booking.psychologistId?.avatar} />
                          <AvatarFallback className="bg-customGreen/10 text-customGreen text-lg font-bold">
                            {booking.psychologistId?.name?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-customGreen transition-colors">
                                {booking.psychologistId?.name}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <BriefcaseIcon className="w-3.5 h-3.5" />
                                {booking.psychologistId?.title}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-customGreen/5 rounded-xl ">
                          <div className="w-10 h-10 bg-customGreen/10 rounded-lg flex items-center justify-center ">
                            <CalendarIcon className="w-5 h-5 text-customGreen" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Date</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDateOnlyEST(booking.appointmentDate, 'medium')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-customGreen/5 rounded-xl ">
                          <div className="w-10 h-10 bg-customGreen/10 rounded-lg flex items-center justify-center ">
                            <TimeIcon className="w-5 h-5 text-customGreen" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Time (EST)</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatTime24to12(booking.startTime)} - {formatTime24to12(booking.endTime)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-customGreen/5 rounded-xl ">
                          <div className="w-10 h-10 bg-customGreen/10 rounded-lg flex items-center justify-center ">
                            <LocationIcon className="w-5 h-5 text-customGreen" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Location</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {booking.psychologistId?.location || "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-customGreen/5 rounded-xl ">
                          <div className="w-10 h-10 bg-customGreen/10 rounded-lg flex items-center justify-center ">
                            <span className="text-lg font-bold text-customGreen">$</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Session Fee</p>
                            <p className="text-lg font-bold text-customGreen">
                              ${booking.price}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Zoom Link */}
                      {booking.zoomJoinUrl && booking.status !== 'cancelled' && (
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15.75 2.25H8.25C7.00736 2.25 6 3.25736 6 4.5V19.5C6 20.7426 7.00736 21.75 8.25 21.75H15.75C16.9926 21.75 18 20.7426 18 19.5V4.5C18 3.25736 16.9926 2.25 15.75 2.25Z" />
                                <path d="M9 6.75H15M9 9.75H15M9 12.75H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">Video Session</p>
                              <p className="text-sm text-gray-700 mb-3">
                                Join your session via Zoom when it's time
                              </p>
                              {booking.zoomPassword && (
                                <p className="text-xs text-gray-600 mb-2">
                                  <span className="font-semibold">Meeting ID:</span> {booking.zoomMeetingId}
                                  <span className="mx-2">|</span>
                                  <span className="font-semibold">Password:</span> {booking.zoomPassword}
                                </p>
                              )}
                              <a
                                href={booking.zoomJoinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Join Zoom Meeting
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {booking.notes && (
                        <div className="p-4 bg-blue-100 rounded-xl  mb-4">
                          <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">Session Notes</p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {booking.notes}
                          </p>
                        </div>
                      )}

                      {/* Cancellation Reason */}
                      {booking.status === 'cancelled' && booking.cancellationReason && (
                        <div className="p-4 bg-red-100 rounded-xl ">
                          <p className="text-xs text-red-600 font-semibold mb-1 uppercase tracking-wide">Cancellation Reason</p>
                          <p className="text-sm text-red-700 leading-relaxed">
                            {booking.cancellationReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className="lg:w-64 bg-lightGreen/50 ">
                      <div className="flex flex-col py-6 lg:py-8 px-6 lg:px-8 h-full">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Actions</p>

                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            className="w-full justify-start rounded-xl border-gray-300 hover:bg-white hover:border-customGreen hover:text-customGreen transition-all cursor-pointer"
                            onClick={() => navigate(`/psychologist/${booking.psychologistId?._id}`, {
                              state: { psychologist: booking.psychologistId }
                            })}
                          >
                            <ProfileIcon className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>

                          {canCancelBooking(booking) && (
                            <>
                              <Separator className="my-2" />
                              <div className="space-y-2">
                                <p className="text-xs text-gray-500">
                                  Cancel up to 24h before appointment
                                </p>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer"
                                  onClick={() => handleCancelBooking(booking._id)}
                                  disabled={cancellingId === booking._id}
                                >
                                  {cancellingId === booking._id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Cancelling...
                                    </>
                                  ) : (
                                    <>
                                      <CloseIcon className="w-4 h-4 mr-2" />
                                      Cancel Booking
                                    </>
                                  )}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>

                        {booking.status === 'completed' && (
                          <div className="mt-auto pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-emerald-600 text-sm">
                              <CheckIcon className="w-4 h-4" />
                              <span className="font-medium">Session completed</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
          <Button
            onClick={() => navigate("/browse-psychologists")}
            className="w-full bg-customGreen hover:bg-customGreenHover text-white rounded-xl shadow-none transition-all h-12"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Book New Session
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MyBookings
