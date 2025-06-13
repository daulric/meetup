"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { VideoCard } from "@/components/video-card"
import { Filter, Search } from "lucide-react"
import GetSearchDetails from "@/lib/videos/GetSearchDetails";

// Mock search results data
const mockSearchResults = [
  {
    id: "1a2b3c",
    title: "Exploring the Caribbean Beaches",
    thumbnail: "https://example.com/thumbnails/beach.jpg",
    views: "1.2M",
    uploadDate: "2024-07-01",
    username: "islandVibes"
  },
  {
    id: "4d5e6f",
    title: "React Tutorial for Beginners",
    thumbnail: "https://example.com/thumbnails/react.jpg",
    views: "857K",
    uploadDate: "2024-06-25",
    username: "devGuy"
  },
  {
    id: "7g8h9i",
    title: "Top 10 Anime of 2024",
    thumbnail: "https://example.com/thumbnails/anime.jpg",
    views: "3.4M",
    uploadDate: "2024-08-15",
    username: "otakuQueen"
  },
  {
    id: "0j1k2l",
    title: "How to Cook Jerk Chicken",
    thumbnail: "https://example.com/thumbnails/jerk.jpg",
    views: "540K",
    uploadDate: "2024-05-10",
    username: "chefB"
  },
  {
    id: "3m4n5o",
    title: "Unboxing the Latest iPhone",
    thumbnail: "https://example.com/thumbnails/iphone.jpg",
    views: "2.1M",
    uploadDate: "2024-09-02",
    username: "techUnbox"
  }
];

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState(mockSearchResults)
  const [sortBy, setSortBy] = useState("relevance")
  const [uploadTime, setUploadTime] = useState("any")
  const [duration, setDuration] = useState("any")
  const [type, setType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Simulate search results based on query
  useEffect(() => {
    async function getVideoData() {
      if (query) {
        // In a real app, this would be an API call
        const filteredResults = await GetSearchDetails(query);
        console.log(filteredResults)
        setResults(filteredResults);
      } else {
        setResults(mockSearchResults)
      }
    }

    getVideoData();
  }, [query])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    // In a real app, this would trigger a new search with sorting
    const sortedResults = [...results]

    switch (value) {
      case "upload_date":
        sortedResults.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
        break
      case "view_count":
        sortedResults.sort((a, b) => {
          const aViews =
            Number.parseFloat(a.views.replace(/[KM]/g, "")) *
            (a.views.includes("M") ? 1000000 : a.views.includes("K") ? 1000 : 1)
          const bViews =
            Number.parseFloat(b.views.replace(/[KM]/g, "")) *
            (b.views.includes("M") ? 1000000 : b.views.includes("K") ? 1000 : 1)
          return bViews - aViews
        })
        break
      /*case "duration":
        sortedResults.sort((a, b) => {
          const aDuration = a.duration.split(":").reduce((acc, time) => 60 * acc + +time, 0)
          const bDuration = b.duration.split(":").reduce((acc, time) => 60 * acc + +time, 0)
          return bDuration - aDuration
        })
        break*/
      default:
        // Keep original order for relevance
        break
    }

    setResults(sortedResults)
  }

  const clearFilters = () => {
    setSortBy("relevance")
    setUploadTime("any")
    setDuration("any")
    setType("all")
    setResults(mockSearchResults)
  }

  const hasActiveFilters = sortBy !== "relevance" || uploadTime !== "any" || duration !== "any" || type !== "all"

  return (
    <main className="min-h-screen pt-20 p-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Search className="h-6 w-6 mr-2" />
                Search Results
              </h1>
              {query && (
                <p className="text-muted-foreground mt-1">
                  Results for "{query}" • {results.length} videos found
                </p>
              )}
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort by</label>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="upload_date">Upload date</SelectItem>
                      <SelectItem value="view_count">View count</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Upload time</label>
                  <Select value={uploadTime} onValueChange={setUploadTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="hour">Last hour</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="year">This year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any duration</SelectItem>
                      <SelectItem value="short">Under 4 minutes</SelectItem>
                      <SelectItem value="medium">4-20 minutes</SelectItem>
                      <SelectItem value="long">Over 20 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="channel">Channel</SelectItem>
                      <SelectItem value="playlist">Playlist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="ghost" onClick={clearFilters} className="text-sm">
                    Clear all filters
                  </Button>
                </div>
              )}
            </Card>
          )}

          <Separator />
        </div>

        {/* Search Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                {query
                  ? `No videos found for "${query}". Try different keywords or check your spelling.`
                  : "Enter a search term to find videos."}
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Try searching for:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Different keywords</li>
                  <li>More general terms</li>
                  <li>Creator names</li>
                </ul>
              </div>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {results.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="px-8">
              Load more results
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
