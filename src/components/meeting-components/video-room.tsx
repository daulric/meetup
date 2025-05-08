"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ParticipantVideo } from "./participant-video"
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, Users, MessageSquare, MoreVertical } from "lucide-react"

type Participant = {
  id: string
  name: string
  stream?: MediaStream
  audioEnabled: boolean
  videoEnabled: boolean
  isScreenSharing: boolean
}

type VideoRoomProps = {
  roomId: string
}

export function VideoRoom({ roomId }: VideoRoomProps) {
  const router = useRouter()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  // Initialize local media stream
  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        setLocalStream(stream)

        // Add self as a participant
        setParticipants([
          {
            id: "local",
            name: "You",
            stream,
            audioEnabled: true,
            videoEnabled: true,
            isScreenSharing: false,
          },
          // Mock participants for UI demonstration
          {
            id: "participant1",
            name: "John Doe",
            audioEnabled: true,
            videoEnabled: true,
            isScreenSharing: false,
          },
          {
            id: "participant2",
            name: "Jane Smith",
            audioEnabled: false,
            videoEnabled: true,
            isScreenSharing: false,
          },
        ])

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Error accessing media devices:", error)
      }
    }

    initLocalStream()

    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [])

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !audioEnabled
      })
      setAudioEnabled(!audioEnabled)

      // Update local participant
      setParticipants((prev) => prev.map((p) => (p.id === "local" ? { ...p, audioEnabled: !audioEnabled } : p)))
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !videoEnabled
      })
      setVideoEnabled(!videoEnabled)

      // Update local participant
      setParticipants((prev) => prev.map((p) => (p.id === "local" ? { ...p, videoEnabled: !videoEnabled } : p)))
    }
  }

  // Toggle screen sharing
  const toggleScreenSharing = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (localStream) {
        const tracks = localStream.getTracks()
        tracks.forEach((track) => {
          if (track.kind === "video") {
            track.stop()
          }
        })

        // Get camera back
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          })

          setLocalStream(newStream)

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = newStream
          }

          // Update local participant
          setParticipants((prev) =>
            prev.map((p) => (p.id === "local" ? { ...p, stream: newStream, isScreenSharing: false } : p)),
          )
        } catch (error) {
          console.error("Error accessing media devices:", error)
        }
      }

      setIsScreenSharing(false)
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })

        // Keep audio from the original stream
        if (localStream) {
          const audioTracks = localStream.getAudioTracks()
          audioTracks.forEach((track) => {
            screenStream.addTrack(track)
          })
        }

        setLocalStream(screenStream)

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }

        // Update local participant
        setParticipants((prev) =>
          prev.map((p) => (p.id === "local" ? { ...p, stream: screenStream, isScreenSharing: true } : p)),
        )

        // Listen for the end of screen sharing
        const videoTrack = screenStream.getVideoTracks()[0]
        videoTrack.onended = () => {
          toggleScreenSharing()
        }

        setIsScreenSharing(true)
      } catch (error) {
        console.error("Error sharing screen:", error)
      }
    }
  }

  // Leave meeting
  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop()
      })
    }
    router.push("/dashboard")
  }

  // Calculate grid layout
  const getGridTemplateColumns = () => {
    const count = participants.length
    if (count === 1) return "1fr"
    if (count === 2) return "1fr 1fr"
    if (count === 3 || count === 4) return "1fr 1fr"
    return "repeat(3, 1fr)"
  }

  const getGridTemplateRows = () => {
    const count = participants.length
    if (count === 1) return "1fr"
    if (count === 2) return "1fr"
    if (count === 3 || count === 4) return "1fr 1fr"
    return "repeat(2, 1fr)"
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] pt-16">
      {/* Meeting info bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-background border-b">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-medium">Meeting: {roomId}</h1>
          <Separator orientation="vertical" className="h-6" />
          <span className="text-sm text-muted-foreground">{participants.length} participants</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}>
            <Users className="h-4 w-4 mr-2" />
            Participants
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsChatOpen(!isChatOpen)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden h-full">
        {/* Video grid */}
        <div className="flex-1 p-2 overflow-auto">
          <div
            className="grid gap-4 h-full"
            style={{
              gridTemplateColumns: getGridTemplateColumns(),
              gridTemplateRows: getGridTemplateRows(),
            }}
          >
            {participants.map((participant) => (
              <ParticipantVideo key={participant.id} participant={participant} isLocal={participant.id === "local"} />
            ))}
          </div>
        </div>

        {/* Sidebar for chat or participants (conditionally rendered) */}
        {(isChatOpen || isParticipantsOpen) && (
          <div className="w-80 border-l bg-background p-4 overflow-y-auto">
            {isChatOpen && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Chat</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <p className="text-center text-sm text-muted-foreground">Chat messages will appear here</p>
                </div>
              </div>
            )}

            {isParticipantsOpen && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Participants ({participants.length})</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsParticipantsOpen(false)}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {participant.name.charAt(0)}
                        </div>
                        <span>
                          {participant.name} {participant.id === "local" && "(You)"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {!participant.audioEnabled && <MicOff className="h-4 w-4 text-muted-foreground" />}
                        {!participant.videoEnabled && <VideoOff className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="p-4 bg-background border-t">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">{new Date().toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={audioEnabled ? "outline" : "secondary"} size="icon" onClick={toggleAudio}>
                    {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{audioEnabled ? "Mute microphone" : "Unmute microphone"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={videoEnabled ? "outline" : "secondary"} size="icon" onClick={toggleVideo}>
                    {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{videoEnabled ? "Turn off camera" : "Turn on camera"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={isScreenSharing ? "secondary" : "outline"} size="icon" onClick={toggleScreenSharing}>
                    <ScreenShare className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isScreenSharing ? "Stop sharing screen" : "Share screen"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="icon" onClick={leaveMeeting}>
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Leave meeting</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Room: {roomId}</span>
          </div>
        </div>
      </div>
    </div>
  )
}