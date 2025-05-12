"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Play, Search } from 'lucide-react'
import { useAuth } from "@/context/AuthProvider"
import { useRouter } from "next/navigation"


export default function HomePage({videos}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user: {profile} } = useAuth();
  const router = useRouter();

  return (
    <>
      <main className="min-h-screen pt-15 p-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome {profile?.username}</h1>
              <p className="text-muted-foreground">Your Place of Rest</p>
            </div>
            <div className="flex w-full md:w-auto">
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80"
              />
              <Button variant="ghost" size="icon" className="ml-2">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Browse videos by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto py-4 justify-start">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">JavaScript</span>
                      <span className="text-xs text-muted-foreground">1.2K videos</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 justify-start">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">React</span>
                      <span className="text-xs text-muted-foreground">856 videos</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 justify-start">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">CSS</span>
                      <span className="text-xs text-muted-foreground">743 videos</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 justify-start">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Node.js</span>
                      <span className="text-xs text-muted-foreground">512 videos</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}

function VideoCard({ video }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
          <Link href={`/video/${video.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12">
              <Play className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium line-clamp-2 mb-1">{video.title}</h3>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{video.username}</span>
          <span>{video.views} views</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {video.uploadDate}
        </div>
      </CardContent>
    </Card>
  )
}