import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  TrendingUp,
  Users,
  Star,
  Award,
  Briefcase,
  Filter,
  ArrowUpDown,
  Grid3x3,
  LayoutList,
  Loader2
} from "lucide-react"

import { PsychologistCard } from "@/components"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { PsychologistsIcon, CalendarIcon, TimeIcon, CheckIcon, AlertIcon } from "@/components/icons/DuoTuneIcons"
import { bookingService } from "@/services/bookingService"
import { createCheckoutSession } from "@/services/paymentService"
import { formatDateOnly, formatTime24to12 } from "@/lib/timezone"

function Psychologists() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [psychologists, setPsychologists] = useState([])
  const [filteredPsychologists, setFilteredPsychologists] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState("grid")
  const [filters, setFilters] = useState({
    specialty: "all",
    location: "all",
    experience: "any",
    priceRange: "",
    rating: "any",
    availability: ""
  })
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  // Booking modal state
  const [showBooking, setShowBooking] = useState(false)
  const [selectedPsychologist, setSelectedPsychologist] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingNotes, setBookingNotes] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")

  useEffect(() => {
    fetchPsychologists()
  }, [])

  const fetchPsychologists = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/psychologists`)
      const result = await response.json()
      if (result.success) {
        const formattedData = result.data.map(p => ({
          _id: p._id,
          id: p._id,
          name: p.name,
          title: p.title,
          specialties: p.specialties || [],
          location: p.location,
          experience: p.experience,
          rating: p.rating,
          reviews: p.reviews,
          bio: p.bio,
          languages: p.languages || [],
          price: p.price,
          availability: p.availability,
          // typicalHours: p.typicalHours,
          profileImage: p.profileImage,
          education: p.education || [],
          workExperience: p.workExperience || [],
          licenseNumber: p.licenseNumber
        }))
        setPsychologists(formattedData)
        setFilteredPsychologists(formattedData)
      }
    } catch (error) {
      console.error('Error fetching psychologists:', error)
    } finally {
      setLoading(false)
    }
  }

  const specialties = [...new Set(psychologists.flatMap(p => p.specialties))]
  const locations = [...new Set(psychologists.map(p => p.location))]

  useEffect(() => {
    const count = Object.values(filters).filter(v => v && v !== "" && v !== "any" && v !== "all").length
    setActiveFilterCount(count)
  }, [filters])

  useEffect(() => {
    let filtered = psychologists.filter(psychologist => {
      const matchesSearch = psychologist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        psychologist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        psychologist.bio.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSpecialty = !filters.specialty || filters.specialty === "all" || filters.specialty === "any" ||
        psychologist.specialties.includes(filters.specialty)
      const matchesLocation = !filters.location || filters.location === "all" || filters.location === "any" ||
        psychologist.location === filters.location
      const matchesRating = !filters.rating || filters.rating === "any" || psychologist.rating >= parseFloat(filters.rating)
      const matchesExperience = !filters.experience || filters.experience === "any" ||
        parseInt(psychologist.experience) >= parseInt(filters.experience)

      return matchesSearch && matchesSpecialty && matchesLocation && matchesRating && matchesExperience
    })

    // Sort psychologists
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "experience":
        filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience))
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    setFilteredPsychologists(filtered)
  }, [searchTerm, filters, psychologists, sortBy])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      specialty: "all",
      location: "all",
      experience: "any",
      priceRange: "",
      rating: "any",
      availability: ""
    })
    setSearchTerm("")
    setSortBy("recommended")
  }

  // Load available slots when date is selected (must be before conditional returns)
  useEffect(() => {
    if (selectedDate && selectedPsychologist) {
      loadAvailableSlots()
    }
  }, [selectedDate, selectedPsychologist])

  const loadAvailableSlots = async () => {
    if (!selectedPsychologist?._id) {
      setBookingError("Psychologist ID is missing.")
      return
    }

    setLoadingSlots(true)
    setSelectedSlot(null)
    setBookingError("")
    try {
      const data = await bookingService.getAvailableSlots(selectedPsychologist._id, selectedDate)
      setAvailableSlots(data.availableSlots || [])
    } catch (error) {
      setBookingError(error.message)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-br from-teal-50/30 via-white to-emerald-50/30 font-nunito">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-72 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Search and filters skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>

          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="rounded-2xl border-0 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-14 rounded-full" />
                    </div>
                    <div className="flex gap-2 pt-3">
                      <Skeleton className="h-10 flex-1 rounded-xl" />
                      <Skeleton className="h-10 flex-1 rounded-xl" />
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

  const viewProfile = (psychologist) => {
    navigate(`/psychologist/${psychologist._id}`, { state: { psychologist } })
  }

  const bookSession = (psychologist) => {
    if (!currentUser) {
      navigate("/login")
      return
    }
    setSelectedPsychologist(psychologist)
    setShowBooking(true)
  }

  const handleBookSession = async () => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    if (!selectedPsychologist?._id) {
      setBookingError("Psychologist ID is missing.")
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
        psychologistId: selectedPsychologist._id,
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

  const handleCloseBookingModal = () => {
    setShowBooking(false)
    setSelectedPsychologist(null)
    setSelectedDate("")
    setSelectedSlot(null)
    setBookingNotes("")
    setBookingError("")
    setBookingSuccess(false)
    setAvailableSlots([])
  }

  return (
    <div className="min-h-screen bg-white rounded-lg font-nunito">
      <div className="container  px-4 lg:px-12 py-8">

        {/* Hero Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <PsychologistsIcon className="w-8 h-8 text-customGreenHover" />
                  <h1 className="text-3xl md:text-4xl font-bold text-customGreenHover">
                    Find Your Perfect Match
                  </h1>
                </div>
                                       <p className="text-gray-600 text-lg">
                  Connect with qualified mental health professionals
                </p>
              </div>
            </div>
          </div>


        </div>        {/* Search and Filter Section */}
        <div className="mb-8">
          {/* Search Bar - Full Width */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, specialty, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 shadow-none border-none bg-gray-100 focus:bg-white focus:border-customGreen focus:ring-2 focus:ring-customGreen/20 rounded-xl text-base transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Controls Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-auto min-w-40 h-10 bg-gray-100 border-none cursor-pointer focus:ring-customGreen rounded-xl">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`flex items-center gap-2 h-10 px-4 rounded-xl transition-all ${showFilters
                  ? 'bg-customGreen text-white border-customGreen hover:bg-customGreenHover'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <Badge className="ml-1 bg-white text-customGreen hover:bg-white text-xs px-1.5 py-0.5">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* View Mode Toggle */}
            <div className="hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-xl h-10 ml-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "grid"
                    ? 'bg-white text-customGreen'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "list"
                    ? 'bg-white text-customGreen'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expandable Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Specialty Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-customGreen" />
                    Specialty
                  </label>
                  <Select value={filters.specialty} onValueChange={(value) => handleFilterChange("specialty", value)}>
                    <SelectTrigger className="h-10 bg-white border-gray-200 focus:ring-customGreen rounded-lg">
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-customGreen" />
                    Location
                  </label>
                  <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                    <SelectTrigger className="h-10 bg-white border-gray-200 focus:ring-customGreen rounded-lg">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-customGreen" />
                    Min Rating
                  </label>
                  <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
                    <SelectTrigger className="h-10 bg-white border-gray-200 focus:ring-customGreen rounded-lg">
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      <SelectItem value="3.0">3.0+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-customGreen" />
                    Experience
                  </label>
                  <Select value={filters.experience} onValueChange={(value) => handleFilterChange("experience", value)}>
                    <SelectTrigger className="h-10 bg-white border-gray-200 focus:ring-customGreen rounded-lg">
                      <SelectValue placeholder="Any Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Experience</SelectItem>
                      <SelectItem value="10">10+ Years</SelectItem>
                      <SelectItem value="5">5+ Years</SelectItem>
                      <SelectItem value="3">3+ Years</SelectItem>
                      <SelectItem value="1">1+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-customGreen">{activeFilterCount}</span> filter{activeFilterCount > 1 ? 's' : ''} active
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-700 font-medium">
              Found <span className="text-customGreen font-bold text-lg">{filteredPsychologists.length}</span> professional{filteredPsychologists.length !== 1 ? 's' : ''}
            </p>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-1">
                Searching for: <span className="font-medium">"{searchTerm}"</span>
              </p>
            )}
          </div>
        </div>

        {/* Psychologists Grid/List */}
        {filteredPsychologists.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === "grid"
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
            }`}>
            {filteredPsychologists.map((psychologist) => (
              <PsychologistCard
                key={psychologist.id}
                psychologist={psychologist}
                onViewProfile={viewProfile}
                onBookSession={bookSession}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          /* No Results */
          <Card className="border-none shadow-md bg-white">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No professionals found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any matches for your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      <Dialog open={showBooking} onOpenChange={handleCloseBookingModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-none font-nunito">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-customGreen" />
              Book a Session with {selectedPsychologist?.name}
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
                {selectedSlot && selectedPsychologist && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                    <h4 className="font-semibold text-gray-900">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Psychologist:</span>
                        <span className="font-medium">{selectedPsychologist.name}</span>
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
                          ${typeof selectedPsychologist.price === 'number' ? selectedPsychologist.price.toFixed(2) : selectedPsychologist.price}
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

export default Psychologists