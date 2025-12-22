import { Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DropdownQuestionSelect = ({ 
  title, 
  options, 
  selectedValue, 
  onChange, 
  onNext,
  banner,
  placeholder = "Select an option"
}) => {
  return (
    <Card className="border border-darkYellow shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl text-customGreen">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedValue} onValueChange={onChange}>
          <SelectTrigger className="w-full cursor-pointer ">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent >
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id} className="cursor-pointer">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {banner && (
          <div className="mt-4 bg-lightGreen rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-customGreen shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{banner}</p>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={onNext} 
            disabled={!selectedValue} 
            className="bg-customGreen hover:bg-customGreenHover cursor-pointer"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DropdownQuestionSelect
