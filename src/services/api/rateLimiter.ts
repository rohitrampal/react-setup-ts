import { SecurityUtils } from '@/utils/security'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

class RateLimiter {
  private config: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60000
  }

  setConfig(config: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...config }
  }

  async checkLimit(endpoint: string): Promise<boolean> {
    const key = `api_rate_limit_${endpoint}`
    const result = SecurityUtils.rateLimitCheck(
      key,
      this.config.maxRequests,
      this.config.windowMs
    )

    if (!result.allowed) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }

    return true
  }
}

export const rateLimiter = new RateLimiter()

