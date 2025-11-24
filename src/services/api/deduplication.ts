interface PendingRequest {
  promise: Promise<unknown>
  timestamp: number
}

class RequestDeduplication {
  private pendingRequests = new Map<string, PendingRequest>()
  private readonly DEDUP_WINDOW_MS = 1000

  generateKey(method: string, url: string, data?: unknown): string {
    return `${method}:${url}:${JSON.stringify(data || {})}`
  }

  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const existing = this.pendingRequests.get(key)

    if (existing) {
      const age = Date.now() - existing.timestamp
      if (age < this.DEDUP_WINDOW_MS) {
        return existing.promise as Promise<T>
      }
      this.pendingRequests.delete(key)
    }

    const promise = requestFn().finally(() => {
      setTimeout(() => {
        this.pendingRequests.delete(key)
      }, this.DEDUP_WINDOW_MS)
    })

    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now()
    })

    return promise
  }

  clear(): void {
    this.pendingRequests.clear()
  }
}

export const requestDeduplication = new RequestDeduplication()

