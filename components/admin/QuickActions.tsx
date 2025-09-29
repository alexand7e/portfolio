import Link from 'next/link'

interface QuickActionProps {
  href: string
  text: string
  icon: string
  variant?: 'primary' | 'secondary'
  external?: boolean
}

function QuickActionButton({ href, text, icon, variant = 'primary', external = false }: QuickActionProps) {
  const baseClasses = "inline-flex items-center justify-center px-6 py-4 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent min-w-[160px] group"
  
  const variantClasses = {
    primary: "text-primary bg-accent hover:bg-accent/90 hover:shadow-lg hover:scale-105",
    secondary: "text-tertiary bg-secondary/50 border border-accent/20 hover:bg-accent/10 hover:border-accent/40 hover:shadow-md"
  }

  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      <span className="text-lg mr-2 group-hover:scale-110 transition-transform duration-200">{icon}</span>
      {text}
    </Link>
  )
}

export default function QuickActions() {
  return (
    <div className="bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-tertiary mb-2">
          Ações Rápidas
        </h3>
        <p className="text-tertiary/70">
          Crie e gerencie conteúdo rapidamente
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionButton
          href="/admin/blog/new"
          text="Novo Post"
          icon="📝"
          variant="primary"
        />
        <QuickActionButton
          href="/admin/projects/new"
          text="Novo Projeto"
          icon="🚀"
          variant="primary"
        />
        <QuickActionButton
          href="/admin/experiences/new"
          text="Nova Experiência"
          icon="💼"
          variant="primary"
        />
        <QuickActionButton
          href="/"
          text="Ver Site"
          icon="🌐"
          variant="secondary"
          external
        />
      </div>
    </div>
  )
}