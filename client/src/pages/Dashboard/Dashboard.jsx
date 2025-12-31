import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, TrendingUp } from "lucide-react"
import {
  UsersIcon,
  RocketIcon,
  AwardIcon,
  DashboardFileIcon,
  DashboardSearchIcon,
  DashboardStarIcon,
  CalendarIcon,
  ArrowRightIcon,
  DashboardIcon
} from "@/components/icons/DuoTuneIcons"

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


  const performanceMetrics = [
    { category: "Anxiety", value: 450, size: 180, color: "bg-blue-400", x: 15, y: 50 },
    { category: "Depression", value: 380, size: 150, color: "bg-green-400", x: 30, y: 45 },
    { category: "Stress", value: 420, size: 165, color: "bg-yellow-400", x: 45, y: 42 },
    { category: "Relationship", value: 520, size: 200, color: "bg-purple-400", x: 60, y: 38 },
    { category: "Trauma", value: 320, size: 130, color: "bg-red-400", x: 52, y: 58 },
    { category: "Other", value: 280, size: 115, color: "bg-teal-400", x: 75, y: 55 },
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
      icon: DashboardFileIcon,
      title: "Complete Questionnaire",
      description: "Complete the questionnaire to help us match you with the right psychologist",
      action: handleStartQuestionnaire,
      buttonText: hasCompletedQuestionnaire ? "Retake Questionnaire" : "Start Questionnaire",
      buttonVariant: hasCompletedQuestionnaire ? "outline" : "default",
      completed: hasCompletedQuestionnaire,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      icon: DashboardSearchIcon,
      title: "Browse Psychologists",
      description: "Explore our network of qualified mental health professionals",
      action: () => navigate("/browse-psychologists"),
      buttonText: "View All Psychologists",
      buttonVariant: "outline",
      iconBg: "bg-teal-50 text-teal-600",
    },
    {
      icon: DashboardStarIcon,
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
    { value: "500+", label: "Licensed Psychologists", icon: UsersIcon, color: "text-blue-600", bg: "bg-blue-100", bgColor: "bg-blue-50" },
    { value: "10,000+", label: "Successful Matches", icon: RocketIcon, color: "text-orange-600", bg: "bg-orange-100", bgColor: "bg-orange-50" },
    { value: "95%", label: "Satisfaction Rate", icon: AwardIcon, color: "text-green-600", bg: "bg-green-100", bgColor: "bg-green-50" },
  ]

  return (
    <div className="min-h-screen bg-white rounded-lg font-nunito px-4 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full px-0 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 px-4 sm:px-0">
          <div className="flex items-center gap-3 mb-2">
            <DashboardIcon className="w-8 h-8 text-customGreenHover" />
            <h1 className="text-3xl md:text-4xl font-bold text-customGreenHover">
              Dashboard
            </h1>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 px-4 sm:px-0">
          {stats.map((stat, index) => (
            <Card key={index} className={`border-none shadow-none ${stat.bgColor} transition-colors`}>
              <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-customGreen">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 px-4 sm:px-0">
          {/* Performance Overview - Left Column */}
          <Card className="lg:col-span-2 rounded-2xl sm:rounded-3xl border bg-white/80 backdrop-blur shadow-none">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-customGreen">Performance Overview</CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-500">Session types from all channels</CardDescription>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm text-gray-500 hover:text-customGreen rounded-lg px-2 sm:px-3"
                  >
                    Month
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-medium px-2 sm:px-3"
                  >
                    Week
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-4xl font-bold text-customGreen">8,55</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-md text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    2.2%
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Average sessions per interaction</p>
              </div>

              {/* Bubble Chart */}
              <div className="relative h-48 sm:h-64 bg-linear-to-br from-gray-50 to-blue-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden">
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-7 grid-rows-7 opacity-20">
                  {[...Array(49)].map((_, i) => (
                    <div key={i} className="border-r border-b border-gray-300"></div>
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 py-4">
                  {[700, 600, 500, 400, 300, 200, 100, 0].map((val) => (
                    <span key={val}>{val}</span>
                  ))}
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-2 left-12 right-4 flex justify-between text-xs text-gray-400">
                  {[0, 100, 200, 300, 400, 500, 600, 700].map((val) => (
                    <span key={val}>{val}</span>
                  ))}
                </div>

                {/* Bubbles */}
                <div className="relative h-full w-full pl-8 pb-6">
                  {performanceMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className={`absolute ${metric.color} rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center group`}
                      style={{
                        width: `${metric.size}px`,
                        height: `${metric.size}px`,
                        left: `${metric.x}%`,
                        top: `${metric.y}%`,
                        opacity: 0.85,
                      }}
                    >
                      <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {performanceMetrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 ${metric.color} rounded-full`}></div>
                    <span className="text-xs text-gray-600">{metric.category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Therapists Achievements - Right Column */}
          <Card className="rounded-2xl sm:rounded-3xl border shadow-none bg-white/80 backdrop-blur">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl font-bold text-customGreen">Top Therapists</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500">Avg. 89.34% Success Rate</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {/* Tabs */}
              <div className="flex gap-1 mb-4 sm:mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
                {["All", "Anxiety", "Stress", "Trauma", "Other"].map((tab) => (
                  <button
                    key={tab}
                    className={`shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all ${
                      tab === "All"
                        ? "bg-white text-customGreen shadow-none"
                        : "text-gray-500 hover:text-customGreen"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Therapist List */}
              <div className="space-y-2 sm:space-y-3">
                {therapistAchievements.map((therapist, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${therapist.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center ${therapist.textColor} font-bold text-xs sm:text-sm shrink-0`}>
                        {therapist.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-xs sm:text-sm text-customGreen truncate">
                          {therapist.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">{therapist.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-customGreen">
                        {therapist.convRate}
                      </span>
                      {/* Mini trend chart - hidden on mobile */}
                      <div className="w-12 sm:w-16 h-6 sm:h-8 relative hidden sm:block">
                        <svg className="w-full h-full" viewBox="0 0 60 30">
                          <path
                            d={
                              therapist.trend === "up"
                                ? "M 0 25 Q 15 20, 30 15 T 60 5"
                                : "M 0 5 Q 15 10, 30 15 T 60 25"
                            }
                            fill="none"
                            stroke={therapist.trend === "up" ? "#10b981" : "#ef4444"}
                            strokeWidth="2"
                            className="opacity-50"
                          />
                        </svg>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {/* Welcome Card */}
          <Card className="rounded-2xl sm:rounded-3xl border shadow-none bg-customGreen text-white overflow-hidden">
            <CardContent className="p-5 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Welcome to Mental Wellness</h3>
              <p className="text-blue-100 text-xs sm:text-sm mb-4 sm:mb-6">
                Join the movement make a difference.
              </p>
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-white/30 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="rounded-2xl sm:rounded-3xl border shadow-none bg-white/80 backdrop-blur">
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
              <CardDescription className="text-xs sm:text-sm text-gray-500">Expected Sessions</CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-customGreen">69,700</CardTitle>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-md text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  2.2%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Individual</span>
                  </div>
                  <span className="font-semibold text-customGreen">$7,660</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Couples</span>
                  </div>
                  <span className="font-semibold text-customGreen">$2,820</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-600">Group</span>
                  </div>
                  <span className="font-semibold text-customGreen">$45,257</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl sm:rounded-3xl border shadow-none bg-white/80 backdrop-blur">
            <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
              <CardDescription className="text-xs sm:text-sm text-gray-500">Average Daily Sessions</CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-customGreen">2,420</CardTitle>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-md text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  2.6%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-customGreen mb-2 sm:mb-3">$14,094</CardTitle>
              <p className="text-xs text-gray-500 mb-3 sm:mb-4">Another $48,348 to Goal</p>

              {/* Mini bar chart */}
              <div className="flex items-end gap-1 h-12 sm:h-16">
                {[40, 25, 45, 30, 60, 70, 50].map((height, idx) => (
                  <div key={idx} className="flex-1 bg-customGreen rounded-t" style={{ height: `${height}%` }}></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="my-6 sm:my-8 px-4 sm:px-0">
          <h2 className="text-base sm:text-lg font-bold text-customGreen mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="group border shadow-none hover:border-customGreen/30 transition-all duration-300 cursor-pointer rounded-2xl"
                onClick={action.action}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform group-hover:scale-110 duration-300`}>
                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-customGreen mb-2 group-hover:text-customGreen transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-2">
                    {action.description}
                  </p>
                  <div className="flex items-center text-xs sm:text-sm font-semibold text-customGreen opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    {action.buttonText}
                    <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
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
