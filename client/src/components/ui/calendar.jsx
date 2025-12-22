import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Calendar({
  selectedDate,
  onSelectDate,
  minDate = new Date(),
  maxDays = 30,
  className,
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selectedDate ? new Date(selectedDate) : new Date()
  )

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const endDate = new Date(monthEnd)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

  const maxDate = new Date(minDate)
  maxDate.setDate(maxDate.getDate() + maxDays)

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isDateDisabled = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today || checkDate > maxDate
  }

  const isDateSelected = (date) => {
    if (!selectedDate) return false
    const selected = new Date(selectedDate)
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    )
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const getDaysInMonth = () => {
    const days = []
    const current = new Date(startDate)
    
    while (current <= endDate) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const handleDateClick = (date) => {
    if (!isDateDisabled(date)) {
      // Format date in local timezone to avoid date shifting
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      onSelectDate(formattedDate)
    }
  }

  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const days = getDaysInMonth()
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const canGoPrev = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    return prevMonth >= new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  }

  const canGoNext = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    return nextMonth <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
  }

  return (
    <div className={cn("p-4", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          disabled={!canGoPrev()}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-base font-semibold text-gray-900">{monthYear}</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          disabled={!canGoNext()}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const disabled = isDateDisabled(date)
          const selected = isDateSelected(date)
          const currentMonthDay = isCurrentMonth(date)
          const todayDate = isToday(date)

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              className={cn(
                "h-10 w-full flex items-center justify-center rounded-md text-sm transition-colors",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-offset-2",
                selected && "bg-customGreen text-white hover:bg-customGreenHover",
                todayDate && !selected && "border-2 border-customGreen font-semibold",
                !currentMonthDay && "text-gray-300",
                disabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
                currentMonthDay && !selected && !disabled && "text-gray-900",
                !disabled && !selected && "hover:bg-gray-100",
                !disabled && "cursor-pointer"
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
