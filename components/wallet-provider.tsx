"use client"

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import { WalletErrorBoundary } from "./wallet-error-boundary"

// Suppress AptosConnect errors globally
if (typeof window !== "undefined") {
  const originalError = console.error
  console.error = (...args) => {
    const message = args[0]
    if (
      typeof message === "string" && 
      (message.includes("Network not supported") || 
       message.includes("AptosConnect"))
    ) {
      return // Suppress these specific errors
    }
    originalError.apply(console, args)
  }

  // Also suppress unhandled errors from AptosConnect
  window.addEventListener("error", (event) => {
    if (
      event.message?.includes("Network not supported") ||
      event.error?.message?.includes("Network not supported") ||
      event.filename?.includes("aptos-connect")
    ) {
      event.preventDefault()
      return false
    }
  })

  // Suppress unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason?.message?.includes("Network not supported") ||
      event.reason?.message?.includes("AptosConnect")
    ) {
      event.preventDefault()
      return false
    }
  })
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletErrorBoundary>
      <AptosWalletAdapterProvider autoConnect={false}>
        {children}
      </AptosWalletAdapterProvider>
    </WalletErrorBoundary>
  )
}
