import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { psychologistService } from "@/services/psychologistService"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import BookingModal from "@/components/BookingModal"
import {
  LocationIcon,
  StarIcon,
  CalendarIcon,
  TimeIcon,
  GlobeIcon,
  BriefcaseIcon,
} from "@/components/icons/DuoTuneIcons"

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
    { id: "availability", label: "Availability" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-nunito">
        {/* Header Skeleton */}
        <div className="relative">
          <div className="h-32 bg-gray-100" />
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
    <div className="min-h-screen bg-white font-nunito animate-in fade-in duration-500">
      {/* Cover & Profile Header */}
      <div className="relative isolate">
        {/* Cover Image with Pattern */}
        <div className="h-36 bg-customGreen relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0aec0' fill-opacity='0.15'%3E%3Cpath d='M40 40L20 20h40L40 40zm0 0L20 60h40L40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Profile Section */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center -mt-16 relative z-10">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-customGreen bg-white overflow-hidden">
                {psychologist.profileImage ? (
                  <img
                    src={psychologist.profileImage}
                    alt={psychologist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-customGreen/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-customGreen">
                      {psychologist.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
            </div>

            {/* Name & Verification */}
            <div className="flex items-center gap-2 mt-4">
              <h1 className="text-2xl font-bold text-gray-900">{psychologist.name}</h1>
              {psychologist.verified && (
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              )}
            </div>

            {/* Info Row */}
            <div className="flex items-center flex-wrap justify-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                <span>{psychologist.title}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LocationIcon className="w-4 h-4 text-gray-400" />
                <span>{psychologist.location}</span>
              </div>
              {psychologist.languages && psychologist.languages.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <GlobeIcon className="w-4 h-4 text-gray-400" />
                  <span>{psychologist.languages.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between border-b border-gray-200">
            <nav className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "border-customGreen text-customGreen"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (!currentUser) {
                    navigate("/login")
                  } else {
                    setShowBooking(true)
                  }
                }}
                className="bg-customGreen hover:bg-customGreenHover text-white cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Book Session
              </Button>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center justify-around divide-x divide-gray-200">
                <div className="text-center px-4">
                  <p className="text-2xl font-bold text-gray-900">{psychologist.experience}</p>
                  <p className="text-sm text-gray-500">Experience</p>
                </div>
                <div className="text-center px-4">
                  <div className="flex items-center justify-center gap-1">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <p className="text-2xl font-bold text-gray-900">{psychologist.rating}</p>
                  </div>
                  <p className="text-sm text-gray-500">{psychologist.reviews} reviews</p>
                </div>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Profile</h3>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                {psychologist.bio}
              </p>
            </div>

            {/* Specialties Card */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {psychologist.specialties?.map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-customGreen/10 text-customGreen border-0"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Session Fee Card */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Session Fee</h3>
              <p className="text-3xl font-bold text-customGreen">
                ${typeof psychologist.price === 'number' ? psychologist.price.toFixed(2) : psychologist.price}
              </p>
              <p className="text-sm text-gray-500">per session</p>
            </div>
          </div>

          {/* Right Column - Tab Content */}
          <div className="lg:col-span-2">
            {/* About Tab */}
            {activeTab === "about" && (
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
                  <p className="text-gray-600 leading-relaxed">{psychologist.bio}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Approach</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {psychologist.approach || "I believe in creating a safe, supportive environment where clients can explore their thoughts and feelings openly. My approach is collaborative and tailored to each individual's unique needs and goals."}
                  </p>
                </div>

                {psychologist.languages && psychologist.languages.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {psychologist.languages.map((lang, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
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
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Credentials</h3>

                {psychologist.education && psychologist.education.length > 0 ? (
                  <div className="space-y-4">
                    {psychologist.education.map((edu, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-customGreen/10 rounded-lg flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-customGreen" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No education information available.</p>
                )}

                {psychologist.licenseNumber && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">License</h3>
                    <div className="flex gap-4 p-4 bg-green-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Licensed Clinical Psychologist</h4>
                        <p className="text-gray-600">License #{psychologist.licenseNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>

                {psychologist.workExperience && psychologist.workExperience.length > 0 ? (
                  <div className="space-y-4">
                    {psychologist.workExperience.map((exp, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-100 rounded-xl">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                          <BriefcaseIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-gray-600">{exp.organization}</p>
                          <p className="text-sm text-gray-500">{exp.duration}</p>
                          {exp.description && (
                            <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No work experience information available.</p>
                )}
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === "availability" && (
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TimeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Session Duration</span>
                    </div>
                    <p className="text-gray-600 ml-13">{psychologist.availability?.sessionDuration || 60} minutes</p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Booking</span>
                    </div>
                    <p className="text-gray-600 ml-13">Available for online sessions</p>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="border border-gray-200 rounded-xl p-6 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Ready to book a session?</h4>
                      <p className="text-sm text-gray-500">Schedule your appointment today</p>
                    </div>
                    <Button
                      onClick={() => {
                        if (!currentUser) {
                          navigate("/login")
                        } else {
                          setShowBooking(true)
                        }
                      }}
                      className="bg-customGreen hover:bg-customGreenHover text-white cursor-pointer"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
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
