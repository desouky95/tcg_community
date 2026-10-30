'use client'

import { useEffect } from 'react'

/** Links an authenticated Adonis user to Medusa on the first storefront visit.
 * Failures are intentionally silent; guests and checklists must stay usable. */
export function CommerceCustomerLink() {
  useEffect(() => {
    void fetch('/api/commerce/customer', { method: 'POST', credentials: 'same-origin' })
  }, [])
  return null
}
