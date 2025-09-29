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
    <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 overflow-hidden rounded-xl hover:shadow-lg hover:border-accent/20 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <dt className="text-sm font-medium text-tertiary/70 mb-2">
              {title}
            </dt>
            <dd className="text-3xl font-bold text-tertiary mb-4">
              {value}
            </dd>
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-accent/10 group-hover:bg-accent/20 rounded-xl flex items-center justify-center transition-colors duration-300">
              <span className="text-accent text-xl font-semibold">{icon}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-accent/5 px-6 py-4 border-t border-accent/10 group-hover:bg-accent/10 transition-colors duration-300">
        <div className="text-sm">
          <a 
            href={linkHref} 
            className={`font-medium ${linkColor} hover:opacity-80 transition-opacity inline-flex items-center`}
          >
            {linkText}
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}