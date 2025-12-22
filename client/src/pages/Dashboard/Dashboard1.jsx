import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Icons
const TrendingUpIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon opacity="0.3" points="8.36 14 15.59 8.84 20 9.94 20 6 16 4 9 11 5 12 5 14 8.36 14"/>
    <path d="M21,18H20V12l-4-1L9,16H6V3A1,1,0,0,0,4,3V18H3a1,1,0,0,0,0,2H4v1a1,1,0,0,0,2,0V20H21a1,1,0,0,0,0-2Z"/>
  </svg>
)

const UsersIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.43,8.57l-4.68,6.57a1,1,0,0,0-.09,1l2.54,5.31a1,1,0,0,0,.88.56h0a1,1,0,0,0,.88-.63l6.93-18a1,1,0,0,0-.22-1Z"/>
    <path opacity="0.3" d="M20.67,2.06,2.63,9A1,1,0,0,0,2,9.88a1,1,0,0,0,.56.92l5.31,2.54a1,1,0,0,0,1-.09l6.57-4.68,6.28-6.28A1,1,0,0,0,20.67,2.06Z"/>
  </svg>
)

const RocketIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.3" d="M4.05,15.2C8.34,7.77,13.58,3.26,20.93,2A.92.92,0,0,1,22,3.07C20.74,10.42,16.23,15.66,8.8,20Zm-.23,2.14L2.63,20.45a.71.71,0,0,0,.92.92l3.11-1.19ZM16.5,6A1.5,1.5,0,1,0,18,7.5,1.5,1.5,0,0,0,16.5,6Z"/>
    <path d="M4.05,15.2l-1.8-1.81a.84.84,0,0,1,.18-1.33L9.15,8.29A34.68,34.68,0,0,0,4.05,15.2ZM8.8,20l1.81,1.8a.84.84,0,0,0,1.33-.18l3.77-6.72A34.68,34.68,0,0,1,8.8,20ZM7,18.19l5.55-5.55a.87.87,0,0,0-1.23-1.22L5.81,17Z"/>
  </svg>
)

const AwardIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="14 18 14 16 10 16 10 18 9 20 15 20 14 18"/>
    <path opacity="0.3" d="M20,4H17V3a1,1,0,0,0-1-1H8A1,1,0,0,0,7,3V4H4A1,1,0,0,0,3,5V9a4,4,0,0,0,4,4H7l3,3h4l3-3h0a4,4,0,0,0,4-4V5A1,1,0,0,0,20,4ZM5,9V6H7v5A2,2,0,0,1,5,9ZM19,9a2,2,0,0,1-2,2V6h2ZM17,21v1H7V21a1,1,0,0,1,1-1h8A1,1,0,0,1,17,21ZM10,9A1,1,0,0,1,9,8V5a1,1,0,0,1,2,0V8A1,1,0,0,1,10,9Zm0,4a1,1,0,0,1-1-1V11a1,1,0,0,1,2,0v1A1,1,0,0,1,10,13Z"/>
  </svg>
)

const FileIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.3"><path d="M19,22H5a1,1,0,0,1-1-1V3A1,1,0,0,1,5,2h9l6,6V21A1,1,0,0,1,19,22Z"/></g>
    <path d="M15,8h5L14,2V7A1,1,0,0,0,15,8Z"/>
  </svg>
)

const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.71,18.88l-3.1-3.1a9.1,9.1,0,0,1-2.83,2.83l3.1,3.1a1,1,0,0,0,1.41,0l1.42-1.42A1,1,0,0,0,21.71,18.88Z" fill="currentColor"/>
    <path opacity="0.3" d="M11,20a9,9,0,1,1,9-9A9,9,0,0,1,11,20ZM11,4a7,7,0,1,0,7,7A7,7,0,0,0,11,4ZM8,11a3,3,0,0,1,3-3,1,1,0,0,0,0-2,5,5,0,0,0-5,5,1,1,0,0,0,2,0Z" fill="currentColor"/>
  </svg>
)

const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.06,3l2.72,4.63L21,8.83a1.23,1.23,0,0,1,.66,2l-3.57,4,.52,5.35a1.23,1.23,0,0,1-1.71,1.25L12,19.32,7.07,21.47a1.23,1.23,0,0,1-1.71-1.25l.52-5.35-3.57-4a1.23,1.23,0,0,1,.66-2L8.22,7.67,10.94,3A1.23,1.23,0,0,1,13.06,3Z" />
  </svg>
)

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.3" x="2" y="4" width="20" height="18" rx="1"/>
    <path d="M6,6A1,1,0,0,1,5,5V3A1,1,0,0,1,7,3V5A1,1,0,0,1,6,6Zm5-1V3A1,1,0,0,0,9,3V5a1,1,0,0,0,2,0Zm4,0V3a1,1,0,0,0-2,0V5a1,1,0,0,0,2,0Zm4,0V3a1,1,0,0,0-2,0V5a1,1,0,0,0,2,0Z"/>
    <path d="M8.84,13.09a1.43,1.43,0,0,0,.93-.31,1.13,1.13,0,0,0,.38-.91,1.09,1.09,0,0,0-.31-.78A1.1,1.1,0,0,0,9,10.77a1.42,1.42,0,0,0-.59.1.85.85,0,0,0-.37.26,2,2,0,0,0-.25.42c-.08.18-.16.34-.22.49a.39.39,0,0,1-.21.19A.83.83,0,0,1,7,12.3a.6.6,0,0,1-.43-.19.65.65,0,0,1-.19-.5A1.39,1.39,0,0,1,6.57,11a2.39,2.39,0,0,1,.54-.64A3,3,0,0,1,8,9.83a3.65,3.65,0,0,1,1.18-.18,3.39,3.39,0,0,1,1,.15,2.65,2.65,0,0,1,.81.45,1.88,1.88,0,0,1,.52.68,2,2,0,0,1,.18.83,1.9,1.9,0,0,1-.26,1,3.39,3.39,0,0,1-.73.82,3.12,3.12,0,0,1,.78.56,2.33,2.33,0,0,1,.47.7,2.27,2.27,0,0,1,.16.83,2.65,2.65,0,0,1-.22,1,2.59,2.59,0,0,1-.63.89,3,3,0,0,1-1,.61A3.62,3.62,0,0,1,9,18.43a3,3,0,0,1-1.26-.26,2.68,2.68,0,0,1-.92-.63,2.74,2.74,0,0,1-.54-.78,1.72,1.72,0,0,1-.18-.67.73.73,0,0,1,.21-.54.77.77,0,0,1,.55-.21.55.55,0,0,1,.32.1.44.44,0,0,1,.2.23,4,4,0,0,0,.65,1.21,1.24,1.24,0,0,0,1,.39,1.49,1.49,0,0,0,1.26-.71,1.45,1.45,0,0,0,.22-.81,1.5,1.5,0,0,0-.38-1.08,1.36,1.36,0,0,0-1-.39l-.36,0-.32,0a.72.72,0,0,1-.5-.16.61.61,0,0,1-.17-.45A.54.54,0,0,1,8,13.27a1,1,0,0,1,.63-.18Zm6.51,4.39V12.15a4.82,4.82,0,0,1-2,1.14.58.58,0,0,1-.43-.2.61.61,0,0,1-.19-.45.52.52,0,0,1,.18-.44,3.93,3.93,0,0,1,.67-.37,4.68,4.68,0,0,0,1.13-.7,4.87,4.87,0,0,0,.75-.82,6.26,6.26,0,0,1,.43-.57.51.51,0,0,1,.37-.1.59.59,0,0,1,.5.24,1,1,0,0,1,.19.66v6.71c0,.78-.27,1.18-.8,1.18a.75.75,0,0,1-.58-.24A1.06,1.06,0,0,1,15.35,17.48Z"/>
  </svg>
)

const ArrowRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.41,11H3a1,1,0,0,0,0,2H14.41Z" />
    <path opacity="0.3" d="M14.41,20V4l7.3,7.29a1,1,0,0,1,0,1.42Z" />
  </svg>
)

function Dashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false)

  const handleStartQuestionnaire = () => {
    navigate("/questionnaire")
  }

  const handleViewResults = () => {
    console.log("View matched psychologists")
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const performanceMetrics = [
    { category: "Anxiety", value: 450, color: "bg-blue-400" },
    { category: "Depression", value: 380, color: "bg-green-400" },
    { category: "Stress", value: 420, color: "bg-yellow-400" },
    { category: "Relationship", value: 520, color: "bg-purple-400" },
    { category: "Trauma", value: 320, color: "bg-red-400" },
    { category: "Other", value: 280, color: "bg-teal-400" },
  ]

  const therapistAchievements = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Anxiety & Depression",
      convRate: "78.34%",
      trend: "up",
      avatar: "SJ",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Cognitive Therapy",
      convRate: "83.63%",
      trend: "down",
      avatar: "MC",
      bgColor: "bg-green-100",
      textColor: "text-green-700"
    },
    {
      name: "Dr. Emily Davis",
      specialty: "Family Counseling",
      convRate: "92.56%",
      trend: "up",
      avatar: "ED",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700"
    },
    {
      name: "Dr. James Wilson",
      specialty: "Trauma Recovery",
      convRate: "63.08%",
      trend: "up",
      avatar: "JW",
      bgColor: "bg-amber-100",
      textColor: "text-amber-700"
    },
  ]

  const quickActions = [
    {
      icon: FileIcon,
      title: "Complete Questionnaire",
      description: "Complete the questionnaire to help us match you with the right psychologist",
      action: handleStartQuestionnaire,
      buttonText: hasCompletedQuestionnaire ? "Retake Questionnaire" : "Start Questionnaire",
      buttonVariant: hasCompletedQuestionnaire ? "outline" : "default",
      completed: hasCompletedQuestionnaire,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      icon: SearchIcon,
      title: "Browse Psychologists",
      description: "Explore our network of qualified mental health professionals",
      action: () => navigate("/browse-psychologists"),
      buttonText: "View All Psychologists",
      buttonVariant: "outline",
      iconBg: "bg-teal-50 text-teal-600",
    },
    {
      icon: StarIcon,
      title: "Your Matches",
      description: "View psychologists matched based on your questionnaire responses",
      action: handleViewResults,
      buttonText: hasCompletedQuestionnaire ? "View Matched Psychologists" : "Complete Questionnaire First",
      buttonVariant: hasCompletedQuestionnaire ? "default" : "outline",
      disabled: !hasCompletedQuestionnaire,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      icon: CalendarIcon,
      title: "My Bookings",
      description: "View and manage your upcoming and past therapy sessions",
      action: () => navigate("/my-bookings"),
      buttonText: "View My Bookings",
      buttonVariant: "outline",
      iconBg: "bg-purple-50 text-purple-600",
    },
  ]

  const stats = [
    { value: "500+", label: "Licensed Psychologists", icon: UsersIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { value: "10,000+", label: "Successful Matches", icon: RocketIcon, color: "text-orange-600", bg: "bg-orange-50" },
    { value: "95%", label: "Satisfaction Rate", icon: AwardIcon, color: "text-green-600", bg: "bg-green-50" },
  ]

  return (
    <div className="min-h-screen bg-white font-nunito">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {currentUser?.name || "Guest"}
          </h1>
          <p className="text-gray-500">Here's what's happening with your mental wellness journey.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border border-gray-100 shadow-none hover:border-gray-200 transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Performance/Activity - Left Column */}
          <Card className="lg:col-span-2 border border-gray-100 shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Wellness Overview</CardTitle>
                  <CardDescription>Session distribution by category</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                  <TrendingUpIcon className="w-3 h-3 mr-1" />
                  +2.4% this month
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-4">
                {performanceMetrics.map((metric, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{metric.category}</span>
                      <span className="text-gray-500">{metric.value} sessions</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${metric.color} rounded-full`} 
                        style={{ width: `${(metric.value / 600) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Therapists - Right Column */}
          <Card className="border border-gray-100 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-900">Top Therapists</CardTitle>
              <CardDescription>Highest rated professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {therapistAchievements.map((therapist, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className={`w-10 h-10 ${therapist.bgColor} rounded-full flex items-center justify-center ${therapist.textColor} font-bold text-sm shrink-0`}>
                      {therapist.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {therapist.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{therapist.specialty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {therapist.convRate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-customGreen hover:text-customGreenHover hover:bg-teal-50">
                View All Therapists
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="group border border-gray-100 shadow-none hover:border-customGreen/30 transition-all duration-300 cursor-pointer"
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-customGreen transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {action.description}
                  </p>
                  <div className="flex items-center text-sm font-semibold text-customGreen opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    {action.buttonText}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
