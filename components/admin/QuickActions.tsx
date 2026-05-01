import Link from 'next/link'

interface QuickActionProps {
  href: string
  text: string
  variant?: 'primary' | 'secondary'
  external?: boolean
}

function QuickActionButton({ href, text, variant = 'primary', external = false }: QuickActionProps) {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent min-w-[140px]"
  
  const variantClasses = {
    primary: "text-primary bg-accent hover:bg-accent/90 hover:shadow-md",
    secondary: "text-tertiary bg-secondary border border-accent/20 hover:bg-accent/10 hover:border-accent/30"
  }

  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {text}
    </Link>
  )
}

export default function QuickActions() {
  return (
    <div className="bg-primary border border-accent/10 shadow-sm rounded-lg">
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-tertiary mb-6">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <QuickActionButton href="/admin/blog/new" text="Novo Post" variant="primary" />
          <QuickActionButton href="/admin/tutorials/new" text="Novo Tutorial" variant="primary" />
          <QuickActionButton href="/admin/talks" text="Nova Talk" variant="primary" />
          <QuickActionButton href="/admin/newsletter" text="Newsletter" variant="secondary" />
          <QuickActionButton href="/admin/testimonials" text="Depoimentos" variant="secondary" />
          <QuickActionButton href="/admin/projects/new" text="Novo Projeto" variant="primary" />
          <QuickActionButton href="/admin/experiences/new" text="Nova Experiência" variant="primary" />
          <QuickActionButton href="/" text="Ver Site" variant="secondary" external />
        </div>
      </div>
    </div>
  )
}