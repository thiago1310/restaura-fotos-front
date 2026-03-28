import { create } from 'zustand'
import { AppStore, ProcessingOptions } from '@/types'
import { INITIAL_PAYMENT } from '@/services/mockData'

const STORED_AUTH_TOKEN_KEY = 'restaura_fotos_auth_token'

function getInitialBootstrapStatus() {
  if (typeof window === 'undefined') return 'idle' as const
  return localStorage.getItem(STORED_AUTH_TOKEN_KEY) ? ('loading' as const) : ('done' as const)
}

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
  authBootstrapStatus: getInitialBootstrapStatus(),
  creditPackages: [],
  selectedPackage: undefined,
  payment: INITIAL_PAYMENT,
  currentJob: undefined,
  currentOptions: defaultOptions,
  history: [],
  setCreditPackages: (packages) => {
    set({ creditPackages: packages })
  },
  setSelectedPackage: (pkgId) => {
    const selected = get().creditPackages.find((pkg) => pkg.id === pkgId)
    set({ selectedPackage: selected })
  },
  startPixPayment: ({ packageId, pagamentoId, qrCodeUrl, pixCode }) => {
    const selected = get().creditPackages.find((pkg) => pkg.id === packageId)
    if (!selected) return

    set({
      selectedPackage: selected,
      payment: {
        packageId,
        pagamentoId,
        method: 'pix',
        status: 'pending',
        qrCodeUrl,
        pixCode
      }
    })
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
  startAuthBootstrap: () => {
    set({ authBootstrapStatus: 'loading' })
  },
  finishAuthBootstrap: () => {
    set({ authBootstrapStatus: 'done' })
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
  setCurrentJob: (job) => {
    set({ currentJob: job })
  },
  updateCurrentJob: (changes) => {
    set((state) => {
      if (!state.currentJob) return state
      return {
        currentJob: {
          ...state.currentJob,
          ...changes
        }
      }
    })
  },
  clearCurrentJob: () => {
    set({ currentJob: undefined })
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
