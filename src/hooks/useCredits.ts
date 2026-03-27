import { useAppStore } from '@/store/appStore'

export function useCredits() {
  return useAppStore((state) => state.user.credits)
}
