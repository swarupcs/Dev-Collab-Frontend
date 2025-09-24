import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, UserCheck, UserX, X, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"


export function ConnectionFeed() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ignoredUsers, setIgnoredUsers] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [handledRequests, setHandledRequests] = useState([])
  const [suggestedConnections, setSuggestedConnections] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchSuggestedConnections = async (search) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append("search", search)

      const response = await fetch(`/api/connections?${params}`)
      const result = await response.json()

      if (result.success) {
        setSuggestedConnections(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch connections",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch connections",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch("/api/connections/requests?type=received")
      const result = await response.json()

      if (result.success) {
        setPendingRequests(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch requests",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch requests",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchSuggestedConnections()
    fetchPendingRequests()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSuggestedConnections(searchQuery)
      } else {
        fetchSuggestedConnections()
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleIgnore = async (userId) => {
    try {
      setActionLoading(userId)
      const response = await fetch("/api/connections/ignore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ignoredUserId: userId }),
      })

      const result = await response.json()

      if (result.success) {
        setIgnoredUsers((prev) => [...prev, userId])
        toast({
          title: "Success",
          description: "User ignored successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to ignore user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ignore user",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleConnect = async (userId) => {
    try {
      setActionLoading(userId)
      const response = await fetch("/api/connections/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: userId }),
      })

      const result= await response.json()

      if (result.success) {
        setSentRequests((prev) => [...prev, userId])
        toast({
          title: "Success",
          description: "Connection request sent successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send connection request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleAcceptRequest = async (userId) => {
    try {
      setActionLoading(userId)
      const response = await fetch(`/api/connections/requests/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      })

      const result = await response.json()

      if (result.success) {
        setHandledRequests((prev) => [...prev, userId])
        toast({
          title: "Success",
          description: "Connection request accepted",
        })
        // Refresh pending requests
        fetchPendingRequests()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to accept request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectRequest = async (userId) => {
    try {
      setActionLoading(userId)
      const response = await fetch(`/api/connections/requests/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      })

      const result = await response.json()

      if (result.success) {
        setHandledRequests((prev) => [...prev, userId])
        toast({
          title: "Success",
          description: "Connection request declined",
        })
        // Refresh pending requests
        fetchPendingRequests()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to decline request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline request",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const filteredSuggestions = suggestedConnections.filter((user) => !ignoredUsers.includes(user.id))
  const activePendingRequests = pendingRequests.filter((user) => !handledRequests.includes(user.id))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Dev-Collab</h1>
              <p className="text-muted-foreground">Connect with developers worldwide</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search developers, skills, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              Requests
              {activePendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activePendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="mt-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Suggested Connections</h2>
              <p className="text-muted-foreground">Discover developers who share your interests and skills</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading connections...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSuggestions.map((user) => (
                  <Card key={user.id} className="p-6 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">{user.name}</h3>
                            <p className="text-muted-foreground">{user.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.company} • {user.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {user.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {user.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.skills.length - 4} more
                            </Badge>
                          )}
                        </div>

                        {user.mutualConnections && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {user.mutualConnections} mutual connections
                          </p>
                        )}

                        <div className="flex gap-2">
                          {sentRequests.includes(user.id) ? (
                            <Button disabled className="flex-1">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Request Sent
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleConnect(user.id)}
                              className="flex-1"
                              disabled={actionLoading === user.id}
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <UserPlus className="h-4 w-4 mr-2" />
                              )}
                              Connect
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleIgnore(user.id)}
                            disabled={actionLoading === user.id}
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredSuggestions.length === 0 && (
              <div className="text-center py-12">
                <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No connections found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Connection Requests</h2>
              <p className="text-muted-foreground">Review and respond to incoming connection requests</p>
            </div>

            <div className="space-y-4">
              {activePendingRequests.map((user) => (
                <Card key={user.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{user.name}</h3>
                          <p className="text-muted-foreground">{user.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.company} • {user.location}
                          </p>
                          {user.requestDate && (
                            <p className="text-sm text-muted-foreground mt-1">Sent {user.requestDate}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {user.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {user.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.skills.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAcceptRequest(user.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRejectRequest(user.id)}
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <X className="h-4 w-4 mr-2" />
                          )}
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {activePendingRequests.length === 0 && (
              <div className="text-center py-12">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No pending requests</h3>
                <p className="text-muted-foreground">You're all caught up with connection requests</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
