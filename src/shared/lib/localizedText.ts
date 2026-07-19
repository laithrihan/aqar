export function localizedText(language: string, en: string, ar: string): string {
  return language.startsWith('ar') ? ar : en
}
