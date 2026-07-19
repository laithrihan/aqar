export function includesIgnoreCase(haystack: string, needle: string): boolean {
  return haystack
    .toLocaleLowerCase()
    .includes(needle.toLocaleLowerCase())
}
