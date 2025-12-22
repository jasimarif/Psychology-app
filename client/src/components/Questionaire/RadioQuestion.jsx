import { Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const RadioQuestion = ({ 
  title, 
  description,
  options, 
  selectedValue, 
  onSelect, 
  banner,
  autoNext = true 
}) => {
  const handleSelect = (value) => {
    onSelect(value)
  }

  return (
    <Card className="border border-darkYellow shadow-none">
      <CardHeader>
        {description && <CardDescription className="text-gray-700 mb-2">{description}</CardDescription>}
        <CardTitle className="text-2xl text-customGreen">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full py-3 px-6 rounded-lg text-left transition-all cursor-pointer ${
                selectedValue === option.id
                  ? 'bg-customGreen text-white'
                  : 'bg-lightGreen  text-customGreen'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {banner && (
          <div className="bg-lightGreen rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-customGreen shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{banner}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RadioQuestion
