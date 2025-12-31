import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AwardIcon, UsersIcon, CalendarIcon, StarIcon, LocationIcon, ArrowRightIcon, BriefcaseIcon, GlobeIcon, DocumentIcon } from "../icons/DuoTuneIcons";

const PsychologistCard = ({ psychologist, onViewProfile, onBookSession }) => {
  return (
    <Card className="group relative border shadow-none transition-all duration-300 overflow-hidden bg-white py-6">
      {/* Decorative gradient top border */}
      {/* <div className="absolute top-0 left-0 right-0 h-1 bg-customGreen"></div> */}

      <CardHeader className="">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative seletct-none">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-none overflow-hidden">
              {psychologist.profileImage ? (
                <img
                  src={psychologist.profileImage}
                  alt={psychologist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UsersIcon className="w-10 h-10 text-blue-600" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Header Info */}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl text-customGreen truncate font-bold group-hover:text-customGreenHover transition-colors">
              {psychologist.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 font-medium mt-1">
              {psychologist.title}
            </CardDescription>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(psychologist.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 fill-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900">{psychologist.rating}</span>
              <span className="text-sm text-gray-500">({psychologist.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Specialties */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
              <BriefcaseIcon className="w-3 h-3" />
              Specialties
            </p>
            <div className="flex flex-wrap gap-2">
              {psychologist.specialties.slice(0, 3).map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-customGreen/10 text-customGreenHover transition-colors"
                >
                  {specialty}
                </Badge>
              ))}
              {psychologist.specialties.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-gray-50 text-gray-600 border-gray-300"
                >
                  +{psychologist.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Location and Experience */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                <LocationIcon className="w-3 h-3" />
                Location
              </p>
              <div className="flex items-center gap-2 text-sm bg-green-100/90 p-3 rounded-xl">
                <LocationIcon className="w-4 h-4 text-green-600 shrink-0" />
                <span className="font-medium text-gray-700 truncate">{psychologist.location}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                <AwardIcon className="w-3 h-3" />
                Experience
              </p>
              <div className="flex items-center gap-2 text-sm bg-orange-100/90 p-3 rounded-xl">
                <AwardIcon className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="font-medium text-gray-700 truncate">{psychologist.experience}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
              <DocumentIcon className="w-3 h-3" />
              About
            </p>
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
              {psychologist.bio}
            </p>
          </div>

          {/* Languages */}
          {psychologist.languages && psychologist.languages.length > 0 && (
            <div className="flex items-center gap-2 text-sm bg-red-100/80 p-3 rounded-lg">
              <GlobeIcon className="w-3 h-3 shrink-0" />
              <span className="font-medium">Languages:</span>
              <span className="truncate">{psychologist.languages.join(', ')}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-4"></div>

          {/* Price */}
          <div className="flex items-center justify-between bg-lightGreen p-4 rounded-xl">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Session Fee</p>
              <p className="text-2xl font-bold text-customGreen">
                ${typeof psychologist.price === 'number' ? psychologist.price.toFixed(2) : psychologist.price}
              </p>
            </div>
            <div className="w-12 h-12 bg-customGreen/20 rounded-full flex items-center justify-center shadow-none">
              <CalendarIcon className="w-6 h-6 text-customGreen" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => onViewProfile(psychologist)}
              variant="outline"
              className="flex-1 border-2 border-gray-200  hover:bg-gray-50  font-semibold transition-all duration-200 rounded-xl shadow-none cursor-pointer select-none" 
            >
              View Profile
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => onBookSession(psychologist)}
              className="flex-1 bg-customGreen hover:bg-customGreenHover cursor-pointer text-white font-semibold shadow-none transition-all duration-200 rounded-xl select-none"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PsychologistCard;