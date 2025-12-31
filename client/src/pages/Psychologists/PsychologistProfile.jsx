import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { psychologistService } from "@/services/psychologistService"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import BookingModal from "@/components/BookingModal"
import {
  LocationIcon,
  AwardIcon,
  StarIcon,
  CalendarIcon,
  TimeIcon,
  GlobeIcon,
  GraduationIcon,
  StethoscopeIcon,
  BriefcaseIcon,
  DocumentIcon,
  UsersIcon
} from "@/components/icons/DuoTuneIcons"

const PsychologistProfile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser } = useAuth()

  // Only use state data if it has all required fields (specialties)
  const hasCompleteData = location.state?.psychologist?.specialties
  const [psychologist, setPsychologist] = useState(hasCompleteData ? location.state.psychologist : null)
  const [loading, setLoading] = useState(!hasCompleteData)
  const [error, setError] = useState("")

  // Booking modal state
  const [showBooking, setShowBooking] = useState(false)

  useEffect(() => {
    // If we have complete state data, use it
    if (location.state?.psychologist?.specialties) {
      setPsychologist(location.state.psychologist)
      setLoading(false)
      return
    }

    // Otherwise fetch from API using the ID
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-nunito">
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="border-none bg-customGreen/10 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Skeleton className="w-32 h-32 rounded-2xl mb-4" />
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-32 mb-4" />
                    <Skeleton className="h-5 w-24 mb-4" />
                    <div className="flex gap-2 mb-6">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !psychologist) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-nunito">
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
    <div className="min-h-screen flex flex-col rounded-lg bg-white font-nunito animate-in fade-in slide-in-from-bottom-4 duration-500">


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

                  {psychologist.specialties && psychologist.specialties.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {psychologist.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="w-full space-y-3">
                    <Button
                      className="w-full bg-customGreen hover:bg-customGreenHover text-white cursor-pointer select-none"
                      onClick={() => {
                        if (!currentUser) {
                          navigate("/login")
                        } else {
                          setShowBooking(true)
                        }
                      }}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2 select-none" />
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
                  {psychologist.languages && psychologist.languages.length > 0 && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <GlobeIcon className="w-5 h-5 text-green-500" />
                      <span>{psychologist.languages.join(", ")}</span>
                    </div>
                  )}
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
                  {/* <div className="p-4 bg-yellow-100/80 rounded-lg  ">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-8 h-8 text-yellow-600 bg-yellow-100 p-2 rounded" />
                      <span className="font-semibold text-gray-900">Typical Hours</span>
                    </div>
                    <p className="text-gray-600">{psychologist.typicalHours || "Mon - Fri: 9:00 AM - 5:00 PM"}</p>
                  </div> */}
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
