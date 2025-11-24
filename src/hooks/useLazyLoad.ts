import { useState, useEffect, useRef, RefObject } from 'react'

interface UseLazyLoadOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number
}

export const useLazyLoad = <T extends HTMLElement = HTMLDivElement>(
  options: UseLazyLoadOptions = {}
): [RefObject<T>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options.root, options.rootMargin, options.threshold])

  return [ref, isIntersecting]
}

export const useLazyComponent = <T extends HTMLElement = HTMLDivElement>(
  options?: UseLazyLoadOptions
): [RefObject<T>, boolean] => {
  return useLazyLoad<T>({
    rootMargin: '100px',
    threshold: 0.1,
    ...options
  })
}

