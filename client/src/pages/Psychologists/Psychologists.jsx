import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { favoritesService } from "@/services/favoritesService"
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
  Heart
} from "lucide-react"

import { PsychologistCard } from "@/components"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import BookingModal from "@/components/BookingModal"
import { PsychologistsIcon } from "@/components/icons/DuoTuneIcons"

function Psychologists() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [psychologists, setPsychologists] = useState([])
  const [filteredPsychologists, setFilteredPsychologists] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState("grid")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [filters, setFilters] = useState({
    specialty: "all",
    location: "all",
    experience: "any",
    priceRange: "",
    rating: "any",
    availability: ""
  })
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Booking modal state
  const [showBooking, setShowBooking] = useState(false)
  const [selectedPsychologist, setSelectedPsychologist] = useState(null)

  useEffect(() => {
    fetchPsychologists()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchFavorites()
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
    setActiveFilterCount(count + (showFavoritesOnly ? 1 : 0))
  }, [filters, showFavoritesOnly])

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
      const matchesFavorites = !showFavoritesOnly || favorites.includes(psychologist._id)

      return matchesSearch && matchesSpecialty && matchesLocation && matchesRating && matchesExperience && matchesFavorites
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
    setCurrentPage(1)
  }, [searchTerm, filters, psychologists, sortBy, showFavoritesOnly, favorites])

  // Pagination calculations
  const totalPages = Math.ceil(filteredPsychologists.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPsychologists = filteredPsychologists.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }
    return pages
  }

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
    setShowFavoritesOnly(false)
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

  const handleToggleFavorite = async (psychologist) => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    try {
      const isFavorited = favorites.includes(psychologist._id)
      if (isFavorited) {
        await favoritesService.removeFavorite(currentUser.uid, psychologist._id)
        setFavorites(prev => prev.filter(id => id !== psychologist._id))
      } else {
        await favoritesService.addFavorite(currentUser.uid, psychologist._id)
        setFavorites(prev => [...prev, psychologist._id])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
  <div className="min-h-screen bg-white rounded-lg px-4 font-nunito animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-4 lg:px-8 py-8">

        {/* Hero Header Section */}
        <div className="mb-8">
          <header className="select-none">
            <div className="">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-customGreen mb-4">
                Find a Therapist
              </p>
              <h1 className="text-5xl md:text-6xl font-light text-gray-700 tracking-tight mb-4">
                Our Specialists<br />
              </h1>
              <p className="text-lg text-customGray font-light max-w-xl">
                Connect with licensed mental health professionals who understand your unique journey.
              </p>
            </div>
          </header>


        </div>        
        {/* Search and Filter Section */}
        <div className="mb-6 sm:mb-8 space-y-3 text-gray-700">
          {/* Favorites Toggle Button - Visible when logged in */}


          {/* Search Bar, Sort, and Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 select-none">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
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

            {/* Sort and Filter Row - Always together on mobile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1 sm:flex-none w-auto sm:min-w-40 h-12 bg-lightGray border-none cursor-pointer focus:ring-customGreen rounded-xl py-0">
                  <ArrowUpDown className="w-4 h-4 mr-1 sm:mr-2" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended" className='cursor-pointer'>Recommended</SelectItem>
                  <SelectItem value="rating" className='cursor-pointer'>Highest Rated</SelectItem>
                  <SelectItem value="experience" className='cursor-pointer'>Most Experienced</SelectItem>
                  <SelectItem value="reviews" className='cursor-pointer'>Most Reviewed</SelectItem>
                  <SelectItem value="price-low" className='cursor-pointer'>Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className='cursor-pointer'>Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`flex items-center gap-1 sm:gap-2 h-12 px-3 sm:px-4 shadow-none rounded-xl transition-all ${activeFilterCount > 0
                      ? 'bg-customGreen text-white border-customGreen hover:text-white cursor-pointer hover:bg-customGreenHover'
                      : 'bg-white border-dotted hover:bg-gray-50 cursor-pointer text-gray-700'
                      }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="font-medium hidden sm:inline">Filters</span>
                    {activeFilterCount > 0 && (
                      <Badge className="ml-1 bg-white text-customGreen hover:bg-white text-xs px-1.5 py-0.5">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-4" align="end">
                {/* Favorites Toggle */}
                {currentUser && (
                  <>
                    <div className="space-y-1.5 mb-4">
                      <DropdownMenuLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5 p-0">
                        <Heart className="w-3.5 h-3.5 text-customGreen" />
                        Favorites
                      </DropdownMenuLabel>
                      <button
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`w-full h-10 px-4 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                          showFavoritesOnly
                            ? 'bg-customGreen text-white hover:bg-customGreenHover'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
                          Show Favorites Only
                        </span>
                        {showFavoritesOnly && (
                          <Badge className="bg-white text-customGreen hover:bg-white text-xs px-1.5 py-0.5">
                            {favorites.length}
                          </Badge>
                        )}
                      </button>
                    </div>
                    <DropdownMenuSeparator className="my-3" />
                  </>
                )}
                {/* Specialty Filter */}
                <div className="space-y-1.5 mb-4">
                  <DropdownMenuLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5 p-0">
                    <Briefcase className="w-3.5 h-3.5 text-customGreen" />
                    Specialty
                  </DropdownMenuLabel>
                  <Select value={filters.specialty} onValueChange={(value) => handleFilterChange("specialty", value)}>
                    <SelectTrigger className="w-full h-10 bg-white border-gray-200 focus:ring-customGreen rounded-lg cursor-pointer">
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty} className="cursor-pointer">{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div className="space-y-1.5 mb-4">
                  <DropdownMenuLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5 p-0">
                    <MapPin className="w-3.5 h-3.5 text-customGreen" />
                    Location
                  </DropdownMenuLabel>
                  <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                    <SelectTrigger className="w-full h-10 bg-white border-gray-200 focus:ring-customGreen rounded-lg cursor-pointer">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location} className="cursor-pointer">{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-1.5 mb-4">
                  <DropdownMenuLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5 p-0">
                    <Star className="w-3.5 h-3.5 text-customGreen" />
                    Min Rating
                  </DropdownMenuLabel>
                  <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
                    <SelectTrigger className="w-full h-10 bg-white border-gray-200 focus:ring-customGreen rounded-lg cursor-pointer">
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any" className="cursor-pointer">Any Rating</SelectItem>
                      <SelectItem value="4.5" className="cursor-pointer">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0" className="cursor-pointer">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5" className="cursor-pointer">3.5+ Stars</SelectItem>
                      <SelectItem value="3.0" className="cursor-pointer">3.0+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Filter */}
                <div className="space-y-1.5">
                  <DropdownMenuLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5 p-0">
                    <Award className="w-3.5 h-3.5 text-customGreen" />
                    Experience
                  </DropdownMenuLabel>
                  <Select value={filters.experience} onValueChange={(value) => handleFilterChange("experience", value)}>
                    <SelectTrigger className="w-full h-10 bg-white border-gray-200 focus:ring-customGreen rounded-lg cursor-pointer">
                      <SelectValue placeholder="Any Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any" className="cursor-pointer">Any Experience</SelectItem>
                      <SelectItem value="10" className="cursor-pointer">10+ Years</SelectItem>
                      <SelectItem value="5" className="cursor-pointer">5+ Years</SelectItem>
                      <SelectItem value="3" className="cursor-pointer">3+ Years</SelectItem>
                      <SelectItem value="1" className="cursor-pointer">1+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <>
                    <DropdownMenuSeparator className="my-3" />
                    <div className="flex items-center justify-between">
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
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>

          {/* View Mode Toggle - Second Line */}
          <div className="flex justify-end select-none">
            <div className="hidden lg:flex items-center gap-1 bg-lightGray p-1 rounded-xl h-10">
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
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <p className="text-sm sm:text-base text-gray-700 font-medium">
              Found <span className="text-customGreen font-bold text-base sm:text-lg">{filteredPsychologists.length}</span> professional{filteredPsychologists.length !== 1 ? 's' : ''}
            </p>
            {searchTerm && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Searching for: <span className="font-medium">"{searchTerm}"</span>
              </p>
            )}
          </div>
        </div>

        {/* Psychologists Grid/List */}
        {filteredPsychologists.length > 0 ? (
          <>
            <div className={`grid gap-4 sm:gap-6 ${viewMode === "grid"
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
              }`}>
              {paginatedPsychologists.map((psychologist) => (
                <PsychologistCard
                  key={psychologist.id}
                  psychologist={psychologist}
                  onViewProfile={viewProfile}
                  onBookSession={bookSession}
                  isFavorite={favorites.includes(psychologist._id)}
                  onToggleFavorite={currentUser ? handleToggleFavorite : null}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <p className="text-sm text-gray-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredPsychologists.length)} of {filteredPsychologists.length} professionals
                </p>
              </div>
            )}
          </>
        ) : (
          /* No Results */
          <Card className="border-none shadow-none bg-lightGray select-none">
            <CardContent className="text-center py-10 sm:py-16 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-customGray/5 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-customGray" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No professionals found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                We couldn't find any matches for your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={showBooking}
        onOpenChange={setShowBooking}
        psychologist={selectedPsychologist}
      />
    </div>
  )
}

export default Psychologists