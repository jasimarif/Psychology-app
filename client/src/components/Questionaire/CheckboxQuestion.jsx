import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const CheckboxQuestion = ({ 
  title, 
  description = "Select all that apply",
  options, 
  selectedValues, 
  onToggle, 
  onNext 
}) => {
  return (
    <Card className="border border-darkYellow shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl text-customGreen">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          {options.map((option) => (
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
