interface ApiErrorPayload {
  message?: string
  error?: string
  details?: string
  errors?: string[] | Record<string, string | string[]>
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function extractMessageFromPayload(payload: unknown): string | null {
  if (typeof payload === 'string') {
    const trimmedPayload = payload.trim()
    return trimmedPayload || null
  }

  if (!isObject(payload)) return null

  const { message, error, details, errors } = payload as ApiErrorPayload

  if (typeof message === 'string' && message.trim()) return message.trim()
  if (typeof error === 'string' && error.trim()) return error.trim()
  if (typeof details === 'string' && details.trim()) return details.trim()

  if (Array.isArray(errors)) {
    const firstError = errors.find((item) => typeof item === 'string' && item.trim())
    if (firstError) return firstError.trim()
  }

  if (isObject(errors)) {
    for (const value of Object.values(errors)) {
      if (typeof value === 'string' && value.trim()) return value.trim()
      if (Array.isArray(value)) {
        const firstValue = value.find((item) => typeof item === 'string' && item.trim())
        if (firstValue) return firstValue.trim()
      }
    }
  }

  return null
}

export async function throwApiError(response: Response, fallbackMessage: string): Promise<never> {
  let payload: unknown = null

  try {
    const contentType = response.headers.get('content-type') ?? ''
    payload = contentType.includes('application/json') ? await response.json() : await response.text()
  } catch {
    payload = null
  }

  throw new Error(extractMessageFromPayload(payload) ?? fallbackMessage)
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}
