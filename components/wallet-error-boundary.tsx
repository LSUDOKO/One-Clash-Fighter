"use client"

import React from "react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

export class WalletErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Wallet Error Boundary caught an error:", error, errorInfo)
    
    // Check if it's the AptosConnect network error
    if (error.message?.includes("Network not supported") || 
        error.stack?.includes("AptosConnect") ||
        error.stack?.includes("aptos-connect")) {
      console.warn("AptosConnect wallet not supported on Movement Network - ignoring error")
      // Don't crash the app for this known issue
      this.setState({ hasError: false }) // Reset error to prevent crash
      return
    }
    
    // For other errors, set the error state
    this.setState({ hasError: true, error })
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
        Wallet Connection Issue
      </h3>
      <p className="text-yellow-700 mb-4">
        {error?.message?.includes("Network not supported") 
          ? "AptosConnect wallet is not supported on Movement Network. Please use Petra, Martian, or other compatible wallets."
          : "There was an error connecting to the wallet. Please try again."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}
