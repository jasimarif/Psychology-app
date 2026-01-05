import { Star } from "lucide-react";
import { PsychologistsIcon, CalendarIcon } from "../icons/DuoTuneIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PsychologistCard = ({ psychologist, onViewProfile, onBookSession }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer group"
      onClick={() => onViewProfile(psychologist)}
    >
      {/* Large Profile Image */}
      <div className="relative aspect-square overflow-hidden">
        {psychologist.profileImage ? (
          <img
            src={psychologist.profileImage}
            alt={psychologist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <PsychologistsIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Rating Badge - Top Right */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-customGreen">
            {psychologist.rating > 0 ? psychologist.rating.toFixed(1) : 'New'}
          </span>
          {psychologist.reviews > 0 && (
            <span className="text-xs text-gray-500">({psychologist.reviews})</span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Name and Title */}
        <div className="mb-3">
          <h3 className="text-2xl font-semibold text-customGreen mb-1 font-averia tracking-tighter">
            {psychologist.name}
          </h3>
          <p className="text-sm font-semibold tracking-wider text-customGray uppercase">
            {psychologist.title}
          </p>
        </div>

        {/* Specialty Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {psychologist.specialties?.slice(0, 3).map((specialty, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs font-medium text-customGreen bg-lightGray border-none rounded-full px-3 py-1"
            >
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Bio Preview */}
        <p className="text-sm text-customGray leading-relaxed line-clamp-2 mb-6"> 
          {psychologist.bio}
        </p>

        {/* Price and Book Button */}
        <div className="flex items-end justify-between border-t pt-4">
          <div>
            <p className="text-xs text-customGray mb-0.5">FEE</p>
            <p className="text-3xl font-semibold font-averia text-customGreen">
              ${psychologist.price}<span className="text-sm font-normal text-customGray">/hr</span>
            </p>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onBookSession(psychologist);
            }}
            className="bg-customGreen hover:bg-customGreenHover text-white rounded-lg px-6 py-3 select-none cursor-pointer font-medium flex items-center"
          >
                <CalendarIcon className="w-4 h-4 mr-2" />
            Book Session
          </div>
        </div>
      </div>
    </div>
  )
}

export default PsychologistCard;
