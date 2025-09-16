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
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-tertiary">{title}</h1>
        {description && (
          <p className="text-tertiary/70 mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center space-x-3">
          {children}
        </div>
      )}
    </div>
  )
}