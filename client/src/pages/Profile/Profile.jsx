import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { RadioQuestion, DropdownQuestionSelect, CheckboxQuestion, MultiSelectDropdown, Card, CardContent } from "@/components"
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
  BellIcon as SettingsIcon,
  CloseIcon
} from "@/components/icons/DuoTuneIcons"
import languages from "@cospired/i18n-iso-languages"
import enLang from "@cospired/i18n-iso-languages/langs/en.json"

languages.registerLocale(enLang)

function Profile() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [expandedSection, setExpandedSection] = useState('basic')
  const [editingSection, setEditingSection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasQuestionnaire, setHasQuestionnaire] = useState(false)

  const [profileData, setProfileData] = useState({
    // Step 1: Basic Info
    therapyType: "",
    country: "",
    age: "",
    gender: "",
    // Step 2: What You're Looking For
    therapyReasons: [],
    preferredLanguages: [],
    // Step 3: Preferences
    preferredTherapist: ""
  })

  const [tempData, setTempData] = useState({})
  const [otherReasonText, setOtherReasonText] = useState("")

  // Predefined therapy reasons options
  const predefinedTherapyReasons = [
    "Depression",
    "Anxiety",
    "Stress Management",
    "Relationship Issues",
    "Trauma & PTSD",
    "Grief & Loss",
    "Self-Esteem",
    "Career Counseling",
    "Family Issues",
    "Addiction",
    "Eating Disorders",
    "Other"
  ]

  // Helper to find custom "other" value from therapyReasons
  const getOtherReasonFromData = (reasons) => {
    if (!Array.isArray(reasons)) return ""
    const customReason = reasons.find(r => !predefinedTherapyReasons.includes(r))
    return customReason || ""
  }

  // Helper to get display values (replace custom with "Other" for checkbox display)
  const getDisplayTherapyReasons = (reasons) => {
    if (!Array.isArray(reasons)) return []
    return reasons.map(r => predefinedTherapyReasons.includes(r) ? r : "Other")
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/${currentUser.uid}`
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
    // When editing, convert custom therapy reasons to "Other" for checkbox display
    const editData = { ...profileData }
    if (section === 'needs' && profileData.therapyReasons) {
      const otherValue = getOtherReasonFromData(profileData.therapyReasons)
      setOtherReasonText(otherValue)
      editData.therapyReasons = getDisplayTherapyReasons(profileData.therapyReasons)
    }
    setTempData(editData)
  }

  const handleSave = async () => {
    if (!currentUser) {
      alert("You must be logged in to save your profile")
      return
    }

    try {
      // Prepare data for saving - replace "Other" with actual text
      const saveData = { ...tempData }
      if (saveData.therapyReasons && saveData.therapyReasons.includes("Other")) {
        if (otherReasonText.trim()) {
          saveData.therapyReasons = saveData.therapyReasons.map(r =>
            r === "Other" ? otherReasonText.trim() : r
          )
        } else {
          // Remove "Other" if no text provided
          saveData.therapyReasons = saveData.therapyReasons.filter(r => r !== "Other")
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/${currentUser.uid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saveData)
        }
      )

      const data = await response.json()

      if (data.success) {
        setProfileData({ ...saveData })
        setEditingSection(null)
        setOtherReasonText("")
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
    setOtherReasonText("")
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

  const allLanguages = useMemo(() => {
    const langCodes = languages.getAlpha2Codes()
    const languageList = Object.keys(langCodes).map(code => {
      return languages.getName(code, "en")
    }).filter(Boolean).sort()
    
    return languageList
  }, [])

  const getFieldOptions = (field) => {
    if (field.options === 'languages') {
      return allLanguages
    }
    return field.options
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
      description: 'Your personal details and therapy type',
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
            { id: 'India', label: 'India' },
            { id: 'Other', label: 'Other' }
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
      id: 'needs',
      title: 'What You\'re Looking For',
      description: 'Your therapy needs and language preferences',
      icon: <HeartIcon className="w-6 h-6" />,
      fields: [
        {
          key: 'therapyReasons',
          label: 'What are you seeking help with?',
          type: 'checkbox',
          options: [
            "Depression",
            "Anxiety",
            "Stress Management",
            "Relationship Issues",
            "Trauma & PTSD",
            "Grief & Loss",
            "Self-Esteem",
            "Career Counseling",
            "Family Issues",
            "Addiction",
            "Eating Disorders",
            "Other"
          ]
        },
        {
          key: 'preferredLanguages',
          label: 'Preferred Languages',
          type: 'checkbox',
          options: 'languages' // Special marker to use dynamic language list
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Session Preferences',
      description: 'Your therapist preferences',
      icon: <SettingsIcon className="w-6 h-6" />,
      fields: [
        {
          key: 'preferredTherapist',
          label: 'Therapist Gender Preference',
          type: 'radio',
          options: [
            { id: 'male', label: 'Male therapist' },
            { id: 'female', label: 'Female therapist' },
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

    const options = getFieldOptions(field)
    const label = getLabelForValue(value, options)
    return <span className="text-gray-700 font-medium">{label}</span>
  }

  const renderEditField = (field) => {
    const data = editingSection ? tempData : profileData
    const options = getFieldOptions(field)

    if (field.type === 'radio') {
      return (
        <RadioQuestion
          title={field.label}
          options={options}
          selectedValue={data[field.key]}
          onSelect={(value) => handleRadioChange(field.key, value)}
        />
      )
    } else if (field.type === 'select') {
      return (
        <DropdownQuestionSelect
          title={field.label}
          options={options}
          selectedValue={data[field.key]}
          onChange={(value) => handleRadioChange(field.key, value)}
          placeholder={`Select ${field.label.toLowerCase()}`}
        />
      )
    } else if (field.type === 'checkbox') {
      if (field.options === 'languages') {
        return (
          <MultiSelectDropdown
            title={field.label}
            options={options}
            selectedValues={data[field.key] || []}
            onChange={(values) => setTempData(prev => ({ ...prev, [field.key]: values }))}
            placeholder="Select languages..."
            searchPlaceholder="Search languages..."
          />
        )
      }
      return (
        <CheckboxQuestion
          title={field.label}
          options={options}
          selectedValues={data[field.key] || []}
          onToggle={(option) => handleCheckboxChange(field.key, option)}
          otherOption={field.key === 'therapyReasons'}
          otherValue={field.key === 'therapyReasons' ? otherReasonText : ""}
          onOtherChange={field.key === 'therapyReasons' ? (value) => setOtherReasonText(value) : undefined}
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
                  <p className="text-sm text-amber-700">Needs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-none bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-200/50 flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">
                    {getFilledFieldsCount(sections[2])}/{sections[2].fields.length}
                  </p>
                  <p className="text-sm text-blue-700">Preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-none bg-lightGray">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-customGray/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-customGray" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">
                    {sections.reduce((acc, section) => acc + getFilledFieldsCount(section), 0)}/7
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
