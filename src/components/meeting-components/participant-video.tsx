"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MicOff, ScreenShare } from "lucide-react"

type Participant = {
  id: string
  name: string
  stream?: MediaStream
  audioEnabled: boolean
  videoEnabled: boolean
  isScreenSharing: boolean
}

type ParticipantVideoProps = {
  participant: Participant
  isLocal: boolean
}

export function ParticipantVideo({ participant, isLocal }: ParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream
    }
  }, [participant.stream])

  return (
    <Card className="relative overflow-hidden h-full w-full">
      <CardContent className="p-0 h-full flex items-center justify-center bg-muted">
        {participant.videoEnabled && participant.stream ? (
          <video ref={videoRef} autoPlay playsInline muted={isLocal} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold">
              {participant.name.charAt(0)}
            </div>
            <div className="mt-2 text-sm font-medium">{participant.name}</div>
          </div>
        )}

        {/* Status indicators */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-1">
          {!participant.audioEnabled && (
            <div className="bg-background/80 p-1 rounded-full">
              <MicOff className="h-4 w-4 text-destructive" />
            </div>
          )}
          {participant.isScreenSharing && (
            <div className="bg-background/80 p-1 rounded-full">
              <ScreenShare className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>

        {/* Participant name */}
        <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
          {participant.name} {isLocal && "(You)"}
        </div>
      </CardContent>
    </Card>
  )
}