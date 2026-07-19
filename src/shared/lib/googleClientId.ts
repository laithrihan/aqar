export function getGoogleClientId(): string {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
}

export function hasGoogleClientId(): boolean {
  return Boolean(getGoogleClientId())
}
