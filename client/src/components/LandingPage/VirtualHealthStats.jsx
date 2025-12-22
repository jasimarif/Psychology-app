export default function VirtualHealthStats() {
  return (
    <div className="w-full bg-[#FDFFDD] py-16 px-8">
      <div className="">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-averia font-semibold tracking-tight text-customGreen text-center mt-6 mb-28">
          Experts in virtual mental health care
        </h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Stat 1 */}
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-bold text-customGreen mb-2 font-averia">
              5,000,000
            </div>
            <div className="text-xl md:text-2xl text-customGreen font-nunito">
              therapy sessions
            </div>
          </div>
          
          {/* Stat 2 */}
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-bold text-customGreen mb-2 font-averia">
              1,200,000
            </div>
            <div className="text-xl md:text-2xl text-customGreen font-nunito">
              members helped
            </div>
          </div>
          
          {/* Stat 3 */}
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-bold text-customGreen mb-2 font-averia">
              5,700
            </div>
            <div className="text-xl md:text-2xl text-customGreen font-nunito">
              licensed providers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}