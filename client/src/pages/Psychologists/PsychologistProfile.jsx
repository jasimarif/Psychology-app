import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { psychologistService } from "@/services/psychologistService"
import { favoritesService } from "@/services/favoritesService"
import { useNextAvailable } from "@/hooks/useNextAvailable"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import BookingModal from "@/components/BookingModal"
import { ReviewsList } from "@/components"
import {
  LocationIcon,
  CalendarIcon,
  TimeIcon,
  GlobeIcon,
  BriefcaseIcon,
} from "@/components/icons/DuoTuneIcons"
import { Heart, Loader2, Star } from "lucide-react"

const PsychologistProfile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser } = useAuth()

  const hasCompleteData = location.state?.psychologist?.specialties
  const [psychologist, setPsychologist] = useState(hasCompleteData ? location.state.psychologist : null)
  const [loading, setLoading] = useState(!hasCompleteData)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("about")
  const [showBooking, setShowBooking] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoritesLoading, setFavoritesLoading] = useState(false)

  const { displayText: nextAvailableText, loading: nextAvailableLoading, hasAvailability } = useNextAvailable(id)

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    try {
      setFavoritesLoading(true)
      if (isFavorite) {
        await favoritesService.removeFavorite(currentUser.uid, id)
        setIsFavorite(false)
      } else {
        await favoritesService.addFavorite(currentUser.uid, id)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoritesLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser && id) {
      checkIfFavorite()
    }
  }, [currentUser, id])

  const checkIfFavorite = async () => {
    try {
      const favorites = await favoritesService.getFavorites(currentUser.uid)
      setIsFavorite(favorites.includes(id))
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  useEffect(() => {
    if (location.state?.psychologist?.specialties) {
      setPsychologist(location.state.psychologist)
      setLoading(false)
      return
    }

    if (id) {
      fetchPsychologist()
    }
  }, [id, location.state])

  const fetchPsychologist = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await psychologistService.getPsychologistById(id)
      setPsychologist(data)
    } catch (err) {
      setError(err.message || "Failed to load psychologist profile")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "reviews", label: "Reviews" },
    { id: "availability", label: "Availability" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-nunito">
        {/* Header Skeleton */}
        <div className="relative">
          <div className="h-32 bg-lightGrayHover" />
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col items-center -mt-16">
              <Skeleton className="w-32 h-32 rounded-full border-4 border-white" />
              <Skeleton className="h-7 w-48 mt-4" />
              <Skeleton className="h-5 w-64 mt-2" />
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !psychologist) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-nunito">
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            {error || "Psychologist not found"}
          </h2>
          <Button onClick={() => navigate("/browse-psychologists")}>
            Back to Browse
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-nunito animate-in fade-in duration-500">
      {/* Cover & Profile Header */}
      <div className="relative isolate">
        {/* Cover Image with Pattern */}
        <div className="h-24 sm:h-36 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0aec0' fill-opacity='0.15'%3E%3Cpath d='M40 40L20 20h40L40 40zm0 0L20 60h40L40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Profile Section */}
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col items-center -mt-12 sm:-mt-16 relative z-10">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-customGreen/40 bg-white overflow-hidden">
                {psychologist.profileImage ? (
                  <img
                    src={psychologist.profileImage}
                    alt={psychologist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-customGreen/20 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-customGreen">
                      {psychologist.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-3 border-white"></div>
            </div>

            {/* Name & Verification */}
            <div className="flex items-center gap-2 mt-3 sm:mt-4">
              <h1 className="text-2xl sm:text-4xl font-semibold text-customGreen font-averia tracking-tighter text-center">{psychologist.name}</h1>
              {psychologist.verified && (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              )}
            </div>

            {/* Rating */}
            {psychologist.reviews > 0 && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-700">{psychologist.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <span className="text-sm text-customGray">
                  ({psychologist.reviews} review{psychologist.reviews !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {/* Info Row */}
            <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-customGray px-2">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <BriefcaseIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-customGray" />
                <span>{psychologist.title}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <LocationIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-customGray" />
                <span>{psychologist.location}</span>
              </div>
              {psychologist.languages && psychologist.languages.length > 0 && (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <GlobeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-customGray" />
                  <span>{psychologist.languages.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-4 sm:mt-8">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <nav className="flex gap-0.5 sm:gap-1 border-b border-gray-200 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-customGreen text-customGreen"
                      : "border-transparent text-customGray hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Action Button */}
            <button
              onClick={handleToggleFavorite}
              disabled={favoritesLoading}
              className={`flex items-center justify-center gap-2 cursor-pointer transition-all px-3 sm:px-4 py-2 border rounded-md text-sm ${
                isFavorite
                  ? 'bg-red-100 border-none text-red-500 hover:bg-red-100/80'
                  : 'border-none bg-lightGray hover:bg-customGray/10 text-gray-700'
              } ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
              {favoritesLoading ? (
                <>
                <span className="hidden sm:inline">Processing </span>
                <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (isFavorite ? <span><span className="hidden sm:inline">Added to </span>Favorites</span> : <span><span className="hidden sm:inline">Add to </span>Favorites</span>)}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Booking Card */}
          <div className="lg:col-span-1 order-first lg:order-none">
            <div className="bg-lightGray rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:sticky lg:top-6">
              {/* Header - Session Type & Availability */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-customGray tracking-wide uppercase">Standard Session</span>
                {!nextAvailableLoading && hasAvailability && (
                  <Badge className="bg-customGreen/10 text-customGreen border-0 font-medium text-xs">
                    {nextAvailableText.startsWith('Today') ? 'Available Today' : 'Available'}
                  </Badge>
                )}
              </div>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-customGreen font-averia">
                  ${typeof psychologist.price === 'number' ? psychologist.price.toFixed(0) : psychologist.price}
                </span>
                <span className="text-customGray ml-1 text-sm sm:text-base">/ hour</span>
              </div>

              <hr className="border-gray-200 mb-4 sm:mb-6" />

              {/* Session Details */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {/* Duration */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-lightGrayHover rounded-full flex items-center justify-center">
                    <TimeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-customGreen" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm sm:text-base">{psychologist.availability?.sessionDuration || 60} Minutes</p>
                    <p className="text-xs sm:text-sm text-customGray">Session Duration</p>
                  </div>
                </div>

                {/* Next Available */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-lightGrayHover rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-customGreen" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm sm:text-base">Next Available</p>
                    <p className={`text-xs sm:text-sm ${hasAvailability ? 'text-customGray' : 'text-gray-400'}`}>
                      {nextAvailableLoading ? (
                        <span className="flex items-center gap-1">
                          Checking
                          <Loader2 className="w-3 h-3 animate-spin" />
                        </span>
                      ) : (
                        nextAvailableText
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200 mb-4 sm:mb-6" />

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <Button
                  onClick={() => {
                    if (!currentUser) {
                      navigate("/login")
                    } else {
                      setShowBooking(true)
                    }
                  }}
                  className="w-full bg-customGreen hover:bg-customGreenHover text-white py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl cursor-pointer flex items-center justify-center"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl border-gray-200 hover:bg-lightGray cursor-pointer"
                >
                  Send Message
                </Button>
              </div>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 text-xs sm:text-sm text-customGray">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Secure & Encrypted Connection</span>
              </div>
            </div>
          </div>

          {/* Right Column - Tab Content */}
          <div className="lg:col-span-2">
            {/* About Tab */}
            {activeTab === "about" && (
              <div className="bg-lightGray rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">About Me</h3>
                  <p className="text-sm sm:text-base text-customGray leading-relaxed">{psychologist.bio}</p>
                </div>

                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Approach</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {psychologist.approach || "I believe in creating a safe, supportive environment where clients can explore their thoughts and feelings openly. My approach is collaborative and tailored to each individual's unique needs and goals."}
                  </p>
                </div>

                {psychologist.languages && psychologist.languages.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {psychologist.languages.map((lang, index) => (
                        <span key={index} className="px-2.5 sm:px-3 py-1 bg-lightGrayHover rounded-full text-xs sm:text-sm text-gray-700">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="bg-lightGray rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Education & Credentials</h3>

                {psychologist.education && psychologist.education.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {psychologist.education.map((edu, index) => (
                      <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-lightGray rounded-xl">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-customGreen/10 rounded-lg flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-customGreen" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm sm:text-base">{edu.degree}</h4>
                          <p className="text-gray-600 text-sm">{edu.institution}</p>
                          <p className="text-xs sm:text-sm text-customGray">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-customGray text-sm sm:text-base">No education information available.</p>
                )}

                {psychologist.licenseNumber && (
                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">License</h3>
                    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-lightGrayHover rounded-xl">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Licensed Clinical Psychologist</h4>
                        <p className="text-gray-600 text-xs sm:text-sm">License #{psychologist.licenseNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="bg-lightGray rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Work Experience</h3>

                {psychologist.workExperience && psychologist.workExperience.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {psychologist.workExperience.map((exp, index) => (
                      <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-lightGrayHover rounded-xl">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-customGray/5 rounded-lg flex items-center justify-center shrink-0">
                          <BriefcaseIcon className="w-4 h-4 sm:w-5 sm:h-5 text-customGray" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm sm:text-base">{exp.position}</h4>
                          <p className="text-gray-600 text-sm">{exp.organization}</p>
                          <p className="text-xs sm:text-sm text-customGray">{exp.duration}</p>
                          {exp.description && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-2">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-customGray text-sm sm:text-base">No work experience information available.</p>
                )}
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === "availability" && (
              <div className="bg-lightGray rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Availability</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-lightGrayHover rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-customGray/5 rounded-lg flex items-center justify-center">
                        <TimeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-customGray" />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm sm:text-base">Session Duration</span>
                    </div>
                    <p className="text-gray-600 ml-11 sm:ml-13 text-sm sm:text-base">{psychologist.availability?.sessionDuration || 60} minutes</p>
                  </div>

                  <div className="p-3 sm:p-4 bg-lightGrayHover rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-customGray/5 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-customGray" />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm sm:text-base">Booking</span>
                    </div>
                    <p className="text-gray-600 ml-11 sm:ml-13 text-sm sm:text-base">Available for online sessions</p>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="border border-gray-200 rounded-xl p-4 sm:p-6 mt-4 sm:mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1 text-sm sm:text-base">Ready to book a session?</h4>
                      <p className="text-xs sm:text-sm text-customGray">Schedule your appointment today</p>
                    </div>
                    <Button
                      onClick={() => {
                        if (!currentUser) {
                          navigate("/login")
                        } else {
                          setShowBooking(true)
                        }
                      }}
                      className="bg-customGreen hover:bg-customGreenHover text-white cursor-pointer flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ReviewsList 
                  psychologistId={id}
                  initialRating={psychologist.rating}
                  initialReviewCount={psychologist.reviews}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={showBooking}
        onOpenChange={setShowBooking}
        psychologist={psychologist}
      />
    </div>
  )
}

export default PsychologistProfile
