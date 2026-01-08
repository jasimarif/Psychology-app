import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { RadioQuestion, DropdownQuestionSelect, CheckboxQuestion, MultiSelectDropdown } from "@/components"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Info, MessageCircle, Users, ArrowLeft } from 'lucide-react'
import { QuestionnaireIcon, CheckIcon } from "@/components/icons/DuoTuneIcons"
import { Footer } from "../../components"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { getData } from "country-list"
import languages from "@cospired/i18n-iso-languages"
import enLang from "@cospired/i18n-iso-languages/langs/en.json"

languages.registerLocale(enLang)

function Questionnaire() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    // Step 1: Therapy Type & Basic Info
    therapyType: "",
    country: "Pakistan",
    age: "",
    gender: "",

    // Step 2: What You're Looking For
    therapyReasons: [],
    otherReason: "",
    preferredLanguages: [],

    // Step 3: Preferences
    preferredTherapist: ""
  })

  useEffect(() => {
    const checkProfileExists = async () => {
      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/${currentUser.uid}`
        )

        if (response.status === 404) {
          console.log("Profile not found - user can fill questionnaire")
          setProfileExists(false)
        } else if (response.ok) {
          const data = await response.json()
          console.log("Profile data:", data)
          if (data.success && data.data) {
            setProfileExists(true)
          } else {
            setProfileExists(false)
          }
        } else {
          setProfileExists(false)
        }
      } catch (error) {
        console.error("Error checking profile:", error)
        setProfileExists(false)
      } finally {
        setLoading(false)
      }
    }

    checkProfileExists()
  }, [currentUser])

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || []
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(v => v !== value) }
      } else {
        return { ...prev, [field]: [...currentValues, value] }
      }
    })
  }

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAutoNext = (field, value) => {
    handleRadioChange(field, value)
    setTimeout(() => {
      handleNext()
    }, 300)
  }

  const handleNext = () => {
    if (currentStep <= totalSteps) {
      setIsAnimating(true)
      setTimeout(() => {
        // Step 1: 4 questions (therapyType, country, age, gender)
        if (currentStep === 1 && currentQuestion < 4) {
          setCurrentQuestion(currentQuestion + 1)
        // Step 2: 2 questions (therapyReasons, preferredLanguages)
        } else if (currentStep === 2 && currentQuestion < 2) {
          setCurrentQuestion(currentQuestion + 1)
        // Step 3: 1 question (preferredTherapist)
        } else if (currentStep < totalSteps) {
          setCurrentStep(currentStep + 1)
          setCurrentQuestion(1)
        }
        setIsAnimating(false)
      }, 150)
    }
  }

  const handlePrevious = () => {
    setIsAnimating(true)
    setTimeout(() => {
      if (currentQuestion > 1) {
        setCurrentQuestion(currentQuestion - 1)
      } else if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
        // Set to last question of previous step
        if (currentStep === 2) setCurrentQuestion(4) // Step 1 has 4 questions
        else if (currentStep === 3) setCurrentQuestion(2) // Step 2 has 2 questions
        else setCurrentQuestion(1)
      }
      setIsAnimating(false)
    }, 150)
  }

  const handleSubmit = async () => {
    try {
      // Replace "Other" with the actual otherReason text in therapyReasons
      let finalTherapyReasons = [...formData.therapyReasons]
      if (finalTherapyReasons.includes("Other") && formData.otherReason.trim()) {
        finalTherapyReasons = finalTherapyReasons.map(reason =>
          reason === "Other" ? formData.otherReason.trim() : reason
        )
      } else if (finalTherapyReasons.includes("Other")) {
        // Remove "Other" if no text was provided
        finalTherapyReasons = finalTherapyReasons.filter(reason => reason !== "Other")
      }

      // Exclude otherReason from the data sent to server (it's merged into therapyReasons)
      const { otherReason, ...restFormData } = formData
      const profileData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || '',
        ...restFormData,
        therapyReasons: finalTherapyReasons
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (data.success) {
        console.log("Questionnaire submitted successfully:", data)
        toast.success("Questionnaire completed!", {
          description: "Your profile has been created and we're matching you with psychologists."
        })
        navigate("/dashboard")
      } else {
        console.error("Failed to save questionnaire:", data.message)
        toast.error("Failed to save questionnaire", {
          description: data.message || "Please try again."
        })
      }
    } catch (error) {
      console.error("Error submitting questionnaire:", error)
      toast.error("Something went wrong", {
        description: "An error occurred while saving your questionnaire. Please try again."
      })
    }
  }

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-customGreen">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-600">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-teal-800 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )

  // STEP 1: Therapy Type & Basic Info
  const renderStep1 = () => {
    const therapyTypes = [
      {
        id: 'therapy',
        title: 'Therapy',
        description: 'Individualized support from a licensed therapist for ages 18+',
        bgColor: 'bg-[#d4e5e1]',
        iconBg: 'bg-[#3d6b6b]',
        icon: <MessageCircle className="w-6 h-6 text-white" />
      },
      {
        id: 'teen',
        title: 'Teen Therapy',
        description: 'Specialized support designed for youth ages 13-17',
        bgColor: 'bg-[#e8efc4]',
        iconBg: 'bg-[#8b9b3d]',
        icon: <MessageCircle className="w-6 h-6 text-white" />
      },
      {
        id: 'couples',
        title: 'Couples Therapy',
        description: 'Relationship support to improve your connection with your partner',
        bgColor: 'bg-[#dfe3f0]',
        iconBg: 'bg-[#3d5a8b]',
        icon: <Users className="w-6 h-6 text-white" />
      }
    ]

    if (currentQuestion === 1) {
      return (
        <div className="space-y-4">
          {therapyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleAutoNext("therapyType", type.id)}
              className={`w-full ${type.bgColor} rounded-2xl p-6 cursor-pointer flex items-start justify-between transition-all  ${formData.therapyType === type.id ? 'ring-2 ring-teal-800' : ''
                }`}
            >
              <div className="text-left flex-1">
                <h2 className="text-xl font-semibold text-teal-900 mb-1">
                  {type.title}
                </h2>
                <p className="text-gray-700 text-sm">
                  {type.description}
                </p>
              </div>
              <div className={`${type.iconBg} rounded-full w-12 h-12 flex items-center justify-center shrink-0 ml-4`}>
                {type.icon}
              </div>
            </button>
          ))}
        </div>
      )
    } else if (currentQuestion === 2) {
      const countries = getData();
      const countryOptions = countries.map(country => ({
        id: country.name,
        label: country.name
      }));

      return (
        <DropdownQuestionSelect
          title="What is your country?"
          options={countryOptions}
          selectedValue={formData.country}
          onChange={(value) => handleRadioChange("country", value)}
          onNext={handleNext}
          placeholder="Select your country"
          banner="This helps us find psychologists who practice in your region."
        />
      )
    } else if (currentQuestion === 3) {
      return (
        <DropdownQuestionSelect
          title="What is your age?"
          options={[
            { id: '18-24', label: '18-24' },
            { id: '25-34', label: '25-34' },
            { id: '35-44', label: '35-44' },
            { id: '45-54', label: '45-54' },
            { id: '55-64', label: '55-64' },
            { id: '65+', label: '65+' }
          ]}
          selectedValue={formData.age}
          onChange={(value) => handleRadioChange("age", value)}
          onNext={handleNext}
          placeholder="Select your age range"
        />
      )
    } else if (currentQuestion === 4) {
      return (
        <RadioQuestion
          title="What is your gender identity?"
          options={[
            { id: 'male', label: 'Male' },
            { id: 'female', label: 'Female' },
            { id: 'prefer-not-to-say', label: 'Prefer not to say' }
          ]}
          selectedValue={formData.gender}
          onSelect={(value) => handleAutoNext("gender", value)}
        />
      )
    }
  }

  const allLanguages = useMemo(() => {
    const langCodes = languages.getAlpha2Codes()
    const languageList = Object.keys(langCodes).map(code => {
      return languages.getName(code, "en")
    }).filter(Boolean).sort()
    
    return languageList
  }, [])

  // STEP 2: What You're Looking For
  const renderStep2 = () => {
    if (currentQuestion === 1) {
      return (
        <CheckboxQuestion
          title="What are you seeking help with?"
          options={[
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
          ]}
          selectedValues={formData.therapyReasons}
          onToggle={(option) => handleCheckboxChange("therapyReasons", option)}
          onNext={handleNext}
          banner="Select all that apply. This helps us match you with psychologists who specialize in these areas."
          otherOption={true}
          otherValue={formData.otherReason}
          onOtherChange={(value) => setFormData(prev => ({ ...prev, otherReason: value }))}
        />
      )
    } else if (currentQuestion === 2) {
      return (
        <MultiSelectDropdown
          title="What languages do you prefer for your sessions?"
          options={allLanguages}
          selectedValues={formData.preferredLanguages}
          onChange={(values) => setFormData(prev => ({ ...prev, preferredLanguages: values }))}
          onNext={handleNext}
          placeholder="Select languages..."
          searchPlaceholder="Search languages..."
          banner="Select all languages you're comfortable with. We'll prioritize psychologists who speak your preferred languages."
        />
      )
    }
  }

  // STEP 3: Preferences
  const renderStep3 = () => {
    return (
      <RadioQuestion
        title="Do you have a preference for your therapist's gender?"
        options={[
          { id: 'male', label: 'Male therapist' },
          { id: 'female', label: 'Female therapist' },
          { id: 'no-preference', label: 'No preference' }
        ]}
        selectedValue={formData.preferredTherapist}
        onSelect={(value) => handleRadioChange("preferredTherapist", value)}
        banner="Some people feel more comfortable with a therapist of a specific gender. There's no right or wrong answer."
      />
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white rounded-lg font-nunito">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header skeleton */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="h-10 w-72" />
            </div>
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>

          {/* Progress bar skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Question cards skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show message if profile already exists
  if (profileExists) {
    return (
      <div className="min-h-screen bg-white rounded-lg px-4 font-nunito animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <header className="select-none">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-customGreen mb-4">
                Questionnaire
              </p>
              <h1 className="text-5xl md:text-6xl font-light text-gray-700 tracking-tight mb-4">
                Already Completed
              </h1>
              <p className="text-lg text-customGray font-light max-w-xl">
                Your questionnaire has been submitted and your profile is ready
              </p>
            </header>
          </div>

         

          {/* Main Content Card */}
          <Card className="rounded-3xl border-0 shadow-none bg-lightGray mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-customGreen flex items-center justify-center shrink-0">
                  <CheckIcon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-700 mb-3 select-none">
                    Profile Successfully Created!
                  </h2>
                  <p className="text-customGray leading-relaxed mb-6">
                    Your profile is ready and we've matched you with psychologists tailored to your needs and preferences. You can now browse through our recommended professionals or update your responses anytime from your profile page.
                  </p>
                  <div className="flex flex-wrap gap-3 select-none">
                    <Button
                      onClick={() => navigate("/browse-psychologists")}
                      className="bg-customGreen hover:bg-customGreenHover text-white rounded-xl shadow-none cursor-pointer h-11 px-6 "
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Browse Psychologists
                    </Button>
                    <Button
                      onClick={() => navigate("/profile")}
                      variant="outline"
                      className="rounded-xl shadow-none cursor-pointer h-11 px-6 border-gray-300 hover:bg-white hover:border-customGreen hover:text-customGreen"
                    >
                      View Profile
                    </Button>
                    <Button
                      onClick={() => navigate("/dashboard")}
                      variant="outline"
                      className="rounded-xl shadow-none cursor-pointer h-11 px-6 border-gray-300 hover:bg-white hover:border-customGreen hover:text-customGreen"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Tip */}
          <div className="flex items-center gap-3 bg-amber-50 rounded-2xl p-4 select-none">
            <div className="w-10 h-10 rounded-xl bg-amber-200/50 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-amber-700" />
            </div>
            <p className="text-amber-800 text-sm">
              Want to update your responses? Visit your{" "}
              <button
                onClick={() => navigate("/profile")}
                className="font-semibold hover:underline"
              >
                profile page
              </button>{" "}
              to view and edit your questionnaire answers anytime.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white rounded-lg font-nunito animate-in fade-in slide-in-from-bottom-4 duration-500">


      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <QuestionnaireIcon className="w-8 h-8 text-customGreenHover" />
            <h1 className="text-3xl md:text-4xl font-bold text-customGreenHover duration-300">
              Find Your Perfect Match
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Answer a few questions to help us connect you with the right psychologist
          </p>
        </div>

        {renderProgressBar()}

        {!(currentStep === 1 && currentQuestion === 1) && (
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 text-teal-800 hover:text-teal-900 mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Question
          </button>
        )}

        <div
          className={`transition-all duration-300 ${
            isAnimating
              ? 'opacity-0 translate-y-4'
              : 'opacity-100 translate-y-0'
          }`}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 mb-14 flex justify-end ">
          {currentStep === totalSteps && currentQuestion === 1 ? (
            <Button
              onClick={handleSubmit}
              className="px-8 bg-teal-800 hover:bg-teal-900"
            >
              Submit & View Matches
            </Button>
          ) : null}
        </div>


      </div>
      {/* <div className="mt-auto">
        <Footer />
      </div> */}
    </div>
  )
}

export default Questionnaire
