"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ThumbsUp,
  ThumbsDown,
  Share,
  MessageSquare,
  Clock,
  Bookmark,
  MoreHorizontal,
  Flame,
  Heart,
} from "lucide-react"
import { VideoCard } from "@/components/video-card"
import { useAuth } from "@/context/AuthProvider"

// Mock video data
const videos = {
  video1: {
    id: "video1",
    title: "How to Build a Next.js Application",
    description:
      "In this comprehensive tutorial, we'll walk through building a complete Next.js application from scratch. We'll cover routing, data fetching, styling, and deployment to Vercel.",
    videoUrl: "/placeholder.svg?height=720&width=1280", // In a real app, this would be a video file
    views: "1.2M",
    likes: "45K",
    uploadDate: "May 15, 2023",
    creator: {
      name: "TechGuru",
      subscribers: "1.2M",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    comments: [
      {
        id: "comment1",
        user: "WebDev123",
        avatar: "/placeholder.svg?height=40&width=40",
        text: "This tutorial was super helpful! I was struggling with Next.js routing but now it makes sense.",
        likes: 24,
        time: "2 days ago",
      },
      {
        id: "comment2",
        user: "CodeNewbie",
        avatar: "/placeholder.svg?height=40&width=40",
        text: "Great explanation! Could you make a tutorial on authentication with Next.js?",
        likes: 18,
        time: "1 week ago",
      },
    ],
  },
  video2: {
    id: "video2",
    title: "React Hooks Explained",
    description:
      "Learn all about React Hooks in this detailed tutorial. We'll cover useState, useEffect, useContext, useReducer, and how to create your own custom hooks.",
    videoUrl: "/placeholder.svg?height=720&width=1280",
    views: "856K",
    likes: "32K",
    uploadDate: "June 3, 2023",
    creator: {
      name: "CodeMaster",
      subscribers: "950K",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    comments: [
      {
        id: "comment1",
        user: "ReactFan",
        avatar: "/placeholder.svg?height=40&width=40",
        text: "Finally someone explained useReducer in a way that makes sense!",
        likes: 42,
        time: "3 days ago",
      },
    ],
  },
  // Add more videos as needed
}

// Trending videos
const trendingVideos = [
  {
    id: "trending1",
    title: "10 JavaScript Tips You Didn't Know",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "1.5M",
    duration: "14:25",
    creator: "JSMaster",
    createdAt: "1 week ago",
  },
  {
    id: "trending2",
    title: "CSS Grid Layout Tutorial",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "980K",
    duration: "18:30",
    creator: "CSSWizard",
    createdAt: "2 weeks ago",
  },
  {
    id: "trending3",
    title: "Building a Full-Stack App with Next.js",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "750K",
    duration: "32:15",
    creator: "FullStackDev",
    createdAt: "3 days ago",
  },
  {
    id: "trending4",
    title: "React vs Vue: Which Should You Choose?",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "1.1M",
    duration: "22:40",
    creator: "FrameworkGuru",
    createdAt: "1 month ago",
  },
]

// Recommended videos
const recommendedVideos = [
  {
    id: "rec1",
    title: "TypeScript for Beginners",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "325K",
    duration: "18:52",
    creator: "TypeMaster",
    createdAt: "1 month ago",
  },
  {
    id: "rec2",
    title: "Building a REST API with Node.js",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "287K",
    duration: "22:15",
    creator: "BackendDev",
    createdAt: "2 weeks ago",
  },
  {
    id: "rec3",
    title: "Responsive Design Best Practices",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "198K",
    duration: "14:30",
    creator: "MobileFirst",
    createdAt: "3 weeks ago",
  },
  {
    id: "rec4",
    title: "Git Workflow for Teams",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "156K",
    duration: "16:48",
    creator: "DevOpsGuru",
    createdAt: "1 month ago",
  },
]

// Related videos
const relatedVideos = [
  {
    id: "related1",
    title: "Next.js vs Gatsby vs Create React App",
    thumbnail: "/placeholder.svg?height=120&width=200",
    views: "450K",
    duration: "15:22",
    creator: "TechGuru",
    createdAt: "1 month ago",
  },
  {
    id: "related2",
    title: "Server Components in Next.js 13",
    thumbnail: "/placeholder.svg?height=120&width=200",
    views: "320K",
    duration: "10:15",
    creator: "ReactMaster",
    createdAt: "2 weeks ago",
  },
  {
    id: "related3",
    title: "Building a Full-Stack App with Next.js and Prisma",
    thumbnail: "/placeholder.svg?height=120&width=200",
    views: "215K",
    duration: "28:45",
    creator: "FullStackDev",
    createdAt: "3 weeks ago",
  },
]

export default function VideoPage() {
  const params = useParams()
  const videoId = params.videoId;
  const video = videos[videoId] || videos.video1 // Fallback to first video if not found
  const { user } = useAuth()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [comment, setComment] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const videoRef = useRef(null)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const handleLike = () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to like videos",
      })
      return
    }

    if (isLiked) {
      setIsLiked(false)
    } else {
      setIsLiked(true)
      setIsDisliked(false)
    }
  }

  const handleDislike = () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to dislike videos",
      })
      return
    }

    if (isDisliked) {
      setIsDisliked(false)
    } else {
      setIsDisliked(true)
      setIsLiked(false)
    }
  }

  const handleSubscribe = () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to subscribe to channels",
      })
      return
    }

    setIsSubscribed(!isSubscribed)
    if (!isSubscribed) {
      toast.success(`Subscribed to ${video.creator.name}`, {
        description: "You'll be notified about new uploads",
      })
    }
  }

  const handleSave = () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to save videos",
      })
      return
    }

    setIsSaved(!isSaved)
    if (!isSaved) {
      toast.success("Video saved", {
        description: "Added to your Watch Later playlist",
      })
    } else {
      toast.success("Video removed", {
        description: "Removed from your Watch Later playlist",
      })
    }
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard", {
      description: "Share this video with your friends",
    })
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()

    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to comment",
      })
      return
    }

    if (comment.trim()) {
      toast.success("Comment posted", {
        description: "Your comment has been added",
      })
      setComment("")
    }
  }

  return (
    <main className="min-h-screen pt-20 p-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Video Player Section */}
        <div className="mb-8">
          <div className="relative bg-black rounded-lg overflow-hidden" ref={videoRef}>
            <div className="aspect-video flex items-center justify-center">
              {/* This would be a real video element in a production app */}
              <video 
                src={video.videoUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlay}
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-16 w-16 bg-black/50 hover:bg-black/70"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
              </div>

              {/* Video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button onClick={togglePlay} variant="ghost" size="icon" className="text-white">
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button onClick={toggleMute} variant="ghost" size="icon" className="text-white">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <div className="text-white text-xs">0:00 / 12:34</div>
                  </div>
                  <Button onClick={toggleFullscreen} variant="ghost" size="icon" className="text-white">
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 text-sm text-muted-foreground">
              <div>
                {video.views} views • {video.uploadDate}
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Button
                  variant={isLiked ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center"
                  onClick={handleLike}
                >
                  <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  {video.likes}
                </Button>
                <Button
                  variant={isDisliked ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center"
                  onClick={handleDislike}
                >
                  <ThumbsDown className={`h-4 w-4 mr-1 ${isDisliked ? "fill-current" : ""}`} />
                  Dislike
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant={isSaved ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center"
                  onClick={handleSave}
                >
                  <Clock className={`h-4 w-4 mr-1 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Creator Info */}
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={video.creator.avatar || "/placeholder.svg"} alt={video.creator.name} />
                <AvatarFallback>{video.creator.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{video.creator.name}</h3>
                <p className="text-sm text-muted-foreground">{video.creator.subscribers} subscribers</p>
                <p className="mt-2 text-sm">{video.description}</p>
              </div>
              <Button variant={isSubscribed ? "outline" : "default"} onClick={handleSubscribe}>
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Comments */}
            <div>
              <h3 className="font-semibold flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                {video.comments.length} Comments
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mt-4 flex items-start space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user ? user.email?.charAt(0).toUpperCase() || "U" : "G"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="resize-none"
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <Button type="button" variant="ghost" onClick={() => setComment("")}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!comment.trim()}>
                      Comment
                    </Button>
                  </div>
                </div>
              </form>

              {/* Comment List */}
              <div className="mt-6 space-y-6">
                {video.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
                      <AvatarFallback>{comment.user[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{comment.user}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="mt-1 text-sm">{comment.text}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <Button variant="ghost" size="sm" className="h-auto py-0">
                          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-auto py-0">
                          <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-auto py-0">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Video Recommendations */}
        <div className="mt-12">
          <Tabs defaultValue="related" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="related">
                <Bookmark className="h-4 w-4 mr-2" />
                Related
              </TabsTrigger>
              <TabsTrigger value="trending">
                <Flame className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recommended">
                <Heart className="h-4 w-4 mr-2" />
                Recommended
              </TabsTrigger>
              <TabsTrigger value="new">
                <Clock className="h-4 w-4 mr-2" />
                New
              </TabsTrigger>
            </TabsList>

            <TabsContent value="related" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>

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

            <TabsContent value="new" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Mix of videos for the "New" tab */}
                {[...trendingVideos.slice(0, 2), ...recommendedVideos.slice(0, 2)].map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}