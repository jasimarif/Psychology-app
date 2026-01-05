import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { bookingService } from "@/services/bookingService"
import { reviewService } from "@/services/reviewService"
import { Loader2, Star } from "lucide-react"
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
import { formatDateOnly, formatTime24to12, formatTimeRange } from "@/lib/timezone"
import ReviewDialog from "@/components/Review/ReviewDialog"

const MyBookings = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancellingId, setCancellingId] = useState(null)
  const [filter, setFilter] = useState("all")

  // Reschedule state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [reschedulingBooking, setReschedulingBooking] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [rescheduleLoading, setRescheduleLoading] = useState(false)
  const [rescheduleError, setRescheduleError] = useState("")

  // Cancel dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)
  const [cancelError, setCancelError] = useState("")

  // Review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [bookingToReview, setBookingToReview] = useState(null)
  const [reviewedBookings, setReviewedBookings] = useState(new Set())

  useEffect(() => {
    if (currentUser) {
      loadBookings()
    }
  }, [currentUser])

  useEffect(() => {
    if (bookings.length > 0) {
      checkReviewedBookings()
    }
  }, [bookings])

  const checkReviewedBookings = async () => {
    const completedBookings = bookings.filter(b => b.status === 'completed')
    const reviewedSet = new Set()
    
    for (const booking of completedBookings) {
      try {
        const result = await reviewService.checkReviewExists(booking._id)
        if (result.exists) {
          reviewedSet.add(booking._id)
        }
      } catch (error) {
        console.error('Error checking review status:', error)
      }
    }
    
    setReviewedBookings(reviewedSet)
  }

  useEffect(() => {
    if (selectedDate && reschedulingBooking) {
      loadAvailableSlots()
    }
  }, [selectedDate])

  const loadAvailableSlots = async () => {
    if (!reschedulingBooking?.psychologistId?._id) return

    setLoadingSlots(true)
    setSelectedSlot(null)
    setRescheduleError("")
    try {
      const offset = selectedDate.getTimezoneOffset()
      const date = new Date(selectedDate.getTime() - (offset * 60 * 1000))
      const dateStr = date.toISOString().split('T')[0]

      const data = await bookingService.getAvailableSlots(reschedulingBooking.psychologistId._id, dateStr)
      setAvailableSlots(data.availableSlots || [])
    } catch (error) {
      setRescheduleError(error.message)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleRescheduleClick = (booking) => {
    setReschedulingBooking(booking)
    setRescheduleModalOpen(true)
    setSelectedDate(null)
    setAvailableSlots([])
    setSelectedSlot(null)
    setRescheduleError("")
  }

  const handleConfirmReschedule = async () => {
    if (!selectedSlot || !selectedDate || !reschedulingBooking) return

    setRescheduleLoading(true)
    setRescheduleError("")
    try {
      const offset = selectedDate.getTimezoneOffset()
      const date = new Date(selectedDate.getTime() - (offset * 60 * 1000))
      const dateStr = date.toISOString().split('T')[0]

      await bookingService.rescheduleBooking(reschedulingBooking._id, {
        appointmentDate: dateStr,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      })

      setRescheduleModalOpen(false)
      toast.success("Session rescheduled!", {
        description: "Your session has been moved to the new date and time."
      })
      loadBookings()
    } catch (error) {
      setRescheduleError(error.message)
      toast.error("Failed to reschedule", {
        description: error.message || "Please try again."
      })
    } finally {
      setRescheduleLoading(false)
    }
  }

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

  const openCancelDialog = (booking) => {
    setBookingToCancel(booking)
    setCancelError("")
    setCancelDialogOpen(true)
  }

  const openReviewDialog = (booking) => {
    setBookingToReview(booking)
    setReviewDialogOpen(true)
  }

  const handleReviewSubmitted = () => {
    if (bookingToReview) {
      setReviewedBookings(prev => new Set([...prev, bookingToReview._id]))
    }
    setBookingToReview(null)
  }

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return

    try {
      setCancellingId(bookingToCancel._id)
      await bookingService.cancelBooking(bookingToCancel._id, "Cancelled by user")
      setCancelDialogOpen(false)
      setBookingToCancel(null)
      toast.success("Booking cancelled", {
        description: "Your session has been cancelled and a refund will be processed."
      })
      await loadBookings()
    } catch (err) {
      setCancelError(err.message)
      toast.error("Failed to cancel booking", {
        description: err.message || "Please try again."
      })
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

  const canRescheduleBooking = (booking) => {
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
            <h2 className="text-2xl font-bold text-gray-700 mb-3">Authentication Required</h2>
            <p className="text-customGray mb-6">Please log in to view and manage your therapy session bookings</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-nunito rounded-lg px-4">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="w-8 h-8 rounded" />
                  <Skeleton className="h-10 w-48" />
                </div>
                <Skeleton className="h-5 w-72" />
              </div>
              <Skeleton className="h-10 w-40 rounded-xl hidden md:block" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="rounded-2xl border-0 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-8" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Filter skeleton */}
          <div className="mb-6 flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-[200px] rounded-xl" />
          </div>

          {/* Booking cards skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="rounded-3xl border-0 shadow-none bg-customGray/5">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-32" />
                        <div className="flex gap-2 pt-2">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 md:w-48">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Skeleton className="h-10 w-24 rounded-xl" />
                      <Skeleton className="h-10 w-24 rounded-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-nunito rounded-lg px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 select-none">
             <header className="">
            <div className="">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-customGreen mb-4">
                Your Sessions
              </p>
              <h1 className="text-5xl md:text-6xl font-light text-gray-700 tracking-tight mb-4">
                My Bookings
              </h1>
              <p className="text-lg text-customGray font-light max-w-xl">
                View and manage your upcoming therapy sessions and appointment history.
              </p>
            </div>
          </header>
            <Button
              onClick={() => navigate("/browse-psychologists")}
              className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl shadow-none transition-all hidden md:flex cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Book New Session
            </Button>
          </div>

          {/* Statistics Cards */}
          {bookings.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 select-none">
              <Card className="rounded-2xl border-0 shadow-none bg-lightGray ">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-customGray/10 flex items-center justify-center">
                      <TimeIcon className="w-6 h-6 text-customGray" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
                      <p className="text-sm text-customGray">Total</p>
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

              <Card className="rounded-2xl border-0 shadow-none bg-lightGreen/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-lightGreen/95 flex items-center justify-center">
                      <CheckIcon className="w-6 h-6 text-customGreen" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-customGreen">{stats.completed}</p>
                      <p className="text-sm text-customGreen">Completed</p>
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
        <div className="mb-6 flex items-center gap-3 select-none">
          <label htmlFor="booking-filter" className="text-sm font-medium text-gray-700">
            Filter by:
          </label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px] rounded-xl border-gray-300 bg-white h-11 cursor-pointer">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">All Bookings</SelectItem>
              <SelectItem value="upcoming" className="cursor-pointer">Upcoming</SelectItem>
              <SelectItem value="past" className="cursor-pointer">Past</SelectItem>
              <SelectItem value="cancelled" className="cursor-pointer">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error ? (
          <Card className="rounded-3xl  shadow-none bg-red-100">
            <CardContent className="pt-8 pb-8">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CloseIcon className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-3">Oops! Something went wrong!</h3>
                <p className="text-customGray mb-6 max-w-md mx-auto">{error}</p>
                <Button
                  onClick={loadBookings}
                  className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl px-6 h-11 cursor-pointer select-none"
                >
                  <StatsIcon className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : getFilteredBookings().length === 0 ? (
          <Card className="rounded-3xl border-0 shadow-none bg-lightGray select-none">
            <CardContent className="pt-8 pb-8">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-customGray/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarIcon className="w-12 h-12 text-customGray" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
                </h3>
                <p className="text-customGray mb-8 max-w-md mx-auto">
                  {filter === "all"
                    ? "Start your mental wellness journey by booking your first therapy session with our qualified psychologists"
                    : `You don't have any ${filter} bookings at the moment`}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => navigate("/browse-psychologists")}
                    className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl px-6 h-11 shadow-none transition-all cursor-pointer"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Browse Psychologists
                  </Button>
                  {filter !== "all" && (
                    <Button
                      onClick={() => setFilter("all")}
                      variant="outline"
                      className="rounded-xl px-6 h-11 border-gray-300 hover:bg-gray-50 cursor-pointer"
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
                className="rounded-3xl border-0 shadow-none bg-lightGray transition-all duration-300 overflow-hidden group py-0"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Section - Psychologist Info */}
                    <div className="flex-1 p-6 lg:p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar className="w-16 h-16 ring-4 ring-customGray/10 group-hover:ring-customGray/20 transition-all select-none">
                          <AvatarImage src={booking.psychologistId?.profileImage} />
                          <AvatarFallback className="bg-customGray/10 text-customGray text-lg font-bold">
                            {booking.psychologistId?.name?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-700 mb-1 group-hover:text-customGreen transition-colors">
                                {booking.psychologistId?.name}
                              </h3>
                              <p className="text-sm text-customGray flex items-center gap-1">
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
                        <div className="flex items-center gap-3 p-3 bg-customGray/5 rounded-xl ">
                          <div className="w-10 h-10 bg-customGray/10 rounded-lg flex items-center justify-center ">
                            <CalendarIcon className="w-5 h-5 text-customGray" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Date</p>
                            <p className="text-sm font-semibold text-gray-700">
                              {formatDateOnly(booking.appointmentDate, 'medium')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-customGray/5 rounded-xl ">
                          <div className="w-10 h-10 bg-customGray/10 rounded-lg flex items-center justify-center ">
                            <TimeIcon className="w-5 h-5 text-customGray" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Time</p>
                            <p className="text-sm font-semibold text-gray-700">
                              {formatTime24to12(booking.startTime)} - {formatTime24to12(booking.endTime)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-customGray/5 rounded-xl ">
                          <div className="w-10 h-10 bg-customGray/10 rounded-lg flex items-center justify-center ">
                            <LocationIcon className="w-5 h-5 text-customGray" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Location</p>
                            <p className="text-sm font-semibold text-gray-700">
                              {booking.psychologistId?.location || "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-customGray/5 rounded-xl ">
                          <div className="w-10 h-10 bg-customGray/10 rounded-lg flex items-center justify-center ">
                            <span className="text-lg font-bold text-customGray">$</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Session Fee</p>
                            <p className="text-lg font-bold text-customGray">
                              ${booking.price}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Zoom Link */}
                      {booking.zoomJoinUrl && booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <div className="p-4 bg-blue-100 rounded-xl  mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-0">
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15.75 2.25H8.25C7.00736 2.25 6 3.25736 6 4.5V19.5C6 20.7426 7.00736 21.75 8.25 21.75H15.75C16.9926 21.75 18 20.7426 18 19.5V4.5C18 3.25736 16.9926 2.25 15.75 2.25Z" />
                                <path d="M9 6.75H15M9 9.75H15M9 12.75H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">Video Session</p>
                              <p className="text-sm text-gray-700 mb-3">
                                Join your session via Zoom when it's time
                              </p>
                              {booking.zoomPassword && (
                                <p className="text-xs text-customGray mb-2">
                                  <span className="font-semibold">Meeting ID:</span> {booking.zoomMeetingId}
                                  <span className="mx-2">|</span>
                                  <span className="font-semibold">Password:</span> {booking.zoomPassword}
                                </p>
                              )}
                              <a
                                href={booking.zoomJoinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors select-none cursor-pointer"
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
                    <div className="lg:w-64 bg-customGray/5 select-none">
                      <div className="flex flex-col py-6 lg:py-8 px-6 lg:px-8 h-full">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Actions</p>

                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            className="w-full justify-start rounded-xl border-gray-300 hover:bg-white hover:border-gray-300  hover:text-customGreen transition-all cursor-pointer"
                            onClick={() => navigate(`/psychologist/${booking.psychologistId?._id}`, {
                              state: { psychologist: booking.psychologistId }
                            })}
                          >
                            <ProfileIcon className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>

                          {canRescheduleBooking(booking) && (
                            <Button
                              variant="outline"
                              className="w-full justify-start rounded-xl border-blue-200 text-blue-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer"
                              onClick={() => handleRescheduleClick(booking)}
                            >
                              <TimeIcon className="w-4 h-4 mr-2" />
                              Reschedule
                            </Button>
                          )}

                          {canCancelBooking(booking) && (
                            <>
                              <Separator className="my-2" />
                              <div className="space-y-2">
                                <p className="text-xs text-gray-500">
                                  Cancel up to 24h before appointment
                                </p>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start rounded-xl border-red-200 text-red-600 hover:text-red-600 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer"
                                  onClick={() => openCancelDialog(booking)}
                                >
                                  <CloseIcon className="w-4 h-4 mr-2" />
                                  Cancel Booking
                                </Button>
                              </div>
                            </>
                          )}
                        </div>

                        {booking.status === 'completed' && (
                          <div className="mt-auto pt-4 border-t border-gray-200">
                            {reviewedBookings.has(booking._id) ? (
                              <div className="flex items-center gap-2 text-emerald-600 text-sm">
                                <CheckIcon className="w-4 h-4" />
                                <span className="font-medium">Review submitted</span>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-emerald-600 text-sm">
                                  <CheckIcon className="w-4 h-4" />
                                  <span className="font-medium">Session completed</span>
                                </div>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start rounded-xl border-yellow-300 text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400 transition-all cursor-pointer"
                                  onClick={() => openReviewDialog(booking)}
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Leave a Review
                                </Button>
                              </div>
                            )}
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
            className="w-full bg-customGreen hover:bg-customGreenHover text-white rounded-xl shadow-none transition-all h-12 cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Book New Session
          </Button>
        </div>

        {/* Reschedule Dialog */}
        <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-none font-nunito select-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-700 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-customGreen" />
                Reschedule Session with {reschedulingBooking?.psychologistId?.name}
              </DialogTitle>
              <DialogDescription className="text-customGray">
                Select a new date and time for your therapy session. Rescheduling is allowed up to 24 hours before the session.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Calendar and Time Slots Section - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Select New Date</h3>
                  <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={(dateStr) => {
                      const [year, month, day] = dateStr.split('-').map(Number)
                      const date = new Date(year, month - 1, day)
                      setSelectedDate(date)
                    }}
                    className="border rounded-lg"
                    minDate={new Date()}
                    maxDays={30}
                  />
                </div>

                {/* Time Slots Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Available Time Slots</h3>
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
                      <CloseIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-customGray">No available slots on this date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedSlot?.startTime === slot.startTime
                              ? 'bg-customGreen text-white border-none font-semibold'
                              : 'border-gray-200 hover:bg-gray-50'
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

              {/* Error Message */}
              {rescheduleError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <CloseIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{rescheduleError}</p>
                  </div>
                </div>
              )}

              {/* Reschedule Summary & Confirm */}
              {selectedSlot && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                  <h4 className="font-semibold text-gray-700">Reschedule Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-customGray">Psychologist:</span>
                      <span className="font-medium">{reschedulingBooking?.psychologistId?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-customGray">New Date:</span>
                      <span className="font-medium">
                        {selectedDate && formatDateOnly(selectedDate, 'medium')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-customGray">New Time:</span>
                      <span className="font-medium">{formatTime24to12(selectedSlot.startTime)} - {formatTime24to12(selectedSlot.endTime)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleConfirmReschedule}
                    disabled={!selectedSlot || rescheduleLoading}
                    className="w-full bg-customGreen hover:bg-customGreenHover text-white cursor-pointer"
                  >
                    {rescheduleLoading ? (
                      <>
                        Rescheduling...
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      </>
                    ) : (
                      "Confirm Reschedule"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Cancel Booking Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent className="rounded-3xl select-none font-nunito">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-gray-700 font-nunito">
                Cancel Booking
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 font-nunito">
                Are you sure you want to cancel your session with{" "}
                <span className="font-semibold text-gray-700">
                  {bookingToCancel?.psychologistId?.name}
                </span>{" "}
                on{" "}
                <span className="font-semibold text-gray-700">
                  {bookingToCancel && formatDateOnly(bookingToCancel.appointmentDate, 'medium')}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {cancelError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {cancelError}
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setCancelDialogOpen(false)
                  setBookingToCancel(null)
                  setCancelError("")
                }}
                className="rounded-xl select-none cursor-pointer"
              >
                Keep Booking
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelBooking}
                disabled={cancellingId === bookingToCancel?._id}
                className="bg-red-600 hover:bg-red-700 rounded-xl select-none cursor-pointer"
              >
                {cancellingId === bookingToCancel?._id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Booking"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Review Dialog */}
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          booking={bookingToReview}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </div>
  )
}

export default MyBookings
