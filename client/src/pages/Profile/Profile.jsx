import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RadioQuestion, DropdownQuestionSelect, CheckboxQuestion, Card, CardContent } from "@/components"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import {
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react'
import {
  ProfileIcon as UserIcon,
  DocumentIcon as HeartIcon,
  StethoscopeIcon,
  FileIcon as BrainIcon,
  BellIcon as SettingsIcon,
  CloseIcon
} from "@/components/icons/DuoTuneIcons"

function Profile() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [expandedSection, setExpandedSection] = useState('basic')
  const [editingSection, setEditingSection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasQuestionnaire, setHasQuestionnaire] = useState(false)

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
          setHasQuestionnaire(false)
          setLoading(false)
          return
        }

        const data = await response.json()

        if (data.success) {
          setProfileData(data.data)
          setHasQuestionnaire(true)
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

  const toggleSection = (sectionId) => {
    if (editingSection) return
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const getFilledFieldsCount = (section) => {
    return section.fields.filter(field => {
      const value = profileData[field.key]
      if (Array.isArray(value)) return value.length > 0
      return value && value !== ''
    }).length
  }

  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Your personal details and demographics',
      icon: <UserIcon className="w-6 h-6" />,
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
      description: 'Your expectations and preferences for therapy',
      icon: <HeartIcon className="w-6 h-6" />,
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
      description: 'Your current health and lifestyle information',
      icon: <StethoscopeIcon className="w-6 h-6" />,
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
      description: 'Your responses to standard mental health questions',
      icon: <BrainIcon className="w-6 h-6" />,
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
      description: 'How you prefer to communicate with your therapist',
      icon: <SettingsIcon className="w-6 h-6" />,
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
              <span key={idx} className="px-3 py-1.5 bg-lightGreen text-customGreen rounded-lg text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        )
      }
      return <span className="text-customGray italic text-sm">Not specified</span>
    }

    if (!value || value === '') {
      return <span className="text-customGray italic text-sm">Not specified</span>
    }

    const label = getLabelForValue(value, field.options)
    return <span className="text-gray-700 font-medium">{label}</span>
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
            <Skeleton className="h-5 w-96" />
          </div>

          {/* User Card skeleton */}
          <div className="mb-8 rounded-3xl bg-lightGray p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>

          {/* Section cards skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-lightGray p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
              </div>
            ))}
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
              <CloseIcon className="w-10 h-10 text-red-600" />
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

  // Show empty state if questionnaire hasn't been filled
  if (!hasQuestionnaire) {
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

          {/* Empty State */}
          <Card className="rounded-3xl border-0 shadow-none bg-lightGray">
            <CardContent className="py-16 px-8">
              <div className="text-center max-w-lg mx-auto">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserIcon className="w-12 h-12 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">
                  Complete Your Questionnaire First
                </h2>
                <p className="text-customGray mb-8 leading-relaxed">
                  To view and edit your profile information, you need to complete the initial questionnaire.
                  This helps us understand your needs and match you with the right therapist.
                </p>
                <Button
                  onClick={() => navigate("/questionnaire")}
                  className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl shadow-none cursor-pointer px-8 h-12"
                >
                  Start Questionnaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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

        {/* Profile Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 select-none">
          <Card className="rounded-2xl border-0 shadow-none bg-lightGreen/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-lightGreen flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-customGreen" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-customGreen">
                    {getFilledFieldsCount(sections[0])}/{sections[0].fields.length}
                  </p>
                  <p className="text-sm text-customGreen">Basic Info</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-none bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-200/50 flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">
                    {getFilledFieldsCount(sections[1])}/{sections[1].fields.length}
                  </p>
                  <p className="text-sm text-amber-700">Therapy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-none bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-200/50 flex items-center justify-center">
                  <StethoscopeIcon className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">
                    {getFilledFieldsCount(sections[2])}/{sections[2].fields.length}
                  </p>
                  <p className="text-sm text-blue-700">Health</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-none bg-lightGray">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-customGray/10 flex items-center justify-center">
                  <BrainIcon className="w-6 h-6 text-customGray" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">
                    {sections.reduce((acc, section) => acc + getFilledFieldsCount(section), 0)}
                  </p>
                  <p className="text-sm text-customGray">Total Fields</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSection === section.id
            const isEditing = editingSection === section.id
            const filledCount = getFilledFieldsCount(section)
            const totalCount = section.fields.length
            const isComplete = filledCount === totalCount

            return (
              <Card
                key={section.id}
                className={`rounded-3xl border-0 shadow-none transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'bg-lightGray' : 'bg-lightGray hover:bg-customGray/5'
                }`}
              >
                <CardContent className="p-0">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    disabled={editingSection !== null}
                    className={`w-full p-6 lg:p-8 flex items-center justify-between text-left transition-all ${
                      editingSection !== null && !isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isExpanded ? 'bg-customGreen text-white' : 'bg-customGray/10 text-customGray'
                      }`}>
                        {section.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-700">
                            {section.title}
                          </h3>
                          <Badge className={`text-xs px-2 py-0.5 ${
                            isComplete
                              ? 'bg-customGray/10 text-customGray '
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          }`}>
                            {filledCount}/{totalCount}
                          </Badge>
                        </div>
                        <p className="text-sm text-customGray mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isComplete && (
                        <div className="w-8 h-8 rounded-full bg-customGray/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-customGray" />
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-customGray" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-customGray" />
                      )}
                    </div>
                  </button>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="px-6 lg:px-8 pb-6 lg:pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="border-t border-gray-200/50 pt-6">
                        {/* Edit Button */}
                        {!isEditing && (
                          <div className="flex justify-end mb-6">
                            <Button
                              onClick={() => handleEdit(section.id)}
                              variant="outline"
                              className="flex items-center gap-2 shadow-none cursor-pointer rounded-xl border-gray-300 hover:bg-white hover:border-customGreen hover:text-customGreen transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit Section
                            </Button>
                          </div>
                        )}

                        {isEditing ? (
                          /* Edit Mode */
                          <div className="space-y-6">
                            {section.fields.map((field) => (
                              <div key={field.key} className="bg-white rounded-2xl p-6">
                                {renderEditField(field)}
                              </div>
                            ))}
                            <div className="flex gap-3 justify-end pt-4">
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
                          /* View Mode */
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.fields.map((field) => (
                              <div
                                key={field.key}
                                className="p-4 rounded-2xl bg-white"
                              >
                                <p className="text-xs font-semibold text-customGray uppercase tracking-wide mb-2">
                                  {field.label}
                                </p>
                                <div>
                                  {renderFieldValue(field, profileData[field.key])}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Profile
