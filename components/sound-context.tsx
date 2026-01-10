"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SoundContextType = {
  isMuted: boolean
  toggleMute: () => void
  playSFX: (soundName: "punch" | "kick" | "jump" | "hit" | "win") => void
}

const SoundContext = createContext<SoundContextType>({
  isMuted: false,
  toggleMute: () => { },
  playSFX: () => { },
})

export const useSoundContext = () => useContext(SoundContext)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Background music enabled
    const audioElement = new Audio("/sounds/background-music.mp3")
    audioElement.loop = true
    audioElement.volume = 0.2 // Set volume to 20%
    setAudio(audioElement)

    // Clean up on unmount
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ""
      }
    }
  }, [])

  useEffect(() => {
    if (!audio) return

    if (isMuted) {
      audio.pause()
    } else {
      // Only play if the document has been interacted with
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play was prevented, we'll need user interaction
          console.log("One Clash Fighters: Audio playback was prevented:", error)
        })
      }
    }
  }, [audio, isMuted])

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const playSFX = (soundName: "punch" | "kick" | "jump" | "hit" | "win") => {
    if (isMuted) return

    const sfx = new Audio(`/sounds/${soundName}.mp3`)
    sfx.volume = 0.5
    sfx.play().catch(err => console.log("SFX play error:", err))
  }

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSFX }}>
      {children}
    </SoundContext.Provider>
  )
}
