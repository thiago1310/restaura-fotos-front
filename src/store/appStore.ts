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
    id: 'user-1',
    name: 'Visitante',
    credits: 3
  },
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
