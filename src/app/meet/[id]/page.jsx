"use client"
import { useParams } from "next/navigation"
import { VideoRoom } from "@/components/meeting-components/video-room"

export default function RoomPage() {
  const params = useParams()
  const roomId = params.id;

  return (
    <div className="h-screen w-screen bg-background">
      <VideoRoom roomId={roomId} />
    </div>
  )
}