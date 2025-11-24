import DOMPurify from 'dompurify'

export class SecurityUtils {
  static sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'title'],
    })
  }

  static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return text.replace(/[&<>"']/g, m => map[m])
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '')
  }

  static generateCSRFToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  static validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url)
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }

  static rateLimitCheck(
    key: string,
    maxRequests: number,
    windowMs: number
  ): { allowed: boolean; remaining: number } {
    const storageKey = `rate_limit_${key}`
    const now = Date.now()
    const stored = localStorage.getItem(storageKey)

    if (!stored) {
      const data = { count: 1, resetAt: now + windowMs }
      localStorage.setItem(storageKey, JSON.stringify(data))
      return { allowed: true, remaining: maxRequests - 1 }
    }

    const data = JSON.parse(stored)

    if (now > data.resetAt) {
      const newData = { count: 1, resetAt: now + windowMs }
      localStorage.setItem(storageKey, JSON.stringify(newData))
      return { allowed: true, remaining: maxRequests - 1 }
    }

    if (data.count >= maxRequests) {
      return { allowed: false, remaining: 0 }
    }

    data.count++
    localStorage.setItem(storageKey, JSON.stringify(data))
    return { allowed: true, remaining: maxRequests - data.count }
  }
}
