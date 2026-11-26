'use client'

import axios from 'axios'
import { useEffect } from 'react'

/** Links an authenticated Adonis user to Medusa on the first storefront visit.
 * Failures are intentionally silent; guests and checklists must stay usable. */
export function CommerceCustomerLink() {
  useEffect(() => {
    void axios.post('/api/commerce/customer').catch(() => {})
  }, [])
  return null
}
