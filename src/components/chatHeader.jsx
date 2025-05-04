import { AnimalAvatar } from "./AnimalAvatar";



export default function ChatHeader({ title, subtitle, animalType, status = "online" }) {
  const statusClasses = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500"
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-lg border-b border-white/10 py-4 px-6 flex items-center gap-4 rounded-t-2xl">
      <div className="relative">
        <AnimalAvatar animal={animalType} size="lg" />
        {status && (
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusClasses[status]} ring-2 ring-gray-900`}></div>
        )}
      </div>
      
      <div className="flex-1">
        <h2 className="font-bold text-xl text-white">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
      </div>
    </div>
  );
}
