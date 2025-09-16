interface StatsCardProps {
  title: string
  value: number
  icon: string
  linkHref: string
  linkText: string
  linkColor: string
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  linkHref, 
  linkText, 
  linkColor 
}: StatsCardProps) {
  return (
    <div className="bg-primary border border-accent/10 overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg font-semibold">{icon}</span>
            </div>
          </div>
          <div className="ml-4 flex-1">
            <dt className="text-sm font-medium text-tertiary/70 truncate">
              {title}
            </dt>
            <dd className="text-2xl font-bold text-tertiary mt-1">
              {value}
            </dd>
          </div>
        </div>
      </div>
      <div className="bg-secondary/30 px-6 py-3 border-t border-accent/5">
        <div className="text-sm">
          <a 
            href={linkHref} 
            className={`font-medium ${linkColor} hover:opacity-80 transition-opacity`}
          >
            {linkText}
          </a>
        </div>
      </div>
    </div>
  )
}