import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { favoritesService } from "@/services/favoritesService"
import { psychologistService } from "@/services/psychologistService"
import {
  Search,
  X,
  Target,
  Star,
  AlertCircle,
  ClipboardList,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import BookingModal from "@/components/BookingModal"
import { PsychologistsIcon, CalendarIcon } from "@/components/icons/DuoTuneIcons"

// Recommended Psychologist Card with Match Score
const RecommendedPsychologistCard = ({ psychologist, onViewProfile, onBookSession }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer group"
      onClick={() => onViewProfile(psychologist)}
    >
      {/* Large Profile Image */}
      <div className="relative aspect-square overflow-hidden">
        {psychologist.profileImage ? (
          <img
            src={psychologist.profileImage}
            alt={psychologist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <PsychologistsIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Match Score Badge - Top Left */}
        {psychologist.matchPercentage !== undefined && (
          <div className="absolute top-4 left-4 bg-customGreen backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <Target className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              {psychologist.matchPercentage}% Match
            </span>
          </div>
        )}

        {/* Rating Badge - Top Right */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-customGreen">
            {psychologist.rating > 0 ? psychologist.rating.toFixed(1) : 'New'}
          </span>
          {psychologist.reviews > 0 && (
            <span className="text-xs text-gray-500">({psychologist.reviews})</span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Name and Title */}
        <div className="mb-3">
          <h3 className="text-2xl font-semibold text-customGreen mb-1 font-averia tracking-tighter">
            {psychologist.name}
          </h3>
          <p className="text-sm font-semibold tracking-wider text-customGray uppercase">
            {psychologist.title}
          </p>
        </div>

        {/* Specialty Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {psychologist.specialties?.slice(0, 3).map((specialty, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs font-medium text-customGreen bg-lightGray border-none rounded-full px-3 py-1"
            >
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Bio Preview */}
        <p className="text-sm text-customGray leading-relaxed line-clamp-2 mb-6"> 
          {psychologist.bio}
        </p>

        {/* Price and Book Button */}
        <div className="flex items-end justify-between border-t pt-4">
          <div>
            <p className="text-xs text-customGray mb-0.5">FEE</p>
            <p className="text-3xl font-semibold font-averia text-customGreen">
              ${psychologist.price}<span className="text-sm font-normal text-customGray">/hr</span>
            </p>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onBookSession(psychologist);
            }}
            className="bg-customGreen hover:bg-customGreenHover text-white rounded-lg px-6 py-3 select-none cursor-pointer font-medium flex items-center"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Book Session
          </div>
        </div>
      </div>
    </div>
  )
}

function RecommendedPsychologists() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [psychologists, setPsychologists] = useState([])
  const [filteredPsychologists, setFilteredPsychologists] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState([])
  const [hasProfile, setHasProfile] = useState(false)

  // Booking modal state
  const [showBooking, setShowBooking] = useState(false)
  const [selectedPsychologist, setSelectedPsychologist] = useState(null)

  useEffect(() => {
    if (currentUser) {
      fetchRecommendations()
      fetchFavorites()
    } else {
      setLoading(false)
    }
  }, [currentUser])

  const fetchFavorites = async () => {
    try {
      const userFavorites = await favoritesService.getFavorites(currentUser.uid)
      setFavorites(userFavorites)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const result = await psychologistService.getRecommendations(currentUser.uid)

      if (result.profileComplete && result.data) {
        setHasProfile(true)
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
          profileImage: p.profileImage,
          education: p.education || [],
          workExperience: p.workExperience || [],
          licenseNumber: p.licenseNumber,
          matchScore: p.matchScore,
          matchPercentage: p.matchPercentage,
          matchBreakdown: p.matchBreakdown
        }))
        const filteredByMatch = formattedData.filter(p => (p.matchPercentage || 0) >= 40)
        filteredByMatch.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        setPsychologists(filteredByMatch)
        setFilteredPsychologists(filteredByMatch)
      } else {
        setHasProfile(false)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setHasProfile(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = psychologists.filter(psychologist => {
      const matchesSearch = psychologist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        psychologist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        psychologist.bio.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })

    // Always sort by match score
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

    setFilteredPsychologists(filtered)
  }, [searchTerm, psychologists])

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-br from-teal-50/30 via-white to-emerald-50/30 font-nunito">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-72 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Search skeleton */}
          <div className="mb-8">
            <Skeleton className="h-12 w-full max-w-md rounded-xl" />
          </div>

          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="rounded-2xl border-0 shadow-none overflow-hidden">
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

  // No profile completed - show prompt to complete questionnaire
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-white rounded-lg px-4 font-nunito animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <header className="select-none">
              <div className="">
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-customGreen mb-4">
                  Personalized Matches
                </p>
                <h1 className="text-5xl md:text-6xl font-light text-gray-700 tracking-tight mb-4">
                  Recommended For You
                </h1>
                <p className="text-lg text-customGray font-light max-w-xl">
                  Get psychologists matched to your unique needs and preferences.
                </p>
              </div>
            </header>
          </div>

          {/* Complete Questionnaire Prompt */}
          <div className="max-w-2xl mx-auto">
            <Card className="rounded-3xl border shadow-none bg-white overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-customGreen mb-3">
                  Complete Your Profile First
                </h2>
                <p className="text-customGray mb-6 max-w-md mx-auto">
                  To get personalized psychologist recommendations, please complete the questionnaire. 
                  This helps us understand your needs and match you with the best professionals.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => navigate("/questionnaire")}
                    className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl shadow-none cursor-pointer h-12 px-8"
                  >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Complete Questionnaire
                  </Button>
                  <Button
                    onClick={() => navigate("/browse-psychologists")}
                    variant="outline"
                    className="rounded-xl shadow-none cursor-pointer h-12 px-8 border-gray-200"
                  >
                    Browse All Psychologists
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white rounded-lg px-4 font-nunito animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-4 lg:px-8 py-8">

        {/* Hero Header Section */}
        <div className="mb-8">
          <header className="select-none">
            <div className="">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-customGreen mb-4">
                Personalized Matches
              </p>
              <h1 className="text-5xl md:text-6xl font-light text-gray-700 tracking-tight mb-4">
                Recommended For You
              </h1>
              <p className="text-lg text-customGray font-light max-w-xl">
                Psychologists matched based on your questionnaire responses and preferences.
              </p>
            </div>
          </header>
        </div>

        {/* Personalized Recommendations Banner */}
        <div className="mb-6 flex items-center gap-3 bg-customGreen/10 rounded-2xl p-4 select-none">
          <div className="w-10 h-10 rounded-xl bg-customGreen/20 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-customGreen" />
          </div>
          <p className="text-teal-800 text-sm flex-1">
            These psychologists are ranked by how well they match your profile. Higher match percentages indicate better compatibility with your needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 shadow-none border-none bg-lightGray focus:bg-white focus:border-customGreen focus:ring-2 focus:ring-customGreen rounded-xl text-base transition-all"
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
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between select-none">
          <p className="text-sm text-customGray">
            <span className="font-semibold text-customGreen">{filteredPsychologists.length}</span> recommended psychologists
          </p>
          <Button
            onClick={() => navigate("/browse-psychologists")}
            variant="ghost"
            className="text-customGreen hover:text-customGreenHover hover:bg-customGreen/10 cursor-pointer select-none rounded-xl"
          >
            View All Psychologists
          </Button>
        </div>

        {/* Psychologists Grid */}
        {filteredPsychologists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPsychologists.map((psychologist) => (
              <RecommendedPsychologistCard
                key={psychologist._id}
                psychologist={psychologist}
                onViewProfile={viewProfile}
                onBookSession={bookSession}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-customGreen mb-2">No Matches Found</h3>
            <p className="text-customGray mb-6">
              Try adjusting your search terms or update your questionnaire responses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="rounded-xl shadow-none cursor-pointer h-11 px-6 border-gray-200"
              >
                Clear Search
              </Button>
              <Button
                onClick={() => navigate("/questionnaire")}
                className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl shadow-none cursor-pointer h-11 px-6"
              >
                Update Questionnaire
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBooking && selectedPsychologist && (
        <BookingModal
          psychologist={selectedPsychologist}
          onClose={() => {
            setShowBooking(false)
            setSelectedPsychologist(null)
          }}
        />
      )}
    </div>
  )
}

export default RecommendedPsychologists
