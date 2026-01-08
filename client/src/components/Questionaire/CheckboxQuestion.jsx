import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Info } from "lucide-react"

const CheckboxQuestion = ({
  title,
  description = "Select all that apply",
  options,
  selectedValues,
  onToggle,
  onNext,
  banner,
  otherOption = false,
  otherValue = "",
  onOtherChange
}) => {
  const [showOtherInput, setShowOtherInput] = useState(
    selectedValues.includes("Other") || (otherValue && otherValue.trim() !== "")
  )

  const handleOtherToggle = () => {
    onToggle("Other")
    setShowOtherInput(!showOtherInput)
    if (showOtherInput && onOtherChange) {
      onOtherChange("")
    }
  }

  const regularOptions = otherOption ? options.filter(opt => opt !== "Other") : options
  const hasOtherInOptions = otherOption && options.includes("Other")

  return (
    <Card className="border border-darkYellow shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl text-customGreen">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {banner && (
          <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-3 mb-4">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">{banner}</p>
          </div>
        )}
        <div className="space-y-3 mb-6">
          {regularOptions.map((option) => (
            <label key={option} className="flex items-center gap-4 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => onToggle(option)}
                  className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer appearance-none checked:bg-customGreen checked:border-customGreen transition-all"
                />
                {selectedValues.includes(option) && (
                  <svg
                    className="w-5 h-5 absolute top-0 left-0 pointer-events-none text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-gray-800 group-hover:text-teal-800 transition-colors">{option}</span>
            </label>
          ))}
          
          {/* Other option with text input */}
          {hasOtherInOptions && (
            <div className="space-y-2">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes("Other")}
                    onChange={handleOtherToggle}
                    className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer appearance-none checked:bg-customGreen checked:border-customGreen transition-all"
                  />
                  {selectedValues.includes("Other") && (
                    <svg
                      className="w-5 h-5 absolute top-0 left-0 pointer-events-none text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-800 group-hover:text-teal-800 transition-colors">Other</span>
              </label>
              {showOtherInput && (
                <div className="ml-9">
                  <Input
                    type="text"
                    placeholder="Please specify..."
                    value={otherValue}
                    onChange={(e) => onOtherChange && onOtherChange(e.target.value)}
                    className="max-w-md h-11 border-gray-300 focus:border-customGreen focus:ring-customGreen rounded-xl"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={onNext} 
            disabled={selectedValues.length === 0}
            className="bg-customGreen hover:bg-customGreenHover cursor-pointer"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CheckboxQuestion
