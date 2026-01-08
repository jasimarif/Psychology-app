import { useState, useRef, useEffect } from 'react'
import { Info, Check, ChevronDown, X, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const MultiSelectDropdown = ({ 
  title, 
  options, 
  selectedValues = [], 
  onChange, 
  onNext,
  banner,
  placeholder = "Select options",
  searchPlaceholder = "Search..."
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter options based on search
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggle = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option))
    } else {
      onChange([...selectedValues, option])
    }
  }

  const handleRemove = (option, e) => {
    e.stopPropagation()
    onChange(selectedValues.filter(v => v !== option))
  }

  const handleClearAll = (e) => {
    e.stopPropagation()
    onChange([])
  }

  return (
    <Card className="border border-darkYellow shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl text-customGreen">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={dropdownRef} className="relative">
          {/* Selected items display / Trigger */}
          <div
            onClick={() => {
              setIsOpen(!isOpen)
              if (!isOpen) {
                setTimeout(() => inputRef.current?.focus(), 100)
              }
            }}
            className="min-h-[44px] w-full border border-gray-200 rounded-xl px-3 py-2 cursor-pointer flex items-center gap-2 flex-wrap hover:border-customGreen transition-colors"
          >
            {selectedValues.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {selectedValues.map((value) => (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="bg-lightGreen text-customGreen border-none rounded-lg px-2 py-1 text-sm font-medium flex items-center gap-1"
                    >
                      {value}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={(e) => handleRemove(value, e)}
                      />
                    </Badge>
                  ))}
                </div>
                {selectedValues.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
            <ChevronDown className={`w-5 h-5 text-gray-400 ml-auto shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {/* Search input */}
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 border-gray-200 focus:border-customGreen focus:ring-customGreen rounded-lg"
                  />
                </div>
              </div>

              {/* Options list */}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleToggle(option)}
                      className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        selectedValues.includes(option) ? 'bg-lightGreen/50' : ''
                      }`}
                    >
                      <span className="text-gray-700">{option}</span>
                      {selectedValues.includes(option) && (
                        <Check className="w-4 h-4 text-customGreen" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    No options found
                  </div>
                )}
              </div>

              {/* Selected count */}
              {selectedValues.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-sm text-gray-600">
                  {selectedValues.length} selected
                </div>
              )}
            </div>
          )}
        </div>

        {banner && (
          <div className="mt-4 bg-lightGreen rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-customGreen shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{banner}</p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
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

export default MultiSelectDropdown
