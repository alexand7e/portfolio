interface AdminPageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export default function AdminPageHeader({ 
  title, 
  description, 
  children 
}: AdminPageHeaderProps) {
  return (
    <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-tertiary mb-2">{title}</h1>
          {description && (
            <p className="text-tertiary/70 text-lg">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex items-center space-x-3">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}