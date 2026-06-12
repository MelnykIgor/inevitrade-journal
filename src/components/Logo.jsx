import React from 'react'

export default function Logo({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="3" x2="5" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <rect x="3" y="8" width="4" height="6" rx="1" fill="currentColor" opacity="0.9" />

      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <rect x="10" y="5" width="4" height="9" rx="1" fill="currentColor" />

      <line x1="19" y1="6" x2="19" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <rect x="17" y="10" width="4" height="5" rx="1" fill="currentColor" opacity="0.75" />
    </svg>
  )
}
