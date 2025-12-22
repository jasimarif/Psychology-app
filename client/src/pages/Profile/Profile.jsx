import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { RadioQuestion, DropdownQuestionSelect, CheckboxQuestion, Card, CardHeader, CardTitle, CardContent } from "@/components"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
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

  // Initialize with sample data - in real app, fetch from database
  const [profileData, setProfileData] = useState({
    // Step 1: Therapy Type & Basic Info
    therapyType: "therapy",
    country: "Pakistan",
    relationshipStatus: "single",
    age: "25-34",
    gender: "male",

    // Step 2: Religion & Therapy Preferences
    religion: "islam",
    religionImportance: "important",
    spiritual: "yes",
    therapyHistory: "no",
    therapyReasons: ["I've been feeling depressed", "I feel anxious or overwhelmed"],
    therapistExpectations: ["Listens", "Guides me to set goals"],
    therapistStyle: "casual",
    therapistApproach: "somewhat-flexible",
    therapistManner: "gentle",

    // Step 3: Current State
    depression: "no",
    eatingHabits: "good",
    physicalHealth: "good",

    // Step 4: Past 2 Weeks Assessment
    littleInterest: "several-days",
    motorActivity: "not-at-all",
    feelingDown: "several-days",
    troubleSleeping: "more-than-half",
    feelingTired: "several-days",
    poorAppetite: "not-at-all",
    feelingBad: "several-days",
    troubleConcentrating: "not-at-all",
    thoughtsHurting: "not-at-all",
    difficultyForWork: "somewhat-difficult",

    // Step 5: Additional Health Info
    employmentStatus: "employed",
    drinkingHabits: "never",
    suicidalThoughts: "never",
    panicAttacks: "no",
    medication: "no",

    // Step 6: Preferences & Resources
    financialStatus: "stable",
    usefulResources: ["Support Groups", "Worksheets"],
    communicateTherapist: "video-calls",
    preferredTherapist: "no-preference"
  })

  const [tempData, setTempData] = useState({})

  const handleEdit = (section) => {
    setEditingSection(section)
    setTempData({ ...profileData })
  }

  const handleSave = () => {
    setProfileData({ ...tempData })
    setEditingSection(null)
    // TODO: Save to database
    console.log("Saved data:", tempData)
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
      icon: <UserIcon className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
      activeColor: 'bg-blue-50',
      activeTextColor: 'text-blue-800',
      textColor: 'text-blue-600',
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
      icon: <HeartIcon className="w-6 h-6 text-red-600" />,
      bgColor: 'bg-red-50',
      activeColor: 'bg-red-50',
      activeTextColor: 'text-red-800',
      textColor: 'text-red-600',
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
      icon: <StethoscopeIcon className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-50',
      activeColor: 'bg-green-50',
      activeTextColor: 'text-green-800',
      textColor: 'text-green-600',
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
      icon: <BrainIcon className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-50',
      activeColor: 'bg-purple-50',
      activeTextColor: 'text-purple-800',
      textColor: 'text-purple-600',
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
      icon: <SettingsIcon className="w-6 h-6 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      activeColor: 'bg-yellow-50',
      activeTextColor: 'text-yellow-800',
      textColor: 'text-yellow-600',
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
     if (!value) return <span className="text-gray-400">Not set</span>

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
      return <span className="text-gray-400">None selected</span>
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

  return (
    <div className="min-h-screen bg-white rounded-lg font-nunito">


      <div className="container mx-auto px-4 lg:px-12 py-8 S mb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <UserIcon className="w-8 h-8 text-customGreenHover" />
            <h1 className="text-3xl md:text-4xl font-bold text-customGreenHover">
              Personal Information
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            View and update your questionnaire responses
          </p>
        </div>

        {/* User Info Card */}
        <div className="mb-8 bg-white rounded-lg overflow-hidden shadow-none border border-gray-100">
          <div className="bg-lightGreen/30 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-customGreen rounded-full flex items-center justify-center shadow-none">
                <PsychologistsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-customGreen">
                  {currentUser?.displayName || 'User'}
                </h2>
                <p className="flex items-center gap-2 text-base text-gray-600">
                  <MailIcon className="w-4 h-4" />
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id)
                  if (editingSection) handleCancel()
                }}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-all duration-200 ${
                  activeSection === section.id
                    ? `${section.activeColor} ${section.activeTextColor} shadow-none  `
                    : `bg-white ${section.textColor} hover:bg-gray-50 `
                }`}
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                </div>
                {activeSection === section.id && (
                  <ChevronRight className="w-4 h-4 text-white/80" />
                )}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {sections.map((section) => {
              if (section.id !== activeSection) return null
              
              return (
                <Card key={section.id} className={`border-none shadow-none ${section.bgColor}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-gray-100">
                    <CardTitle className="text-2xl font-bold text-customGreen">
                      {section.title}
                    </CardTitle>
                    {!editingSection && (
                      <Button
                        onClick={() => handleEdit(section.id)}
                        variant="outline"
                        className="flex items-center gap-2 shadow-none cursor-pointer hover:bg-lightGreen hover:text-customGreen border-customGreen/20"
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
                        <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
                          <Button
                            onClick={handleCancel}
                            variant="ghost"
                            className="flex items-center gap-2 shadow-none cursor-pointer hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-customGreen hover:bg-customGreenHover shadow-none cursor-pointer "
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                        {section.fields.map((field) => (
                          <div
                            key={field.key}
                            className="p-4 rounded-xl bg-white/80 transition-colors border border-gray-100"
                          >
                            <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                              {field.label}
                            </div>
                            <div className="text-gray-900">
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
