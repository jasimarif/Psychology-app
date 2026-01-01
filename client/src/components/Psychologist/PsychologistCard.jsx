import { StarIcon, LocationIcon } from "../icons/DuoTuneIcons";

const PsychologistCard = ({ psychologist, onViewProfile }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Cover Image Area */}
      <div className="relative h-28 bg-linear-to-br from-gray-50 to-gray-100">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Settings/Options button positioned top right */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors">
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="19" r="2"/>
          </svg>
        </button>
      </div>

      {/* Profile Section */}
      <div className="relative px-5 pb-5">
        {/* Profile Image - Overlapping cover */}
        <div className="relative -mt-12 mb-4 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-amber-400 overflow-hidden">
              {psychologist.profileImage ? (
                <img
                  src={psychologist.profileImage}
                  alt={psychologist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-customGreen/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-customGreen">
                    {psychologist.name?.charAt(0) || 'P'}
                  </span>
                </div>
              )}
            </div>
            {/* Online Status Indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
          </div>
        </div>

        {/* Name and Title */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h3 className="text-lg font-bold text-gray-900">{psychologist.name}</h3>
            {psychologist.verified && (
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-500">{psychologist.title}</p>
        </div>

        {/* Specialties as inline text */}
        <div className="flex items-center justify-center gap-1.5 text-sm text-customGreen mb-5">
          <span className="font-medium">{psychologist.specialties?.slice(0, 2).join(' • ')}</span>
          {psychologist.specialties?.length > 2 && (
            <span className="text-gray-400">+{psychologist.specialties.length - 2}</span>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex items-center justify-center divide-x divide-gray-200 border border-gray-100 rounded-xl py-3 mb-5">
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
              <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
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
