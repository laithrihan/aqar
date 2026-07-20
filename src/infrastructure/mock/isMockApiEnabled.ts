/** When true, repositories use local mock JSON / localStorage instead of Laravel. */
export function isMockApiEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK_API === 'true'
}
