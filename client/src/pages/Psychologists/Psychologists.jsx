import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  LayoutList
} from "lucide-react"

import { PsychologistCard } from "@/components"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PsychologistsIcon } from "@/components/icons/DuoTuneIcons"

function Psychologists() {
  const navigate = useNavigate()
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-br from-teal-50/30 via-white to-emerald-50/30 font-nunito">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-customGreen/20 border-t-customGreen rounded-full animate-spin"></div>
              <Users className="w-8 h-8 text-customGreen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-600 font-medium">Finding the best professionals for you...</p>
          </div>
        </div>
      </div>
    )
  }

  const viewProfile = (psychologist) => {
    navigate(`/psychologist/${psychologist._id}`, { state: { psychologist } })
  }

  const bookSession = (psychologist) => {
    // Handle booking session
    console.log("Book session with:", psychologist.name)
    // TODO: Implement booking system
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
          <div className="border-0 shadow-none bg-white">
            <div className="">
              <div className="flex flex-col lg:flex-row gap-4">

                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name, specialty, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 shadow-none border-none  bg-gray-100 focus:bg-white focus:border-customGreen focus:ring-2 focus:ring-customGreen/20 rounded-xl text-base transition-all"
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

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48 h-12!  bg-gray-100 border-none cursor-pointer focus:ring-customGreen rounded-xl">
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

                {/* Filter Toggle Button */}
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className={`flex items-center gap-2 h-12 px-6 border-gray-200 rounded-xl transition-all ${showFilters
                      ? 'bg-customGreen text-white border-customGreen hover:bg-customGreenHover'
                      : 'bg-white hover:bg-gray-50'
                    }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="font-medium">Filters</span>
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 bg-white text-customGreen hover:bg-white">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                {/* View Mode Toggle */}
                <div className="hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-xl h-12">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "grid"
                        ? 'bg-white  text-customGreen'
                        : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "list"
                        ? 'bg-white text-customGreen'
                        : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Specialty Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-customGreen" />
                        Specialty
                      </label>
                      <Select value={filters.specialty} onValueChange={(value) => handleFilterChange("specialty", value)}>
                        <SelectTrigger className="h-10 border-gray-200 focus:ring-customGreen rounded-lg">
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
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-customGreen" />
                        Location
                      </label>
                      <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                        <SelectTrigger className="h-10 border-gray-200 focus:ring-customGreen rounded-lg">
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
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Star className="w-4 h-4 text-customGreen" />
                        Minimum Rating
                      </label>
                      <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
                        <SelectTrigger className="h-10 border-gray-200 focus:ring-customGreen rounded-lg">
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
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Award className="w-4 h-4 text-customGreen" />
                        Experience
                      </label>
                      <Select value={filters.experience} onValueChange={(value) => handleFilterChange("experience", value)}>
                        <SelectTrigger className="h-10 border-gray-200 focus:ring-customGreen rounded-lg">
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

                  {/* Filter Actions */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      {activeFilterCount > 0 && (
                        <span className="font-medium text-customGreen">
                          {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                        </span>
                      )}
                    </p>
                    <Button
                      onClick={clearFilters}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
    </div>
  )
}

export default Psychologists