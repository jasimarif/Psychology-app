import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RadioQuestion, DropdownQuestionSelect, CheckboxQuestion } from "@/components"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Info, MessageCircle, Users, ArrowLeft } from 'lucide-react'
import { QuestionnaireIcon, CheckIcon } from "@/components/icons/DuoTuneIcons"
import { Footer } from "../../components"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { getData } from "country-list"

function Questionnaire() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    // Step 1: Therapy Type & Basic Info
    therapyType: "",
    country: "Pakistan",
    relationshipStatus: "",
    age: "",
    gender: "",

    // Step 2: Religion & Therapy Preferences
    religion: "",
    religionImportance: "",
    spiritual: "",
    therapyHistory: "",
    therapyReasons: [],
    therapistExpectations: [],
    therapistStyle: "",
    therapistApproach: "",
    therapistManner: "",

    // Step 3: Current State
    depression: "",
    eatingHabits: "",
    physicalHealth: "",

    // Step 4: Past 2 Weeks Assessment
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

    // Step 5: Additional Health Info
    employmentStatus: "",
    drinkingHabits: "",
    suicidalThoughts: "",
    panicAttacks: "",
    medication: "",

    // Step 6: Preferences & Resources
    financialStatus: "",
    usefulResources: [],
    communicateTherapist: "",
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
        if (currentStep === 1 && currentQuestion < 5) {
          setCurrentQuestion(currentQuestion + 1)
        } else if (currentStep === 2 && currentQuestion < 9) {
          setCurrentQuestion(currentQuestion + 1)
        } else if (currentStep === 3 && currentQuestion < 3) {
          setCurrentQuestion(currentQuestion + 1)
        } else if (currentStep === 4 && currentQuestion < 10) {
          setCurrentQuestion(currentQuestion + 1)
        } else if (currentStep === 5 && currentQuestion < 5) {
          setCurrentQuestion(currentQuestion + 1)
        } else if (currentStep === 6 && currentQuestion < 4) {
          setCurrentQuestion(currentQuestion + 1)
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
        if (currentStep === 2) setCurrentQuestion(5)
        else if (currentStep === 3) setCurrentQuestion(9)
        else if (currentStep === 4) setCurrentQuestion(3)
        else if (currentStep === 5) setCurrentQuestion(10)
        else if (currentStep === 6) setCurrentQuestion(5)
        else setCurrentQuestion(1)
      }
      setIsAnimating(false)
    }, 150)
  }

  const handleSubmit = async () => {
    try {
      const profileData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || '',
        ...formData
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
        />
      )
    } else if (currentQuestion === 3) {
      return (
        <RadioQuestion
          title="What is your relationship status?"
          options={[
            { id: 'single', label: 'Single' },
            { id: 'in-a-relationship', label: 'In a relationship' },
            { id: 'married', label: 'Married' },
            { id: 'divorced', label: 'Divorced' },
            { id: 'widowed', label: 'Widowed' },
            { id: 'other', label: 'Other' }
          ]}
          selectedValue={formData.relationshipStatus}
          onSelect={(value) => handleAutoNext("relationshipStatus", value)}
        />
      )
    } else if (currentQuestion === 4) {
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
          banner="Almost a fifth of older adults in the United States have experienced depression."
        />
      )
    } else if (currentQuestion === 5) {
      return (
        <RadioQuestion
          title="What is your gender identity?"
          options={[
            { id: 'male', label: 'Male' },
            { id: 'female', label: 'Female' },
            { id: 'non-binary', label: 'Non-binary' },
            { id: 'prefer-not-to-say', label: 'Prefer not to say' }
          ]}
          selectedValue={formData.gender}
          onSelect={(value) => handleAutoNext("gender", value)}
          banner="Gender plays an important role in shaping personal identity and experiences. This information will help your therapist create a more personalized approach."
        />
      )
    }
  }

  // STEP 2: Religion & Therapy Preferences
  const renderStep2 = () => {
    if (currentQuestion === 1) {
      return (
        <RadioQuestion
          title="What is your religion?"
          options={[
            { id: 'islam', label: 'Islam' },
            { id: 'christianity', label: 'Christianity' },
            { id: 'judaism', label: 'Judaism' },
            { id: 'hinduism', label: 'Hinduism' },
            { id: 'buddhism', label: 'Buddhism' },
            { id: 'other', label: 'Other' }
          ]}
          selectedValue={formData.religion}
          onSelect={(value) => handleAutoNext("religion", value)}
        />
      )
    } else if (currentQuestion === 2) {
      return (
        <RadioQuestion
          title="How important is religion in your life?"
          options={[
            { id: 'very-important', label: 'Very Important' },
            { id: 'important', label: 'Important' },
            { id: 'somewhat-important', label: 'Somewhat Important' },
            { id: 'not-important', label: 'Not Important' }
          ]}
          selectedValue={formData.religionImportance}
          onSelect={(value) => handleAutoNext("religionImportance", value)}
          banner="We ask questions about religion so we can match you to a therapist who can empathize with your background."
        />
      )
    } else if (currentQuestion === 3) {
      return (
        <RadioQuestion
          title="Do you consider yourself to be spiritual?"
          options={[
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]}
          selectedValue={formData.spiritual}
          onSelect={(value) => handleAutoNext("spiritual", value)}
        />
      )
    } else if (currentQuestion === 4) {
      return (
        <RadioQuestion
          title="Have you ever been in therapy before?"
          options={[
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]}
          selectedValue={formData.therapyHistory}
          onSelect={(value) => handleAutoNext("therapyHistory", value)}
          banner="Understanding therapeutic history helps your therapist create a more effective plan."
        />
      )
    } else if (currentQuestion === 5) {
      return (
        <CheckboxQuestion
          title="What led you to consider therapy today?"
          options={[
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
          ]}
          selectedValues={formData.therapyReasons}
          onToggle={(option) => handleCheckboxChange("therapyReasons", option)}
          onNext={handleNext}
        />
      )
    } else if (currentQuestion === 6) {
      return (
        <CheckboxQuestion
          title="What do you expect from your therapist?"
          options={[
            'Listens',
            'Explores my past',
            'Teaches me new skills',
            'Challenges my beliefs',
            'Assigns me homework',
            'Guides me to set goals',
            'Proactively checks in with me',
            'Other',
            "I don't know"
          ]}
          selectedValues={formData.therapistExpectations}
          onToggle={(option) => handleCheckboxChange("therapistExpectations", option)}
          onNext={handleNext}
        />
      )
    } else if (currentQuestion === 7) {
      return (
        <RadioQuestion
          title="What style of therapy do you prefer?"
          options={[
            { id: 'casual', label: 'Casual' },
            { id: 'somewhat-casual', label: 'Somewhat casual' },
            { id: 'no-preference', label: 'No preference' },
            { id: 'somewhat-formal', label: 'Somewhat formal' },
            { id: 'formal', label: 'Formal' }
          ]}
          selectedValue={formData.therapistStyle}
          onSelect={(value) => handleAutoNext("therapistStyle", value)}
        />
      )
    } else if (currentQuestion === 8) {
      return (
        <RadioQuestion
          title="Would you prefer a therapist who is flexible or structured?"
          options={[
            { id: 'flexible', label: 'Flexible' },
            { id: 'somewhat-flexible', label: 'Somewhat flexible' },
            { id: 'no-preference', label: 'No preference' },
            { id: 'somewhat-structured', label: 'Somewhat structured' },
            { id: 'structured', label: 'Structured' }
          ]}
          selectedValue={formData.therapistApproach}
          onSelect={(value) => handleAutoNext("therapistApproach", value)}
        />
      )
    } else if (currentQuestion === 9) {
      return (
        <RadioQuestion
          title="Would you prefer a therapist who is gentle or direct?"
          options={[
            { id: 'gentle', label: 'Gentle' },
            { id: 'somewhat-gentle', label: 'Somewhat gentle' },
            { id: 'no-preference', label: 'No preference' },
            { id: 'somewhat-direct', label: 'Somewhat direct' },
            { id: 'direct', label: 'Direct' }
          ]}
          selectedValue={formData.therapistManner}
          onSelect={(value) => handleAutoNext("therapistManner", value)}
        />
      )
    }
  }

  // STEP 3: Current State
  const renderStep3 = () => {
    if (currentQuestion === 1) {
      return (
        <RadioQuestion
          title="Are you currently experiencing overwhelming sadness, grief, or depression?"
          options={[
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]}
          selectedValue={formData.depression}
          onSelect={(value) => handleAutoNext("depression", value)}
          banner="Psychotherapy can serve as an effective treatment for clinical depression."
        />
      )
    } else if (currentQuestion === 2) {
      return (
        <RadioQuestion
          title="How would you rate your current eating habits?"
          options={[
            { id: 'good', label: 'Good' },
            { id: 'fair', label: 'Fair' },
            { id: 'poor', label: 'Poor' }
          ]}
          selectedValue={formData.eatingHabits}
          onSelect={(value) => handleAutoNext("eatingHabits", value)}
        />
      )
    } else if (currentQuestion === 3) {
      return (
        <RadioQuestion
          title="How would you rate your current physical health?"
          options={[
            { id: 'good', label: 'Good' },
            { id: 'fair', label: 'Fair' },
            { id: 'poor', label: 'Poor' }
          ]}
          selectedValue={formData.physicalHealth}
          onSelect={(value) => handleAutoNext("physicalHealth", value)}
          banner="Studies show that exercise can help with depression as effectively as antidepressant medication."
        />
      )
    }
  }

  // STEP 4: Past 2 Weeks Assessment
  const renderStep4 = () => {
    const past2WeeksOptions = [
      { id: 'not-at-all', label: 'Not at all' },
      { id: 'several-days', label: 'Several days' },
      { id: 'more-than-half', label: 'More than half the days' },
      { id: 'nearly-every-day', label: 'Nearly every day' }
    ]

    const questions = [
      { field: "littleInterest", title: "Little interest or pleasure in doing things", banner: "The next few questions will help your therapist understand how you've been feeling and where to begin treatment." },
      { field: "motorActivity", title: "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual" },
      { field: "feelingDown", title: "Feeling down, depressed or hopeless" },
      { field: "troubleSleeping", title: "Trouble falling asleep, staying asleep, or sleeping too much" },
      { field: "feelingTired", title: "Feeling tired or having little energy" },
      { field: "poorAppetite", title: "Poor appetite or overeating" },
      { field: "feelingBad", title: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down" },
      { field: "troubleConcentrating", title: "Trouble concentrating on things, such as reading the newspaper or watching television" },
      { field: "thoughtsHurting", title: "Thoughts that you would be better off dead or of hurting yourself in some way" }
    ]

    if (currentQuestion >= 1 && currentQuestion <= 9) {
      const currentQ = questions[currentQuestion - 1]
      return (
        <RadioQuestion
          title={currentQ.title}
          description="Over the past 2 weeks, how often have you been bothered by any of the following problems:"
          options={past2WeeksOptions}
          selectedValue={formData[currentQ.field]}
          onSelect={(value) => handleAutoNext(currentQ.field, value)}
          banner={currentQ.banner}
        />
      )
    } else if (currentQuestion === 10) {
      return (
        <RadioQuestion
          title="How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?"
          description="Over the past 2 weeks, how often have you been bothered by any of the following problems:"
          options={[
            { id: 'not-difficult', label: 'Not difficult at all' },
            { id: 'somewhat-difficult', label: 'Somewhat difficult' },
            { id: 'very-difficult', label: 'Very difficult' },
            { id: 'extremely-difficult', label: 'Extremely difficult' }
          ]}
          selectedValue={formData.difficultyForWork}
          onSelect={(value) => handleAutoNext("difficultyForWork", value)}
        />
      )
    }
  }

  // STEP 5: Additional Health Info
  const renderStep5 = () => {
    if (currentQuestion === 1) {
      return (
        <RadioQuestion
          title="What is your current employment status?"
          options={[
            { id: 'employed', label: 'Employed' },
            { id: 'unemployed', label: 'Unemployed' }
          ]}
          selectedValue={formData.employmentStatus}
          onSelect={(value) => handleAutoNext("employmentStatus", value)}
        />
      )
    } else if (currentQuestion === 2) {
      return (
        <RadioQuestion
          title="How often do you consume alcoholic beverages?"
          options={[
            { id: 'never', label: 'Never' },
            { id: 'occasionally', label: 'Occasionally' },
            { id: 'regularly', label: 'Regularly' },
            { id: 'frequently', label: 'Frequently' }
          ]}
          selectedValue={formData.drinkingHabits}
          onSelect={(value) => handleAutoNext("drinkingHabits", value)}
        />
      )
    } else if (currentQuestion === 3) {
      return (
        <RadioQuestion
          title="When was the last time you had thoughts of ending your life?"
          options={[
            { id: 'never', label: 'Never' },
            { id: 'more-than-a-year-ago', label: 'More than a year ago' },
            { id: 'over-3-months-ago', label: 'Over 3 months ago' },
            { id: 'over-a-month-ago', label: 'Over a month ago' },
            { id: 'over-2-weeks-ago', label: 'Over 2 weeks ago' },
            { id: 'within-2-weeks', label: 'Within the last 2 weeks' }
          ]}
          selectedValue={formData.suicidalThoughts}
          onSelect={(value) => handleAutoNext("suicidalThoughts", value)}
        />
      )
    } else if (currentQuestion === 4) {
      return (
        <RadioQuestion
          title="Are you currently experiencing anxiety, panic attacks or have any phobias?"
          options={[
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]}
          selectedValue={formData.panicAttacks}
          onSelect={(value) => handleAutoNext("panicAttacks", value)}
          banner="Some symptoms of panic attacks include a racing heart, dizziness, or chest pains."
        />
      )
    } else if (currentQuestion === 5) {
      return (
        <RadioQuestion
          title="Are you currently taking any medication for mental health issues?"
          options={[
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]}
          selectedValue={formData.medication}
          onSelect={(value) => handleAutoNext("medication", value)}
        />
      )
    }
  }

  // STEP 6: Preferences & Resources
  const renderStep6 = () => {
    if (currentQuestion === 1) {
      return (
        <RadioQuestion
          title="How would you describe your current financial situation?"
          options={[
            { id: 'stable', label: 'Stable' },
            { id: 'somewhat-stable', label: 'Somewhat Stable' },
            { id: 'unstable', label: 'Unstable' }
          ]}
          selectedValue={formData.financialStatus}
          onSelect={(value) => handleAutoNext("financialStatus", value)}
        />
      )
    } else if (currentQuestion === 2) {
      return (
        <CheckboxQuestion
          title="Which resources would be most useful to you?"
          options={[
            "Support Groups",
            "Therapy journals",
            "Worksheets",
            "Goal/habit tracking",
            "Others",
            "I don't know"
          ]}
          selectedValues={formData.usefulResources}
          onToggle={(option) => handleCheckboxChange("usefulResources", option)}
          onNext={handleNext}
        />
      )
    } else if (currentQuestion === 3) {
      return (
        <RadioQuestion
          title="How would you prefer to communicate with your therapist?"
          options={[
            { id: 'mostly-text', label: 'Mostly text-based (chat, email)' },
            { id: 'video-calls', label: 'Video calls' },
            { id: 'in-person', label: 'In-person sessions' }
          ]}
          selectedValue={formData.communicateTherapist}
          onSelect={(value) => handleAutoNext("communicateTherapist", value)}
          banner="Different communication methods work better for different people. Choose what feels most comfortable for you."
        />
      )
    } else if (currentQuestion === 4) {
      return (
        <RadioQuestion
          title="Do you have a preference for your therapist's gender?"
          options={[
            { id: 'male-therapist', label: 'Male therapist' },
            { id: 'female-therapist', label: 'Female therapist' },
            { id: 'no-preference', label: 'No preference' }
          ]}
          selectedValue={formData.preferredTherapist}
          onSelect={(value) => handleRadioChange("preferredTherapist", value)}
          banner="Some people feel more comfortable with a therapist of a specific gender. There's no right or wrong answer."
        />
      )
    }
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
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 mb-14 flex justify-end ">
          {currentStep === totalSteps && currentQuestion === 4 ? (
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
