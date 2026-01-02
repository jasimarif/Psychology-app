import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RadioQuestion, DropdownQuestionSelect, CheckboxQuestion, Card, CardHeader, CardTitle, CardContent } from "@/components"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import {
  Edit2,
  Save,
  X,
  Heart,
  Brain,
  Activity,
  Settings,
  ChevronRight
} from 'lucide-react'
import {
  ProfileIcon as UserIcon,
  DocumentIcon as HeartIcon,
  StethoscopeIcon,
  FileIcon as BrainIcon,
  BellIcon as SettingsIcon,
  DocumentIcon,
  GraduationIcon,
  BriefcaseIcon,
  MailIcon,
  PsychologistsIcon
} from "@/components/icons/DuoTuneIcons"

function Profile() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [activeSection, setActiveSection] = useState('basic')
  const [editingSection, setEditingSection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [profileData, setProfileData] = useState({
    therapyType: "",
    country: "",
    relationshipStatus: "",
    age: "",
    gender: "",
    religion: "",
    religionImportance: "",
    spiritual: "",
    therapyHistory: "",
    therapyReasons: [],
    therapistExpectations: [],
    therapistStyle: "",
    therapistApproach: "",
    therapistManner: "",
    depression: "",
    eatingHabits: "",
    physicalHealth: "",
    littleInterest: "",
    motorActivity: "",
    feelingDown: "",
    troubleSleeping: "",
    feelingTired: "",
    poorAppetite: "",
    feelingBad: "",
    troubleConcentrating: "",
    thoughtsHurting: "",
    difficultyForWork: "",
    employmentStatus: "",
    drinkingHabits: "",
    suicidalThoughts: "",
    panicAttacks: "",
    medication: "",
    financialStatus: "",
    usefulResources: [],
    communicateTherapist: "",
    preferredTherapist: ""
  })

  const [tempData, setTempData] = useState({})

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profiles/${currentUser.uid}`
        )

        if (response.status === 404) {
          setLoading(false)
          return
        }

        const data = await response.json()

        if (data.success) {
          setProfileData(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [currentUser])

  const handleEdit = (section) => {
    setEditingSection(section)
    setTempData({ ...profileData })
  }

  const handleSave = async () => {
    if (!currentUser) {
      alert("You must be logged in to save your profile")
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profiles/${currentUser.uid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tempData)
        }
      )

      const data = await response.json()

      if (data.success) {
        setProfileData({ ...tempData })
        setEditingSection(null)
        toast.success("Profile updated!", {
          description: "Your changes have been saved successfully."
        })
      } else {
        toast.error("Failed to save profile", {
          description: data.message || "Please try again."
        })
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Something went wrong", {
        description: "An error occurred while saving your profile."
      })
    }
  }

  const handleCancel = () => {
    setEditingSection(null)
    setTempData({})
  }

  const handleRadioChange = (field, value) => {
    setTempData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field, value) => {
    setTempData(prev => {
      const currentValues = prev[field] || []
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(v => v !== value) }
      } else {
        return { ...prev, [field]: [...currentValues, value] }
      }
    })
  }

  const getLabelForValue = (value, options) => {
    const option = options.find(opt => opt.id === value)
    return option ? option.label : value
  }

  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: <UserIcon className="w-5 h-5" />,
      bgColor: 'bg-lightGray',
      activeColor: 'bg-lightGreen',
      activeTextColor: 'text-customGreen',
      textColor: 'text-customGray',
      fields: [
        {
          key: 'therapyType',
          label: 'Therapy Type',
          type: 'radio',
          options: [
            { id: 'therapy', label: 'Therapy' },
            { id: 'teen', label: 'Teen Therapy' },
            { id: 'couples', label: 'Couples Therapy' }
          ]
        },
        {
          key: 'country',
          label: 'Country',
          type: 'select',
          options: [
            { id: 'Pakistan', label: 'Pakistan' },
            { id: 'United States', label: 'United States' },
            { id: 'Canada', label: 'Canada' },
            { id: 'United Kingdom', label: 'United Kingdom' },
            { id: 'Australia', label: 'Australia' },
            { id: 'Other', label: 'Other' }
          ]
        },
        {
          key: 'relationshipStatus',
          label: 'Relationship Status',
          type: 'radio',
          options: [
            { id: 'single', label: 'Single' },
            { id: 'in-a-relationship', label: 'In a relationship' },
            { id: 'married', label: 'Married' },
            { id: 'divorced', label: 'Divorced' },
            { id: 'widowed', label: 'Widowed' },
            { id: 'other', label: 'Other' }
          ]
        },
        {
          key: 'age',
          label: 'Age Range',
          type: 'select',
          options: [
            { id: '18-24', label: '18-24' },
            { id: '25-34', label: '25-34' },
            { id: '35-44', label: '35-44' },
            { id: '45-54', label: '45-54' },
            { id: '55-64', label: '55-64' },
            { id: '65+', label: '65+' }
          ]
        },
        {
          key: 'gender',
          label: 'Gender Identity',
          type: 'radio',
          options: [
            { id: 'male', label: 'Male' },
            { id: 'female', label: 'Female' },
            { id: 'non-binary', label: 'Non-binary' },
            { id: 'prefer-not-to-say', label: 'Prefer not to say' }
          ]
        }
      ]
    },
    {
      id: 'therapy',
      title: 'Therapy Preferences',
      icon: <HeartIcon className="w-5 h-5" />,
      bgColor: 'bg-lightGray',
      activeColor: 'bg-lightGreen',
      activeTextColor: 'text-customGreen',
      textColor: 'text-customGray',
      fields: [
        {
          key: 'religion',
          label: 'Religion',
          type: 'radio',
          options: [
            { id: 'islam', label: 'Islam' },
            { id: 'christianity', label: 'Christianity' },
            { id: 'judaism', label: 'Judaism' },
            { id: 'hinduism', label: 'Hinduism' },
            { id: 'buddhism', label: 'Buddhism' },
            { id: 'other', label: 'Other' }
          ]
        },
        {
          key: 'religionImportance',
          label: 'Religion Importance',
          type: 'radio',
          options: [
            { id: 'very-important', label: 'Very Important' },
            { id: 'important', label: 'Important' },
            { id: 'somewhat-important', label: 'Somewhat Important' },
            { id: 'not-important', label: 'Not Important' }
          ]
        },
        {
          key: 'spiritual',
          label: 'Spiritual',
          type: 'radio',
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]
        },
        {
          key: 'therapyHistory',
          label: 'Previous Therapy Experience',
          type: 'radio',
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]
        },
        {
          key: 'therapyReasons',
          label: 'Reasons for Therapy',
          type: 'checkbox',
          options: [
            "I've been feeling depressed",
            "I feel anxious or overwhelmed",
            "My mood is interfering with my job/school performance",
            "I struggle with building or maintaining relationships",
            "I can't find purpose and meaning in my life",
            "I am grieving",
            "I have experienced trauma",
            "I need to talk through a specific challenge",
            "I want to gain self confidence",
            "I want to improve myself but I don't know where to start",
            "Recommended to me (friend, family, doctor)",
            "Just exploring",
            "Other"
          ]
        },
        {
          key: 'therapistExpectations',
          label: 'Therapist Expectations',
          type: 'checkbox',
          options: [
            'Listens',
            'Explores my past',
            'Teaches me new skills',
            'Challenges my beliefs',
            'Assigns me homework',
            'Guides me to set goals',
            'Proactively checks in with me',
            'Other',
            "I don't know"
          ]
        },
        {
          key: 'therapistStyle',
          label: 'Preferred Style',
          type: 'radio',
          options: [
            { id: 'casual', label: 'Casual' },
            { id: 'somewhat-casual', label: 'Somewhat casual' },
            { id: 'no-preference', label: 'No preference' },
            { id: 'somewhat-formal', label: 'Somewhat formal' },
            { id: 'formal', label: 'Formal' }
          ]
        },
        {
          key: 'therapistApproach',
          label: 'Therapist Approach',
          type: 'radio',
          options: [
            { id: 'flexible', label: 'Flexible' },
            { id: 'somewhat-flexible', label: 'Somewhat flexible' },
            { id: 'no-preference', label: 'No preference' },
            { id: 'somewhat-structured', label: 'Somewhat structured' },
            { id: 'structured', label: 'Structured' }
          ]
        },
        {
          key: 'therapistManner',
          label: 'Therapist Manner',
          type: 'radio',
          options: [
            { id: 'gentle', label: 'Gentle' },
            { id: 'somewhat-gentle', label: 'Somewhat gentle' },
            { id: 'no-preference', label: 'No preference' },
            { id: 'somewhat-direct', label: 'Somewhat direct' },
            { id: 'direct', label: 'Direct' }
          ]
        }
      ]
    },
    {
      id: 'health',
      title: 'Health & Wellness',
      icon: <StethoscopeIcon className="w-5 h-5" />,
      bgColor: 'bg-lightGray',
      activeColor: 'bg-lightGreen',
      activeTextColor: 'text-customGreen',
      textColor: 'text-customGray',
      fields: [
        {
          key: 'depression',
          label: 'Current Depression',
          type: 'radio',
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]
        },
        {
          key: 'eatingHabits',
          label: 'Eating Habits',
          type: 'radio',
          options: [
            { id: 'good', label: 'Good' },
            { id: 'fair', label: 'Fair' },
            { id: 'poor', label: 'Poor' }
          ]
        },
        {
          key: 'physicalHealth',
          label: 'Physical Health',
          type: 'radio',
          options: [
            { id: 'good', label: 'Good' },
            { id: 'fair', label: 'Fair' },
            { id: 'poor', label: 'Poor' }
          ]
        },
        {
          key: 'employmentStatus',
          label: 'Employment Status',
          type: 'radio',
          options: [
            { id: 'employed', label: 'Employed' },
            { id: 'unemployed', label: 'Unemployed' }
          ]
        },
        {
          key: 'drinkingHabits',
          label: 'Drinking Habits',
          type: 'radio',
          options: [
            { id: 'never', label: 'Never' },
            { id: 'occasionally', label: 'Occasionally' },
            { id: 'regularly', label: 'Regularly' },
            { id: 'frequently', label: 'Frequently' }
          ]
        },
        {
          key: 'panicAttacks',
          label: 'Anxiety/Panic Attacks',
          type: 'radio',
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]
        },
        {
          key: 'medication',
          label: 'Mental Health Medication',
          type: 'radio',
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]
        }
      ]
    },
    {
      id: 'assessment',
      title: 'Mental Health Assessment',
      icon: <BrainIcon className="w-5 h-5" />,
      bgColor: 'bg-lightGray',
      activeColor: 'bg-lightGreen',
      activeTextColor: 'text-customGreen',
      textColor: 'text-customGray',
      fields: [
        {
          key: 'littleInterest',
          label: 'Little interest or pleasure in doing things',
          type: 'radio',
          options: [
            { id: 'not-at-all', label: 'Not at all' },
            { id: 'several-days', label: 'Several days' },
            { id: 'more-than-half', label: 'More than half the days' },
            { id: 'nearly-every-day', label: 'Nearly every day' }
          ]
        },
        {
          key: 'feelingDown',
          label: 'Feeling down, depressed or hopeless',
          type: 'radio',
          options: [
            { id: 'not-at-all', label: 'Not at all' },
            { id: 'several-days', label: 'Several days' },
            { id: 'more-than-half', label: 'More than half the days' },
            { id: 'nearly-every-day', label: 'Nearly every day' }
          ]
        },
        {
          key: 'troubleSleeping',
          label: 'Trouble falling/staying asleep',
          type: 'radio',
          options: [
            { id: 'not-at-all', label: 'Not at all' },
            { id: 'several-days', label: 'Several days' },
            { id: 'more-than-half', label: 'More than half the days' },
            { id: 'nearly-every-day', label: 'Nearly every day' }
          ]
        },
        {
          key: 'feelingTired',
          label: 'Feeling tired or having little energy',
          type: 'radio',
          options: [
            { id: 'not-at-all', label: 'Not at all' },
            { id: 'several-days', label: 'Several days' },
            { id: 'more-than-half', label: 'More than half the days' },
            { id: 'nearly-every-day', label: 'Nearly every day' }
          ]
        },
        {
          key: 'poorAppetite',
          label: 'Poor appetite or overeating',
          type: 'radio',
          options: [
            { id: 'not-at-all', label: 'Not at all' },
            { id: 'several-days', label: 'Several days' },
            { id: 'more-than-half', label: 'More than half the days' },
            { id: 'nearly-every-day', label: 'Nearly every day' }
          ]
        },
        {
          key: 'feelingBad',
          label: 'Feeling bad about yourself',
          type: 'radio',
          options: [
            { id: 'not-at-all', label: 'Not at all' },
            { id: 'several-days', label: 'Several days' },
            { id: 'more-than-half', label: 'More than half the days' },
            { id: 'nearly-every-day', label: 'Nearly every day' }
          ]
        },
        {
          key: 'troubleConcentrating',
          label: 'Trouble concentrating',
          type: 'radio',
          options: [
            { id: 'not-at-all', label: 'Not at all' },
            { id: 'several-days', label: 'Several days' },
            { id: 'more-than-half', label: 'More than half the days' },
            { id: 'nearly-every-day', label: 'Nearly every day' }
          ]
        },
        {
          key: 'difficultyForWork',
          label: 'Difficulty with daily activities',
          type: 'radio',
          options: [
            { id: 'not-difficult', label: 'Not difficult at all' },
            { id: 'somewhat-difficult', label: 'Somewhat difficult' },
            { id: 'very-difficult', label: 'Very difficult' },
            { id: 'extremely-difficult', label: 'Extremely difficult' }
          ]
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Communication Preferences',
      icon: <SettingsIcon className="w-5 h-5" />,
      bgColor: 'bg-lightGray',
      activeColor: 'bg-lightGreen',
      activeTextColor: 'text-customGreen',
      textColor: 'text-customGray',
      fields: [
        {
          key: 'financialStatus',
          label: 'Financial Situation',
          type: 'radio',
          options: [
            { id: 'stable', label: 'Stable' },
            { id: 'somewhat-stable', label: 'Somewhat Stable' },
            { id: 'unstable', label: 'Unstable' }
          ]
        },
        {
          key: 'usefulResources',
          label: 'Useful Resources',
          type: 'checkbox',
          options: [
            "Support Groups",
            "Therapy journals",
            "Worksheets",
            "Goal/habit tracking",
            "Others",
            "I don't know"
          ]
        },
        {
          key: 'communicateTherapist',
          label: 'Communication Method',
          type: 'radio',
          options: [
            { id: 'mostly-text', label: 'Mostly text-based (chat, email)' },
            { id: 'video-calls', label: 'Video calls' },
            { id: 'in-person', label: 'In-person sessions' }
          ]
        },
        {
          key: 'preferredTherapist',
          label: 'Therapist Preference',
          type: 'radio',
          options: [
            { id: 'male-therapist', label: 'Male therapist' },
            { id: 'female-therapist', label: 'Female therapist' },
            { id: 'no-preference', label: 'No preference' }
          ]
        }
      ]
    }
  ]

  const renderFieldValue = (field, value) => {
    if (field.type === 'checkbox') {
      if (Array.isArray(value) && value.length > 0) {
        return (
          <div className="flex flex-wrap gap-2">
            {value.map((item, idx) => (
              <span key={idx} className="px-3 py-1 bg-lightGreen text-customGreen rounded-full text-sm">
                {item}
              </span>
            ))}
          </div>
        )
      }
      return <span className="text-gray-400 italic">N/A</span>
    }

    if (!value || value === '') {
      return <span className="text-gray-400 italic">N/A</span>
    }

    const label = getLabelForValue(value, field.options)
    return <span className="text-customGreen font-medium">{label}</span>
  }

  const renderEditField = (field) => {
    const data = editingSection ? tempData : profileData

    if (field.type === 'radio') {
      return (
        <RadioQuestion
          title={field.label}
          options={field.options}
          selectedValue={data[field.key]}
          onSelect={(value) => handleRadioChange(field.key, value)}
        />
      )
    } else if (field.type === 'select') {
      return (
        <DropdownQuestionSelect
          title={field.label}
          options={field.options}
          selectedValue={data[field.key]}
          onChange={(value) => handleRadioChange(field.key, value)}
          placeholder={`Select ${field.label.toLowerCase()}`}
        />
      )
    } else if (field.type === 'checkbox') {
      return (
        <CheckboxQuestion
          title={field.label}
          options={field.options}
          selectedValues={data[field.key] || []}
          onToggle={(option) => handleCheckboxChange(field.key, option)}
        />
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white rounded-lg px-4 font-nunito">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-12 w-72 mb-4" />
            <Skeleton className="h-5 w-80" />
          </div>

          {/* User Info Card skeleton */}
          <div className="mb-8 rounded-2xl overflow-hidden bg-lightGray">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar skeleton */}
            <div className="md:col-span-1 space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>

            {/* Main Content skeleton */}
            <div className="md:col-span-3">
              <Card className="border-0 shadow-none rounded-2xl bg-lightGray">
                <CardHeader className="pb-6 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-10 w-24 rounded-xl" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white">
                        <Skeleton className="h-3 w-24 mb-2" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white rounded-lg px-4 font-nunito flex items-center justify-center">
        <Card className="max-w-md w-full rounded-3xl shadow-none border-0 bg-lightGray">
          <CardContent className="pt-12 pb-8 px-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">Something went wrong</h2>
            <p className="text-customGray mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl shadow-none cursor-pointer"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white rounded-lg px-4 font-nunito animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <header className="select-none">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-customGreen mb-4">
              Your Profile
            </p>
            <h1 className="text-5xl md:text-6xl font-light text-gray-700 tracking-tight mb-4">
              Personal Information
            </h1>
            <p className="text-lg text-customGray font-light max-w-xl">
              View and update your questionnaire responses
            </p>
          </header>
        </div>

        {/* User Info Card */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-none border-0 bg-lightGray select-none">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-customGreen rounded-full flex items-center justify-center shadow-none ring-4 ring-customGreen/10">
                <PsychologistsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-700">
                  {currentUser?.displayName || 'User'}
                </h2>
                <p className="flex items-center gap-2 text-sm text-customGray">
                  <MailIcon className="w-4 h-4" />
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 space-y-2 select-none">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id)
                  if (editingSection) handleCancel()
                }}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-all duration-200 cursor-pointer ${
                  activeSection === section.id
                    ? `${section.activeColor} ${section.activeTextColor} font-semibold`
                    : `bg-lightGray text-gray-600 hover:bg-gray-100`
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={activeSection === section.id ? 'text-customGreen' : 'text-customGray'}>
                    {section.icon}
                  </span>
                  <span className="font-medium text-sm">{section.title}</span>
                </div>
                {activeSection === section.id && (
                  <ChevronRight className="w-4 h-4 text-customGreen" />
                )}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {sections.map((section) => {
              if (section.id !== activeSection) return null

              return (
                <Card key={section.id} className="border-0 shadow-none rounded-2xl bg-lightGray">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-gray-200/50">
                    <CardTitle className="text-xl font-bold text-gray-700">
                      {section.title}
                    </CardTitle>
                    {!editingSection && (
                      <Button
                        onClick={() => handleEdit(section.id)}
                        variant="outline"
                        className="flex items-center gap-2 shadow-none cursor-pointer rounded-xl border-gray-300 hover:bg-white hover:border-gray-300 hover:text-customGreen transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6">
                    {editingSection === section.id ? (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {section.fields.map((field) => (
                          <div key={field.key}>
                            {renderEditField(field)}
                          </div>
                        ))}
                        <div className="flex gap-3 justify-end pt-6 border-t border-gray-200/50">
                          <Button
                            onClick={handleCancel}
                            variant="outline"
                            className="flex items-center gap-2 shadow-none cursor-pointer rounded-xl border-red-200 text-red-600 hover:text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-customGreen hover:bg-customGreenHover shadow-none cursor-pointer rounded-xl transition-all"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                        {section.fields.map((field) => (
                          <div
                            key={field.key}
                            className="p-4 rounded-xl bg-white transition-colors"
                          >
                            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                              {field.label}
                            </div>
                            <div className="text-sm text-gray-700">
                              {renderFieldValue(field, profileData[field.key])}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
