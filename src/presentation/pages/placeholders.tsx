/** Temporary page placeholders until real screens are built. */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-primary">{title}</h1>
    </div>
  )
}

export function BuyPage() {
  return <PlaceholderPage title="Buy" />
}

export function AboutPage() {
  return <PlaceholderPage title="About us" />
}

export function LoginPage() {
  return <PlaceholderPage title="Log in" />
}

export function SignUpPage() {
  return <PlaceholderPage title="Sign up" />
}
