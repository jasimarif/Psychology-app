import { StarIcon, LocationIcon } from "../icons/DuoTuneIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Share2, Heart, Flag } from "lucide-react";

const PsychologistCard = ({ psychologist, onViewProfile }) => {
  return (
    <div className="isolate bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
      {/* Cover Image Area with Avatar wrapper */}
      <div className="relative pb-12">
        {/* Background with pattern - has overflow hidden for rounded corners */}
        <div className="absolute inset-0 bg-customGreen/5 rounded-t-2xl overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233A7D44' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Top padding area */}
        <div className="h-20"></div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors cursor-pointer border border-gray-100 z-10">
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewProfile(psychologist)}>
              <User className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Heart className="w-4 h-4 mr-2" />
              Save to Favorites
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-gray-500">
              <Flag className="w-4 h-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Image - Outside overflow-hidden container */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={psychologist.profileImage} alt={psychologist.name} />
              <AvatarFallback className="bg-gray-100 text-customGreen text-2xl font-bold">
                {psychologist.name?.charAt(0) || 'P'}
              </AvatarFallback>
            </Avatar>
            {/* Online Status Indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-[3px] border-white"></div>
          </div>
        </div>
      </div>

      {/* Profile Section - pt-14 to account for bottom half of avatar */}
      <div className="relative px-5 pb-5 pt-14 bg-white">
        {/* Name and Title */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h3 className="text-lg font-bold text-gray-900">{psychologist.name}</h3>
            {psychologist.verified && (
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-500">{psychologist.title}</p>
        </div>

        {/* Specialties as badges */}
        <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
          {psychologist.specialties?.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs text-customGreen bg-customGreen/10 ">
              {specialty}
            </Badge>
          ))}
          {psychologist.specialties?.length > 3 && (
            <Badge variant="secondary" className="text-xs text-gray-400 bg-gray-100">
              +{psychologist.specialties.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex items-center justify-center divide-x divide-gray-200 bg-gray-50 rounded-xl py-3.5 mb-5">
          <div className="flex-1 text-center px-3">
            <p className="text-lg font-bold text-gray-900">${psychologist.price}</p>
            <p className="text-xs text-gray-500">Per Session</p>
          </div>
          <div className="flex-1 text-center px-3">
            <p className="text-lg font-bold text-gray-900">{psychologist.experience}</p>
            <p className="text-xs text-gray-500">Experience</p>
          </div>
          <div className="flex-1 text-center px-3">
            <div className="flex items-center justify-center gap-1">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <p className="text-lg font-bold text-gray-900">{psychologist.rating}</p>
            </div>
            <p className="text-xs text-gray-500">{psychologist.reviews} reviews</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500 mb-5">
          <LocationIcon className="w-4 h-4" />
          <span>{psychologist.location}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-4"></div>

        {/* Action Button */}
        <button
          onClick={() => onViewProfile(psychologist)}
          className="w-full text-center text-customGreen font-semibold text-sm hover:text-customGreenHover transition-colors py-2 border-b-2 border-dashed border-customGreen/30 hover:border-customGreen cursor-pointer"
        >
          View Profile
        </button>
      </div>
    </div>
  )
}

export default PsychologistCard;
