import { create } from 'zustand'
import { AppStore, ProcessingOptions } from '@/types'
import { CREDIT_PACKAGES, INITIAL_PAYMENT } from '@/services/mockData'
import { createPixPayment } from '@/services/paymentService'

const defaultOptions: ProcessingOptions = {
  restore: true,
  colorize: true,
  upscale: true,
  animate: false
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: {
    id: 'guest',
    name: 'Visitante',
    credits: 0
  },
  authToken: undefined,
  isAuthenticated: false,
  creditPackages: CREDIT_PACKAGES,
  selectedPackage: undefined,
  payment: INITIAL_PAYMENT,
  currentJob: undefined,
  currentOptions: defaultOptions,
  history: [],
  setSelectedPackage: (pkgId) => {
    const selected = get().creditPackages.find((pkg) => pkg.id === pkgId)
    set({ selectedPackage: selected })
  },
  startPixPayment: (pkgId) => {
    const selected = get().creditPackages.find((pkg) => pkg.id === pkgId)
    if (!selected) return

    const payment = createPixPayment(selected)
    set({ selectedPackage: selected, payment })
  },
  confirmPayment: () => {
    const selected = get().selectedPackage
    if (!selected) return

    set((state) => ({
      payment: {
        ...state.payment,
        status: 'paid'
      },
      user: {
        ...state.user,
        credits: state.user.credits + selected.photos
      }
    }))
  },
  setPaymentFailed: () => {
    set((state) => ({
      payment: {
        ...state.payment,
        status: 'failed'
      }
    }))
  },
  clearPayment: () => {
    set({ payment: INITIAL_PAYMENT, selectedPackage: undefined })
  },
  setCurrentOptions: (options) => {
    set({ currentOptions: options })
  },
  setAuthSession: ({ token, user }) => {
    set((state) => ({
      authToken: token,
      isAuthenticated: true,
      user: {
        ...state.user,
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    }))
  },
  setUserCredits: (credits) => {
    set((state) => ({
      user: {
        ...state.user,
        credits
      }
    }))
  },
  clearAuthSession: () => {
    set((state) => ({
      authToken: undefined,
      isAuthenticated: false,
      user: {
        ...state.user,
        id: 'guest',
        name: 'Visitante',
        email: undefined,
        phone: undefined,
        credits: 0
      }
    }))
  },
  createJob: (originalUrl) => {
    const job = {
      id: `job-${Date.now()}`,
      originalUrl,
      status: 'processing' as const
    }
    set({ currentJob: job })
    return job
  },
  completeJob: (result) => {
    set((state) => {
      if (!state.currentJob) return state

      const finished = {
        ...state.currentJob,
        ...result,
        status: 'done' as const
      }

      return {
        currentJob: finished,
        history: [finished, ...state.history].slice(0, 10)
      }
    })
  },
  setJobError: () => {
    set((state) => {
      if (!state.currentJob) return state
      return {
        currentJob: {
          ...state.currentJob,
          status: 'error'
        }
      }
    })
  },
  consumeCredit: () => {
    const { user } = get()
    if (user.credits <= 0) return false

    set((state) => ({
      user: {
        ...state.user,
        credits: state.user.credits - 1
      }
    }))

    return true
  }
}))
