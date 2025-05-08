"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Flame, Clock, ThumbsUp, Search } from 'lucide-react'
import { useAuth } from "@/context/AuthProvider"

// Mock video data
const trendingVideos = [
  {
    id: "video1",
    title: "How to Build a Next.js Application",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "1.2M",
    duration: "12:34",
    creator: "TechGuru",
    createdAt: "2 weeks ago",
  },
  {
    id: "video2",
    title: "React Hooks Explained",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "856K",
    duration: "8:42",
    creator: "CodeMaster",
    createdAt: "3 days ago",
  },
  {
    id: "video3",
    title: "CSS Grid vs Flexbox",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "543K",
    duration: "15:21",
    creator: "WebDesignPro",
    createdAt: "1 week ago",
  },
  {
    id: "video4",
    title: "JavaScript Array Methods You Should Know",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "421K",
    duration: "10:15",
    creator: "JSNinja",
    createdAt: "5 days ago",
  },
]

const recommendedVideos = [
  {
    id: "video5",
    title: "TypeScript for Beginners",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "325K",
    duration: "18:52",
    creator: "TypeMaster",
    createdAt: "1 month ago",
  },
  {
    id: "video6",
    title: "Building a REST API with Node.js",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "287K",
    duration: "22:15",
    creator: "BackendDev",
    createdAt: "2 weeks ago",
  },
  {
    id: "video7",
    title: "Responsive Design Best Practices",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "198K",
    duration: "14:30",
    creator: "MobileFirst",
    createdAt: "3 weeks ago",
  },
  {
    id: "video8",
    title: "Git Workflow for Teams",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "156K",
    duration: "16:48",
    creator: "DevOpsGuru",
    createdAt: "1 month ago",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user: {profile} } = useAuth()

  return (
    <>
      <main className="min-h-screen pt-20 p-4 bg-background">
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

          <Tabs defaultValue="trending" className="mb-8">
            <TabsList>
              <TabsTrigger value="trending">
                <Flame className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recommended">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Recommended
              </TabsTrigger>
              <TabsTrigger value="recent">
                <Clock className="h-4 w-4 mr-2" />
                Recently Watched
              </TabsTrigger>
            </TabsList>
            <TabsContent value="trending" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="recommended" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="recent" className="mt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No recently watched videos</p>
                <Button variant="outline" className="mt-4">
                  Browse videos
                </Button>
              </div>
            </TabsContent>
          </Tabs>

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
          src={video.thumbnail || "/placeholder.svg"} 
          alt={video.title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
          {video.duration}
        </div>
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
          <span>{video.creator}</span>
          <span>{video.views} views</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {video.createdAt}
        </div>
      </CardContent>
    </Card>
  )
}