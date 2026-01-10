import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { SoundProvider } from "@/components/sound-context"
import { MuteButton } from "@/components/mute-button"
import { MovementProvider } from "@/providers/MovementProvider"
import { AptosWalletProvider } from "@/components/AptosWalletProvider"

export const metadata: Metadata = {
  title: "One Clash Fighters - Ultimate Fighting Championship",
  description: "Movement Network blockchain fighting game - Play-to-Earn NFT battles",
  manifest: "/manifest.json",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
          // Aggressively suppress wallet extension errors to prevent app crashes
          (function() {
            if (typeof window === 'undefined') return;

            // Patterns of errors to suppress
            const suppressPatterns = [
              'Invalid property descriptor',
              'Cannot both specify accessors and a value',
              'Cannot set property ethereum',
              'Cannot redefine property: ethereum',
              'MetaMask encountered an error',
              'Backpack couldn\\'t override'
            ];

            // 1. Suppress console.error
            const originalConsoleError = console.error;
            console.error = function(...args) {
              const msg = args.join(' ');
              if (suppressPatterns.some(p => msg.includes(p))) return;
              originalConsoleError.apply(console, args);
            };

            // 2. Suppress global errors (prevents Next.js overlay for these)
            window.addEventListener('error', function(event) {
              if (event.error && suppressPatterns.some(p => event.error.message.includes(p))) {
                event.preventDefault();
                event.stopImmediatePropagation();
              }
            }, true);

            // 3. Suppress unhandled promise rejections
            window.addEventListener('unhandledrejection', function(event) {
              if (event.reason && suppressPatterns.some(p => (event.reason.message || String(event.reason)).includes(p))) {
                event.preventDefault();
                event.stopImmediatePropagation();
              }
            }, true);
          })();
        ` }} />
      </head>
      <body className="bg-black min-h-screen">
        <AptosWalletProvider>
          <MovementProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
              <SoundProvider>
                <MuteButton />
                <main className="min-h-screen">{children}</main>
              </SoundProvider>
            </ThemeProvider>
          </MovementProvider>
        </AptosWalletProvider>
      </body>
    </html>
  )
}
